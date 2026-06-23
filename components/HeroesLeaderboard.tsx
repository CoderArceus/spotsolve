import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Shield, Star, Medal, Crown } from "lucide-react";

interface Hero {
  id: string;
  name: string;
  avatar: string;
  level: number;
  xp: number;
  rank: string;
  reports: number;
  resolved: number;
  badges: string[];
}

const MOCK_HEROES: Hero[] = [
  {
    id: "1",
    name: "Aryan Patel",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aryan",
    level: 42,
    xp: 12450,
    rank: "Champion",
    reports: 156,
    resolved: 142,
    badges: ["Top Contributor", "Night Guardian"],
  },
  {
    id: "2",
    name: "Sarah Chen",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    level: 38,
    xp: 11200,
    rank: "Champion",
    reports: 134,
    resolved: 128,
    badges: ["Community Hero", "Early Reporter"],
  },
  {
    id: "3",
    name: "Michael Rodriguez",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
    level: 25,
    xp: 8400,
    rank: "Protector",
    reports: 89,
    resolved: 85,
    badges: ["First Critical Alert"],
  },
  {
    id: "4",
    name: "Emma Watson",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma",
    level: 15,
    xp: 4200,
    rank: "Guardian",
    reports: 45,
    resolved: 40,
    badges: ["100 Reports"],
  },
  {
    id: "5",
    name: "David Kim",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
    level: 8,
    xp: 1500,
    rank: "Watcher",
    reports: 12,
    resolved: 10,
    badges: [],
  },
];

export function HeroesLeaderboard() {
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 mb-8">
        {MOCK_HEROES.slice(0, 3).map((hero, index) => (
          <Card key={hero.id} className="p-4 border-[#27272a] bg-[#18181b] relative overflow-hidden group hover:border-emerald-500/50 transition-all flex items-center gap-4">
            <div className="absolute top-0 left-0 h-full w-1 bg-gradient-to-b from-emerald-500 to-teal-400" />
            
            <div className="relative shrink-0">
              {index === 0 && <Crown className="absolute -top-3 -left-3 w-5 h-5 text-yellow-400 drop-shadow-md rotate-[-15deg] z-10" />}
              <img src={hero.avatar} alt={hero.name} className="w-14 h-14 rounded-full border-2 border-[#27272a]" />
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center text-[10px] font-bold text-black border-2 border-[#18181b]">
                {index + 1}
              </div>
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-bold text-white truncate">{hero.name}</h3>
              <p className="text-emerald-400 text-xs font-medium mb-1">Lvl {hero.level} {hero.rank}</p>
              
              <div className="flex flex-wrap gap-1">
                {hero.badges.slice(0, 1).map(badge => (
                  <Badge key={badge} variant="outline" className="text-[9px] py-0 border-emerald-500/30 text-emerald-300 bg-emerald-500/10 px-1.5 truncate max-w-[100px]">
                    {badge}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="text-right shrink-0">
              <div className="text-sm font-bold text-emerald-400">{hero.xp} <span className="text-[10px] font-normal text-zinc-500">XP</span></div>
              <div className="text-xs text-zinc-400 font-medium">{hero.reports} rep</div>
            </div>
          </Card>
        ))}
      </div>

      <div className="space-y-2">
        <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3">Honorable Mentions</h4>
        {MOCK_HEROES.slice(3).map((hero, index) => (
          <div key={hero.id} className="flex items-center gap-3 p-3 rounded-xl border border-[#27272a] bg-[#18181b]/50 hover:bg-[#27272a]/50 transition-colors">
            <div className="w-5 text-center font-mono font-bold text-zinc-500 text-xs">#{index + 4}</div>
            <img src={hero.avatar} alt={hero.name} className="w-8 h-8 rounded-full" />
            <div className="flex-1 min-w-0">
              <h4 className="text-sm text-white font-medium truncate">{hero.name}</h4>
            </div>
            <div className="text-xs font-bold text-emerald-400 shrink-0">
              {hero.xp} <span className="font-normal text-zinc-500">XP</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
