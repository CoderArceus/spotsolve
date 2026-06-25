import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit, getClientIp } from "@/lib/rateLimiter";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    // Rate limiting: 10 upvotes per minute per IP
    const clientIp = getClientIp(req);
    const rateLimitResult = checkRateLimit(clientIp, {
      maxRequests: 10,
      windowMs: 60 * 1000,
    });

    if (!rateLimitResult.success) {
      return NextResponse.json(
        {
          error: "Rate limit exceeded",
          retryAfter: rateLimitResult.retryAfter,
        },
        {
          status: 429,
          headers: {
            "Retry-After": (rateLimitResult.retryAfter || 60).toString(),
          },
        },
      );
    }

    const { ticketId } = await req.json();
    if (!ticketId) {
      return NextResponse.json({ error: "Missing ticketId" }, { status: 400 });
    }

    const { adminDb } = await import("@/lib/firebase-admin");
    const { FieldValue } = await import("firebase-admin/firestore");

    const ref = adminDb.collection("tickets").doc(ticketId);
    const snap = await ref.get();

    if (!snap.exists) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
    }

    const data = snap.data()!;
    const newCount = (data.upvotes ?? 0) + 1;
    const update: Record<string, unknown> = {
      upvotes: FieldValue.increment(1),
    };

    const COMMUNITY_FLAG_THRESHOLD = 5;
    if (newCount >= COMMUNITY_FLAG_THRESHOLD && data.status === "AI Verified") {
      update.status = "Community Flagged";
      update.statusHistory = FieldValue.arrayUnion({
        status: "Community Flagged",
        timestamp: new Date().toISOString(),
        note: `Reached ${COMMUNITY_FLAG_THRESHOLD} community upvotes`,
      });
    }

    await ref.update(update);

    return NextResponse.json({ success: true, upvotes: newCount });
  } catch (err) {
    console.error("[upvote] Error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
