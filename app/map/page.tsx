import { Ticket } from "@/types";
import TicketMap from "@/components/TicketMap";
import { StatsDashboard } from "@/components/StatsDashboard";
import { adminDb } from "@/lib/firebase-admin";

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
    const err = error as any;
    if (err?.code === 5 || err?.message?.includes("NOT_FOUND")) {
      console.log("[map] Firestore not initialized yet");
      return [];
    }
    console.error("[map] Failed to fetch all tickets:", error);
    return [];
  }
}

export default async function MapPage() {
  const allTickets = await getAllTickets();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Live Map & Analytics</h1>
        <p className="text-[#71717a] text-sm mt-1">
          Geospatial visualization and overview of community issues.
        </p>
      </div>

      <StatsDashboard tickets={allTickets} />

      <div className="bg-[#18181b] rounded-2xl border border-[#27272a] p-4 shadow-xl">
        <TicketMap tickets={allTickets} />
      </div>
    </div>
  );
}
