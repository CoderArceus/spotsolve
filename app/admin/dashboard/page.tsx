import { adminDb } from "@/lib/firebase-admin";
import { AlertCircle, CheckCircle, Clock, FileText } from "lucide-react";

export const dynamic = "force-dynamic";
export const revalidate = 0;

async function getDashboardStats() {
  const [totalSnap, pendingSnap, resolvedSnap] = await Promise.all([
    adminDb.collection("tickets").count().get(),
    adminDb.collection("tickets").where("status", "in", ["Reported", "AI Verified", "In Progress"]).count().get(),
    adminDb.collection("tickets").where("status", "==", "Resolved").count().get(),
  ]);

  return {
    total: totalSnap.data().count,
    pending: pendingSnap.data().count,
    resolved: resolvedSnap.data().count,
    critical: 0, // Placeholder until severity is tracked as a counter or we do a full fetch
  };
}

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();

  const metrics = [
    { title: "Total Reports", value: stats.total, icon: FileText, color: "text-blue-400", bg: "bg-blue-400/10", border: "border-blue-400/20" },
    { title: "Pending Resolution", value: stats.pending, icon: Clock, color: "text-amber-400", bg: "bg-amber-400/10", border: "border-amber-400/20" },
    { title: "Resolved Issues", value: stats.resolved, icon: CheckCircle, color: "text-emerald-400", bg: "bg-emerald-400/10", border: "border-emerald-400/20" },
    { title: "Critical Alerts", value: stats.critical, icon: AlertCircle, color: "text-red-400", bg: "bg-red-400/10", border: "border-red-400/20" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-24">
      <div>
        <h1 className="text-4xl font-bold text-white tracking-tight">City Overview</h1>
        <p className="text-[#a1a1aa] text-sm mt-2">
          High-level metrics and operational status for all departments.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m, i) => {
          const Icon = m.icon;
          return (
            <div key={i} className={`glass-card p-6 rounded-2xl border ${m.border}`}>
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${m.bg}`}>
                  <Icon className={`w-6 h-6 ${m.color}`} />
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-zinc-400">{m.title}</p>
                <p className="text-3xl font-bold text-white mt-1">{m.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        <div className="glass-card p-6 rounded-3xl border border-white/5 h-[400px]">
          <h2 className="text-xl font-bold text-white mb-4">Live Activity</h2>
          <div className="flex items-center justify-center h-full text-zinc-500">
            Activity feed coming soon...
          </div>
        </div>
        
        <div className="glass-card p-6 rounded-3xl border border-white/5 h-[400px]">
          <h2 className="text-xl font-bold text-white mb-4">Department Performance</h2>
          <div className="flex items-center justify-center h-full text-zinc-500">
            Performance charts coming soon...
          </div>
        </div>
      </div>
    </div>
  );
}
