"use client";

import { useState } from "react";
import { ChevronUp, Clock } from "lucide-react";
import { Ticket } from "@/types";
import { SeverityBadge } from "./SeverityBadge";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

export function TicketFeed({ tickets }: { tickets: Ticket[] }) {
  const [upvoted, setUpvoted] = useState<Set<string>>(new Set());

  const handleUpvote = async (ticketId: string) => {
    if (upvoted.has(ticketId)) return;
    await fetch("/api/upvote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ticketId }),
    });
    setUpvoted((prev) => new Set([...prev, ticketId]));
  };

  if (tickets.length === 0) {
    return (
      <div className="text-center py-16 text-[#71717a]">
        <p className="text-sm">No issues reported yet.</p>
        <p className="text-xs mt-1">Be the first to flag a community problem.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {tickets.map((ticket) => (
        <Card
          key={ticket.id}
          className="flex gap-4 rounded-xl border-[#27272a] bg-[#18181b] p-4 hover:border-zinc-700 transition-colors"
        >
          {ticket.imageUrl && (
            <img
              src={ticket.imageUrl}
              alt={ticket.category}
              className="w-20 h-20 rounded-xl object-cover shrink-0"
            />
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-medium text-sm text-white">{ticket.category}</span>
                <SeverityBadge severity={ticket.severity} />
                {ticket.emergencyAlertTriggered && (
                  <Badge variant="outline" className="text-xs bg-red-950 text-red-400 border-red-700 rounded-full hover:bg-red-950">
                    Emergency Alert
                  </Badge>
                )}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleUpvote(ticket.id)}
                disabled={upvoted.has(ticket.id)}
                className={`flex items-center gap-1 text-xs rounded-xl ${
                  upvoted.has(ticket.id)
                    ? "border-emerald-700 bg-emerald-950 text-[#10b981] hover:bg-emerald-950"
                    : "border-[#27272a] text-[#71717a] hover:border-zinc-500"
                }`}
              >
                <ChevronUp className="w-3.5 h-3.5" />
                {ticket.upvotes + (upvoted.has(ticket.id) ? 1 : 0)}
              </Button>
            </div>
            <p className="text-sm text-[#71717a] mt-1 line-clamp-2">{ticket.description}</p>
            <div className="flex items-center gap-3 mt-2 text-xs text-zinc-600">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {ticket.createdAt ? ticket.createdAt.split("T")[0] : ""}
              </span>
              <span>{ticket.status}</span>
              <span className="font-mono text-emerald-600">
                {(ticket.aiConfidence * 100).toFixed(0)}% confidence
              </span>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
