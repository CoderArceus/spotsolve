import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { adminAuth } from "@/lib/firebase-admin-auth";
import { cookies } from "next/headers";

export async function DELETE(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("__session")?.value;

    if (!sessionCookie) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie, true);
    const userDoc = await adminDb.collection("users").doc(decodedClaims.uid).get();
    const role = userDoc.data()?.role;

    if (role !== "admin" && role !== "super_admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const ticketId = searchParams.get("id");

    if (!ticketId) {
      return NextResponse.json({ error: "Missing ticket id" }, { status: 400 });
    }

    await adminDb.collection("tickets").doc(ticketId).delete();

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("[delete-report] Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
