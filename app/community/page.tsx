import { Suspense } from "react";
import { Ticket } from "@/types";
import { InfiniteTicketFeed } from "@/components/InfiniteTicketFeed";
import { HeroesLeaderboard } from "@/components/HeroesLeaderboard";
import { adminDb } from "@/lib/firebase-admin";
import { Loader2 } from "lucide-react";

export const dynamic = "force-dynamic";
export const revalidate = 0;

async function getTickets(): Promise<{ tickets: Ticket[]; nextCursor: string | null }> {
  try {
    // Removed .where("isValidIssue", "==", true) to avoid requiring a composite index,
    // since we now discard invalid reports automatically at creation!
    const snap = await adminDb
      .collection("tickets")
      .orderBy("createdAt", "desc")
      .limit(20)
      .get();
    
    const tickets = snap.docs.map((d) => {
      const data = d.data();
      return {
        id: d.id,
        ...data,
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt,
      } as Ticket;
    });

    const lastDoc = snap.docs[snap.docs.length - 1];
    let nextCursor = null;
    if (lastDoc) {
      const data = lastDoc.data();
      nextCursor = data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt;
    }

    return { tickets, nextCursor };
  } catch (error) {
    console.error("[getTickets] Failed to fetch community tickets:", error);
    return { tickets: [], nextCursor: null };
  }
}

async function FeedContainer() {
  const { tickets, nextCursor } = await getTickets();
  return <InfiniteTicketFeed initialTickets={tickets} nextCursor={nextCursor} />;
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
