import { formatDistanceToNow, format } from "date-fns";
import { CheckCircle2, Circle, XCircle, Clock } from "lucide-react";
import { TicketStatus, StatusEvent } from "@/types";

// Only the forward pipeline — Rejected is handled separately
const PIPELINE: TicketStatus[] = [
  "Reported",
  "AI Verified",
  "Dispatched",
  "Resolved",
];

const STAGE_LABELS: Record<TicketStatus, { label: string; sublabel: string }> = {
  "Reported":          { label: "Reported",    sublabel: "Issue submitted by citizen"        },
  "AI Verified":       { label: "AI Verified", sublabel: "Gemini confirmed it's a real issue" },
  "Dispatched":        { label: "Dispatched",  sublabel: "Sent to municipal team"            },
  "Resolved":          { label: "Resolved",    sublabel: "Issue confirmed fixed"             },
  "Rejected":          { label: "Rejected",    sublabel: "Not a valid public issue"          },
};

interface Props {
  status:        TicketStatus;
  statusHistory: StatusEvent[];
}

export function ResolutionTimeline({ status, statusHistory }: Props) {
  const isRejected    = status === "Rejected";
  const currentIndex  = PIPELINE.indexOf(status);

  // Build a lookup: stage → its StatusEvent (if it happened)
  const eventMap = statusHistory.reduce<Record<string, StatusEvent>>((acc, e) => {
    acc[e.status] = e;
    return acc;
  }, {});

  if (isRejected) {
    return (
      <div className="flex items-center gap-3 rounded-lg bg-[#450a0a]/60 border border-[#ef4444]/20 px-4 py-3">
        <XCircle className="w-4 h-4 text-[#ef4444] shrink-0" />
        <div>
          <p className="text-sm font-medium text-[#ef4444]">Not a valid issue</p>
          <p className="text-xs text-[#71717a] mt-0.5">
            Gemini determined this image does not show a public infrastructure problem.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-0">
      {PIPELINE.map((stage, i) => {
        const done    = i <= currentIndex;
        const active  = i === currentIndex;
        const event   = eventMap[stage];
        const isLast  = i === PIPELINE.length - 1;
        const config  = STAGE_LABELS[stage];

        return (
          <div key={stage} className="flex gap-3">
            {/* Left column: icon + connector line */}
            <div className="flex flex-col items-center">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 border-2 transition-all duration-300 ${
                  done
                    ? active
                      ? "border-[#10b981] bg-[#052e16] ring-2 ring-[#10b981]/20"
                      : "border-[#10b981] bg-[#052e16]"
                    : "border-[#27272a] bg-[#09090b]"
                }`}
              >
                {done ? (
                  <CheckCircle2 className="w-4 h-4 text-[#10b981]" />
                ) : (
                  <Circle className="w-3.5 h-3.5 text-[#3f3f46]" />
                )}
              </div>
              {/* Connector line */}
              {!isLast && (
                <div
                  className={`w-px flex-1 my-1 min-h-[24px] transition-colors duration-300 ${
                    done && i < currentIndex ? "bg-[#10b981]/40" : "bg-[#27272a]"
                  }`}
                />
              )}
            </div>

            {/* Right column: text */}
            <div className={`pb-5 ${isLast ? "pb-0" : ""}`}>
              <p
                className={`text-sm font-medium leading-none mt-1 ${
                  active ? "text-white" : done ? "text-[#a1a1aa]" : "text-[#3f3f46]"
                }`}
              >
                {config.label}
              </p>
              <p className="text-xs text-[#71717a] mt-0.5">{config.sublabel}</p>

              {/* Timestamp from history */}
              {event && (
                <p className="text-[10px] text-[#3f3f46] mt-1 flex items-center gap-1">
                  <Clock className="w-2.5 h-2.5" />
                  {formatDistanceToNow(new Date(event.timestamp), { addSuffix: true })}
                  {event.note && (
                    <span className="ml-1 text-[#3f3f46]">· {event.note}</span>
                  )}
                </p>
              )}

              {/* Pending label for future stages */}
              {!done && (
                <p className="text-[10px] text-[#27272a] mt-1">Pending</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
