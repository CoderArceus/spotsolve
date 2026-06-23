import { Medal, Shield, Star, Zap, TrendingUp, CheckCircle, Activity, Trophy } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export default function ProfilePage() {
  // Mock Data
  const user = {
    name: "Alex Patel",
    handle: "@alexp",
    level: 8,
    title: "Urban Guardian",
    xp: 4250,
    nextLevelXp: 5000,
    avatarSeed: "alexp123",
    stats: {
      reports: 47,
      verified: 45,
      accuracy: 95.7,
      streak: 12
    },
    badges: [
      { name: "First Responder", icon: Zap, color: "text-amber-400", bg: "bg-amber-400/10", border: "border-amber-400/20" },
      { name: "Pothole Hunter", icon: Activity, color: "text-rose-400", bg: "bg-rose-400/10", border: "border-rose-400/20" },
      { name: "Verified Reporter", icon: CheckCircle, color: "text-emerald-400", bg: "bg-emerald-400/10", border: "border-emerald-400/20" },
      { name: "Top 10%", icon: Trophy, color: "text-indigo-400", bg: "bg-indigo-400/10", border: "border-indigo-400/20" },
    ]
  };

  return (
    <div className="max-w-[1000px] mx-auto pb-32 animate-in fade-in duration-500 px-6 pt-10">
      {/* Header Profile Section */}
      <div className="glass-card rounded-3xl p-8 shadow-2xl relative overflow-hidden mb-8 border-emerald-500/10">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-[80px] -mr-20 -mt-20" />
        
        <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
          <div className="relative">
            <img 
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.avatarSeed}`} 
              alt="Avatar" 
              className="w-32 h-32 rounded-full border-4 border-[#18181b] bg-[#27272a] shadow-xl"
            />
            <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-black text-xs font-bold px-3 py-1 rounded-full border-2 border-[#18181b]">
              LVL {user.level}
            </div>
          </div>
          
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-4xl font-bold text-white tracking-tight">{user.name}</h1>
            <p className="text-zinc-400 text-lg mb-4">{user.handle} • {user.title}</p>
            
            <div className="w-full max-w-md bg-black/40 border border-white/5 rounded-2xl p-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-zinc-400 font-medium">Level {user.level} Progress</span>
                <span className="text-emerald-400 font-mono">{user.xp} / {user.nextLevelXp} XP</span>
              </div>
              {/* <Progress value={(user.xp / user.nextLevelXp) * 100} className="h-2 bg-zinc-800 indicator-emerald-500" /> */}
              <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-emerald-500 rounded-full" 
                  style={{ width: `${(user.xp / user.nextLevelXp) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column: Stats */}
        <div className="space-y-8">
          <h2 className="text-xl font-bold text-white tracking-tight">Impact Stats</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="glass-card p-5 rounded-2xl text-center">
              <div className="text-3xl font-bold text-white mb-1">{user.stats.reports}</div>
              <div className="text-xs text-zinc-500 uppercase tracking-wider font-medium">Reports</div>
            </div>
            <div className="glass-card p-5 rounded-2xl text-center">
              <div className="text-3xl font-bold text-emerald-400 mb-1">{user.stats.verified}</div>
              <div className="text-xs text-zinc-500 uppercase tracking-wider font-medium">Verified</div>
            </div>
            <div className="glass-card p-5 rounded-2xl text-center">
              <div className="text-3xl font-bold text-blue-400 mb-1">{user.stats.accuracy}%</div>
              <div className="text-xs text-zinc-500 uppercase tracking-wider font-medium">Accuracy</div>
            </div>
            <div className="glass-card p-5 rounded-2xl text-center">
              <div className="text-3xl font-bold text-amber-400 mb-1">{user.stats.streak}🔥</div>
              <div className="text-xs text-zinc-500 uppercase tracking-wider font-medium">Day Streak</div>
            </div>
          </div>
        </div>

        {/* Right Column: Badges & Activity */}
        <div className="md:col-span-2 space-y-8">
          <h2 className="text-xl font-bold text-white tracking-tight">Earned Badges</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {user.badges.map((badge, i) => {
              const Icon = badge.icon;
              return (
                <div key={i} className={`glass-card p-4 rounded-2xl border ${badge.border} flex flex-col items-center justify-center text-center hover:-translate-y-1 transition-transform`}>
                  <div className={`w-12 h-12 rounded-full ${badge.bg} flex items-center justify-center mb-3`}>
                    <Icon className={`w-6 h-6 ${badge.color}`} />
                  </div>
                  <span className="text-sm font-semibold text-zinc-200">{badge.name}</span>
                </div>
              );
            })}
          </div>

          <h2 className="text-xl font-bold text-white tracking-tight pt-4">Recent Activity</h2>
          <div className="glass-card rounded-3xl p-6">
            <div className="space-y-6">
              {[
                { action: "Reported an issue", detail: "Traffic light broken on 5th Ave", time: "2 hours ago", icon: AlertTriangle, color: "text-amber-400" },
                { action: "Earned a Badge", detail: "Unlocked 'Verified Reporter' badge", time: "1 day ago", icon: Medal, color: "text-emerald-400" },
                { action: "Upvoted", detail: "Pothole on Main St", time: "2 days ago", icon: TrendingUp, color: "text-blue-400" },
              ].map((act, i) => {
                const Icon = act.icon;
                return (
                  <div key={i} className="flex gap-4 items-start">
                    <div className={`mt-1 bg-[#18181b] border border-white/10 p-2 rounded-full`}>
                      <Icon className={`w-4 h-4 ${act.color}`} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{act.action}</p>
                      <p className="text-sm text-zinc-400">{act.detail}</p>
                      <p className="text-xs text-zinc-600 mt-1">{act.time}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// We need a small mock icon since AlertTriangle isn't imported from lucide-react at the top
import { AlertTriangle } from "lucide-react";
