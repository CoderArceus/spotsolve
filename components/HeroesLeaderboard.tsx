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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {MOCK_HEROES.slice(0, 3).map((hero, index) => (
          <Card key={hero.id} className={`p-6 border-[#27272a] bg-[#18181b] relative overflow-hidden group hover:border-emerald-500/50 transition-all ${index === 0 ? "md:-mt-4" : ""}`}>
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-teal-400" />
            
            <div className="flex flex-col items-center text-center">
              <div className="relative mb-4">
                {index === 0 && <Crown className="absolute -top-6 left-1/2 -translate-x-1/2 w-6 h-6 text-yellow-400 drop-shadow-md" />}
                <img src={hero.avatar} alt={hero.name} className="w-20 h-20 rounded-full border-4 border-[#27272a]" />
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-xs font-bold text-black border-2 border-[#18181b]">
                  {index + 1}
                </div>
              </div>
              
              <h3 className="text-lg font-bold text-white mb-1">{hero.name}</h3>
              <p className="text-emerald-400 text-sm font-medium mb-3">Level {hero.level} {hero.rank}</p>
              
              <div className="w-full flex justify-between text-xs text-zinc-400 mb-4 px-4">
                <div className="flex flex-col"><span className="text-white font-bold">{hero.reports}</span> Reports</div>
                <div className="flex flex-col"><span className="text-white font-bold">{hero.resolved}</span> Resolved</div>
                <div className="flex flex-col"><span className="text-emerald-400 font-bold">{hero.xp}</span> XP</div>
              </div>

              <div className="flex flex-wrap gap-1 justify-center">
                {hero.badges.map(badge => (
                  <Badge key={badge} variant="outline" className="text-[10px] py-0 border-emerald-500/30 text-emerald-300 bg-emerald-500/10">
                    {badge}
                  </Badge>
                ))}
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="space-y-2">
        {MOCK_HEROES.slice(3).map((hero, index) => (
          <div key={hero.id} className="flex items-center gap-4 p-4 rounded-xl border border-[#27272a] bg-[#18181b]/50 hover:bg-[#27272a]/50 transition-colors">
            <div className="w-8 text-center font-mono font-bold text-zinc-500">#{index + 4}</div>
            <img src={hero.avatar} alt={hero.name} className="w-10 h-10 rounded-full" />
            <div className="flex-1 min-w-0">
              <h4 className="text-white font-medium truncate">{hero.name}</h4>
              <div className="flex items-center gap-2 text-xs text-zinc-400">
                <span className="text-emerald-400">Level {hero.level}</span>
                <span>•</span>
                <span>{hero.xp} XP</span>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-4 text-sm text-zinc-400">
              <div className="flex items-center gap-1"><Shield className="w-4 h-4" /> {hero.resolved}</div>
              <div className="flex items-center gap-1"><Star className="w-4 h-4 text-yellow-500" /> {hero.reports}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
