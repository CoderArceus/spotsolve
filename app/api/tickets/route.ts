import { NextRequest, NextResponse } from "next/server";
import { PaginationSchema } from "@/lib/schemas";
import { Ticket } from "@/types";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    // Extract and validate pagination params
    const searchParams = req.nextUrl.searchParams;
    const limit = parseInt(searchParams.get("limit") ?? "20");
    const offset = parseInt(searchParams.get("offset") ?? "0");

    const pagination = PaginationSchema.safeParse({ limit, offset });
    if (!pagination.success) {
      return NextResponse.json(
        {
          error: "Invalid pagination params",
          details: pagination.error.flatten(),
        },
        { status: 400 },
      );
    }

    const { adminDb } = await import("@/lib/firebase-admin");

    // Fetch all tickets first (no composite index needed)
    const allSnap = await adminDb
      .collection("tickets")
      .orderBy("createdAt", "desc")
      .get();

    const allTickets = allSnap.docs
      .map((d) => {
        const data = d.data();
        return {
          id: d.id,
          ...data,
          createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt,
        } as Ticket;
      })
      .filter((t) => t.isValidIssue);
    const total = allTickets.length;

    // Apply pagination client-side
    const tickets = allTickets.slice(
      pagination.data.offset,
      pagination.data.offset + pagination.data.limit,
    );

    return NextResponse.json(
      {
        tickets,
        pagination: {
          offset: pagination.data.offset,
          limit: pagination.data.limit,
          total,
          hasMore: pagination.data.offset + pagination.data.limit < total,
        },
      },
      { status: 200 },
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
