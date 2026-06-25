import { NextRequest, NextResponse } from "next/server";
import { PaginationSchema } from "@/lib/schemas";
import { Ticket } from "@/types";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const limit  = parseInt(searchParams.get("limit")  ?? "20");
    const cursor = searchParams.get("cursor"); // ISO string of last createdAt

    const { adminDb } = await import("@/lib/firebase-admin");

    let query = adminDb
      .collection("tickets")
      .where("isValidIssue", "==", true)
      .orderBy("createdAt", "desc")
      .limit(limit);

    // If cursor exists, start after it
    if (cursor) {
      // In Firestore, if createdAt is a string, we pass the string cursor.
      // If it is a timestamp, we pass new Date(cursor) or Timestamp.fromDate
      // Since it might be a string, let's try passing the string directly first.
      query = query.startAfter(cursor);
    }

    const snap = await query.get();

    const tickets = snap.docs.map((d) => {
      const data = d.data();
      return {
        id: d.id,
        ...data,
        createdAt: data.createdAt?.toDate
          ? data.createdAt.toDate().toISOString()
          : data.createdAt,
      } as Ticket;
    });

    const lastDoc = snap.docs[snap.docs.length - 1];
    let nextCursor = null;
    if (lastDoc) {
      const data = lastDoc.data();
      nextCursor = data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt;
    }

    return NextResponse.json(
      {
        tickets,
        pagination: {
          nextCursor,
          hasMore: snap.docs.length === limit,
        },
      },
      { status: 200 }
    );
  } catch (err) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const error = err as any;
    // Handle Firestore not initialized (NOT_FOUND error code 5)
    if (error?.code === 5 || error?.message?.includes("NOT_FOUND")) {
      return NextResponse.json(
        {
          tickets: [],
          pagination: {
            offset: 0,
            limit: 20,
            total: 0,
            hasMore: false,
          },
        },
        { status: 200 },
      );
    }
    console.error("[tickets] Error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
