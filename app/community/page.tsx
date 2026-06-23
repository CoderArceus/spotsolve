import { Ticket } from "@/types";
import { InfiniteTicketFeed } from "@/components/InfiniteTicketFeed";
import { HeroesLeaderboard } from "@/components/HeroesLeaderboard";
import { adminDb } from "@/lib/firebase-admin";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
    <div className="space-y-8 max-w-3xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-white">Community & Heroes</h1>
        <p className="text-[#71717a] text-sm mt-1">
          Recent reports, community verification, and local heroes.
        </p>
      </div>

      <Tabs defaultValue="feed" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-[#18181b] border border-[#27272a] mb-8">
          <TabsTrigger value="feed">Live Feed</TabsTrigger>
          <TabsTrigger value="heroes">Top Heroes</TabsTrigger>
        </TabsList>
        <TabsContent value="feed" className="mt-0">
          <div className="bg-[#18181b] rounded-2xl border border-[#27272a] p-4 sm:p-6 shadow-xl">
            <InfiniteTicketFeed initialTickets={initialTickets} />
          </div>
        </TabsContent>
        <TabsContent value="heroes" className="mt-0">
          <HeroesLeaderboard />
        </TabsContent>
      </Tabs>
    </div>
  );
}
