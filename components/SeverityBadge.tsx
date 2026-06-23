import { Severity } from "@/types";
import { Badge } from "@/components/ui/badge";

const CONFIG: Record<Severity, { className: string; dot: string }> = {
  Low:      { className: "bg-emerald-950 text-emerald-400 border-emerald-800 hover:bg-emerald-950", dot: "bg-emerald-400" },
  Medium:   { className: "bg-amber-950 text-amber-400 border-amber-800 hover:bg-amber-950",     dot: "bg-amber-400"   },
  High:     { className: "bg-orange-950 text-orange-400 border-orange-800 hover:bg-orange-950",  dot: "bg-orange-400"  },
  Critical: { className: "bg-red-950 text-red-400 border-red-800 hover:bg-red-950",             dot: "bg-red-400"     },
};

export function SeverityBadge({ severity }: { severity: Severity }) {
  const c = CONFIG[severity];
  return (
    <Badge variant="outline" className={`inline-flex items-center gap-1.5 rounded-full text-xs font-medium ${c.className}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {severity}
    </Badge>
  );
}
