import { Suspense } from "react";
import { Ticket } from "@/types";
import { InfiniteTicketFeed } from "@/components/InfiniteTicketFeed";
import { HeroesLeaderboard } from "@/components/HeroesLeaderboard";
import { adminDb } from "@/lib/firebase-admin";
import { Loader2 } from "lucide-react";

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

async function FeedContainer() {
  const initialTickets = await getTickets();
  return <InfiniteTicketFeed initialTickets={initialTickets} />;
}

function FeedSkeleton() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-emerald-500 space-y-4">
      <Loader2 className="w-8 h-8 animate-spin" />
      <p className="text-zinc-400 text-sm font-medium animate-pulse">Loading community feed...</p>
    </div>
  );
}

export default function CommunityPage() {
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
          <div className="glass-card rounded-3xl p-4 sm:p-6 shadow-2xl min-h-[500px]">
            <h2 className="text-xl font-bold text-white mb-6">Live Feed</h2>
            <Suspense fallback={<FeedSkeleton />}>
              <FeedContainer />
            </Suspense>
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
