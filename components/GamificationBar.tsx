import { Ticket } from "@/types";
import { Card } from "@/components/ui/card";
import { Flame, Trophy, Star } from "lucide-react";

export function GamificationBar({ tickets }: { tickets: Ticket[] }) {
  const totalReports = tickets.length;
  const criticalCaught = tickets.filter((t) => t.severity === "Critical" && t.isValidIssue).length;
  const totalUpvotes = tickets.reduce((sum, t) => sum + t.upvotes, 0);

  // Simple points system
  const points = totalReports * 10 + criticalCaught * 50 + totalUpvotes * 5;
  const level = Math.floor(points / 100) + 1;
  const progress = points % 100;

  return (
    <Card className="rounded-xl border-[#27272a] bg-[#18181b] p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Trophy className="w-4 h-4 text-[#10b981]" />
          <span className="text-sm font-medium text-white">Community Impact</span>
        </div>
        <span className="text-xs font-mono text-[#10b981]">Level {level}</span>
      </div>

      <div className="w-full bg-[#27272a] rounded-full h-2 mb-3">
        <div
          className="bg-[#10b981] h-2 rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="flex items-center gap-1.5 text-xs text-[#71717a]">
          <Star className="w-3.5 h-3.5 text-amber-400" />
          <span className="font-mono text-white">{points}</span> pts
        </div>
        <div className="flex items-center gap-1.5 text-xs text-[#71717a]">
          <Flame className="w-3.5 h-3.5 text-orange-400" />
          <span className="font-mono text-white">{totalReports}</span> reports
        </div>
        <div className="flex items-center gap-1.5 text-xs text-[#71717a]">
          <Trophy className="w-3.5 h-3.5 text-[#10b981]" />
          <span className="font-mono text-white">{criticalCaught}</span> critical
        </div>
      </div>
    </Card>
  );
}
