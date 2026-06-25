import { NextRequest, NextResponse } from "next/server";
import { adminDb }    from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";
import { TicketStatus, StatusEvent } from "@/types";

// Valid forward-only transitions — you cannot go backwards
const VALID_TRANSITIONS: Record<TicketStatus, TicketStatus[]> = {
  "Reported":          ["AI Verified", "Rejected"],
  "AI Verified":       ["Community Flagged", "Dispatched"],
  "Community Flagged": ["Dispatched"],
  "Dispatched":        ["Resolved"],
  "Resolved":          [],
  "Rejected":          [],
};

export async function POST(req: NextRequest) {
  try {
    const { ticketId, newStatus, note } = (await req.json()) as {
      ticketId:  string;
      newStatus: TicketStatus;
      note?:     string;
    };

    if (!ticketId || !newStatus) {
      return NextResponse.json({ error: "ticketId and newStatus are required" }, { status: 400 });
    }

    // Fetch current ticket
    const ref  = adminDb.collection("tickets").doc(ticketId);
    const snap = await ref.get();

    if (!snap.exists) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
    }

    const current     = snap.data()!;
    const currentStatus = current.status as TicketStatus;

    // Guard: only allow valid forward transitions
    if (!VALID_TRANSITIONS[currentStatus]?.includes(newStatus)) {
      return NextResponse.json(
        { error: `Cannot transition from "${currentStatus}" to "${newStatus}"` },
        { status: 422 }
      );
    }

    const now: StatusEvent = {
      status:    newStatus,
      timestamp: new Date().toISOString(),
      ...(note ? { note } : {}),
    };

    const update: Record<string, unknown> = {
      status:        newStatus,
      statusHistory: FieldValue.arrayUnion(now),
    };

    // Set resolvedAt timestamp when reaching terminal Resolved state
    if (newStatus === "Resolved") {
      update.resolvedAt = now.timestamp;
    }

    await ref.update(update);

    return NextResponse.json({ success: true, status: newStatus });
  } catch (err) {
    console.error("[update-status] Error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
