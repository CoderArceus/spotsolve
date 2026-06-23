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

    await adminDb
      .collection("tickets")
      .doc(ticketId)
      .update({ upvotes: FieldValue.increment(1) });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[upvote] Error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
