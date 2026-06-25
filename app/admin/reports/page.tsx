import { adminDb } from "@/lib/firebase-admin";
import { Ticket } from "@/types";
import { IssueTableClient } from "@/components/admin/IssueTableClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

async function getAllTickets(): Promise<Ticket[]> {
  try {
    const snap = await adminDb
      .collection("tickets")
      .orderBy("createdAt", "desc")
      .limit(100)
      .get();
      
    return snap.docs.map((d) => {
      const data = d.data();
      return {
        id: d.id,
        ...data,
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt,
      } as Ticket;
    });
  } catch (error) {
    console.error("[admin reports] Failed to fetch tickets:", error);
    return [];
  }
}

export default async function AdminReportsPage() {
  const tickets = await getAllTickets();

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-24">
      <div>
        <h1 className="text-4xl font-bold text-white tracking-tight">Reports Center</h1>
        <p className="text-[#a1a1aa] text-sm mt-2">
          Manage, verify, and dispatch civic infrastructure issues.
        </p>
      </div>

      <div className="glass-card rounded-3xl overflow-hidden border border-white/5">
        <IssueTableClient initialTickets={tickets} />
      </div>
    </div>
  );
}
