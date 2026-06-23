import { Ticket } from "@/types";
import { Card } from "@/components/ui/card";

export function StatsDashboard({ tickets }: { tickets: Ticket[] }) {
  const valid = tickets.filter((t) => t.isValidIssue);
  const critical = valid.filter((t) => t.severity === "Critical").length;
  const resolved = valid.filter((t) => t.status === "Resolved").length;
  const avgConfidence = valid.length
    ? (valid.reduce((s, t) => s + t.aiConfidence, 0) / valid.length * 100).toFixed(0)
    : "—";

  const stats = [
    { label: "Total Issues", value: valid.length },
    { label: "Critical Alerts", value: critical },
    { label: "Resolved", value: resolved },
    { label: "Avg AI Confidence", value: `${avgConfidence}%` },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {stats.map((s) => (
        <Card key={s.label} className="rounded-xl border-[#27272a] bg-[#18181b] p-4 text-center">
          <p className="text-2xl font-bold text-white font-mono">{s.value}</p>
          <p className="text-xs text-[#71717a] mt-1">{s.label}</p>
        </Card>
      ))}
    </div>
  );
}
