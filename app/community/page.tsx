import { Ticket } from "@/types";
import { InfiniteTicketFeed } from "@/components/InfiniteTicketFeed";
import { HeroesLeaderboard } from "@/components/HeroesLeaderboard";
import { adminDb } from "@/lib/firebase-admin";

async function getTickets(): Promise<Ticket[]> {
  try {
    const snap = await adminDb
      .collection("tickets")
      .orderBy("createdAt", "desc")
      .limit(20)
      .get();
    return snap.docs
      .map((d) => {
        const data = d.data();
        return {
          id: d.id,
          ...data,
          createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt,
        } as Ticket;
      })
      .filter((t) => t.isValidIssue);
  } catch (error) {
    const err = error as any;
    if (err?.code === 5 || err?.message?.includes("NOT_FOUND")) {
      console.log("[community] Firestore not initialized yet");
      return [];
    }
    console.error("[community] Failed to fetch tickets:", error);
    return [];
  }
}

export default async function CommunityPage() {
  const initialTickets = await getTickets();

  return (
    <div className="space-y-8 max-w-[1400px] mx-auto pb-32 animate-in fade-in duration-500 px-6 pt-10">
      <div>
        <h1 className="text-4xl font-bold text-white tracking-tight">Community & Heroes</h1>
        <p className="text-[#a1a1aa] text-sm mt-2">
          Recent reports, community verification, and local heroes.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 space-y-6">
          <div className="glass-card rounded-3xl p-4 sm:p-6 shadow-2xl">
            <h2 className="text-xl font-bold text-white mb-6">Live Feed</h2>
            <InfiniteTicketFeed initialTickets={initialTickets} />
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-10">
            <HeroesLeaderboard />
          </div>
        </div>
      </div>
    </div>
  );
}
