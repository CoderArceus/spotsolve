import { Ticket } from "@/types";
import TicketMap from "@/components/TicketMap";
import { TicketFeed } from "@/components/TicketFeed";
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
  const validTickets = allTickets.filter((t) => t.isValidIssue);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-24">
      <div>
        <h1 className="text-4xl font-bold text-white tracking-tight">Live Map & Analytics</h1>
        <p className="text-[#a1a1aa] text-sm mt-2">
          Geospatial visualization and overview of community issues.
        </p>
      </div>

      <StatsDashboard tickets={allTickets} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-card rounded-3xl p-4 h-[600px] flex flex-col">
          <TicketMap tickets={allTickets} />
        </div>
        
        <div className="glass-card rounded-3xl p-4 h-[600px] flex flex-col">
          <h2 className="text-lg font-bold text-white mb-4">Live Issues</h2>
          <div className="overflow-y-auto flex-1 pr-2 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent">
            <TicketFeed tickets={validTickets.slice(0, 50)} />
          </div>
        </div>
      </div>
    </div>
  );
}
