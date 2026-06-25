import { NextRequest, NextResponse } from "next/server";
import { adminDb, adminAuth } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
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

    const { ticketId, department } = await req.json();

    if (!ticketId || !department) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const ticketRef = adminDb.collection("tickets").doc(ticketId);
    
    await ticketRef.update({
      status: "Dispatched",
      assignedDepartment: department,
      statusHistory: FieldValue.arrayUnion({
        status: "Dispatched",
        timestamp: new Date().toISOString(),
        note: `Dispatched to ${department} department by Admin.`,
      }),
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("[dispatch] Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
