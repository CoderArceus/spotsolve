"use client";

import { useState, useEffect } from "react";
import { ChevronUp, MessageSquare, Share, Clock, MapPin } from "lucide-react";
import { Ticket } from "@/types";
import { SeverityBadge } from "./SeverityBadge";
import { ResolutionTimeline } from "./ResolutionTimeline";

export function TicketFeed({ tickets }: { tickets: Ticket[] }) {
  const [upvoted, setUpvoted] = useState<Set<string>>(new Set());

  useEffect(() => {
    try {
      const stored = localStorage.getItem("spotsolve_upvoted");
      if (stored) {
        setUpvoted(new Set(JSON.parse(stored)));
      }
    } catch (e) {
      // ignore
    }
  }, []);

  const handleUpvote = async (ticketId: string) => {
    if (upvoted.has(ticketId)) return;
    
    const newUpvoted = new Set([...upvoted, ticketId]);
    setUpvoted(newUpvoted);
    try {
      localStorage.setItem("spotsolve_upvoted", JSON.stringify(Array.from(newUpvoted)));
    } catch (e) {
      // ignore
    }

    await fetch("/api/upvote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ticketId }),
    });
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
    <div className="space-y-4">
      {tickets.map((ticket) => (
        <div key={ticket.id} className="relative flex gap-3 p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors group">
          {/* Left Column: Avatar & Line */}
          <div className="flex flex-col items-center">
            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${ticket.id}`} alt="Avatar" className="w-10 h-10 rounded-full border border-white/10 bg-[#18181b]" />
            <div className="w-[1px] flex-1 bg-gradient-to-b from-white/10 to-transparent my-2" />
          </div>

          {/* Right Column: Content */}
          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex items-center justify-between gap-2 mb-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-white text-sm">Community Member</span>
                <span className="text-xs text-zinc-500">•</span>
                <span className="text-xs text-zinc-500 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {ticket.createdAt ? new Date(ticket.createdAt).toLocaleDateString() : "Just now"}
                </span>
              </div>
            </div>

            {/* Title & Badges */}
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <h3 className="text-base font-semibold text-zinc-200">{ticket.category}</h3>
              <SeverityBadge severity={ticket.severity} />
            </div>

            {/* Description */}
            <p className="text-sm text-zinc-400 mb-3 leading-relaxed">{ticket.description}</p>

            {/* Image (if any) */}
            {ticket.imageUrl && (
              <div className="mb-4 overflow-hidden rounded-xl border border-white/10 max-h-[300px]">
                <img src={ticket.imageUrl} alt={ticket.category} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
              </div>
            )}

            {/* Status Timeline */}
            <div className="mt-4 mb-4">
              <ResolutionTimeline
                status={ticket.status}
                statusHistory={ticket.statusHistory ?? []}
              />
            </div>

            {/* Actions Bar */}
            <div className="flex items-center gap-6 text-zinc-500">
              <button 
                onClick={() => handleUpvote(ticket.id)}
                disabled={upvoted.has(ticket.id)}
                className={`flex items-center gap-1.5 text-sm transition-colors ${upvoted.has(ticket.id) ? "text-emerald-400" : "hover:text-emerald-400"}`}
              >
                <ChevronUp className="w-4 h-4" />
                <span className="font-medium">{ticket.upvotes + (upvoted.has(ticket.id) ? 1 : 0)}</span>
              </button>
              <button className="flex items-center gap-1.5 text-sm hover:text-white transition-colors">
                <MessageSquare className="w-4 h-4" />
                <span className="font-medium">{(ticket.id.charCodeAt(0) + ticket.id.charCodeAt(ticket.id.length - 1)) % 20}</span>
              </button>
              <button className="flex items-center gap-1.5 text-sm hover:text-white transition-colors">
                <Share className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
