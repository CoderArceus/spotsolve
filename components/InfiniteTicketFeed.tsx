"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Ticket } from "@/types";
import { TicketFeed } from "./TicketFeed";
import { Loader2 } from "lucide-react";

interface PaginationResponse {
  tickets: Ticket[];
  pagination: {
    offset: number;
    limit: number;
    total: number;
    hasMore: boolean;
  };
}

export function InfiniteTicketFeed({ initialTickets }: { initialTickets: Ticket[] }) {
  const [tickets, setTickets] = useState<Ticket[]>(initialTickets);
  const [offset, setOffset] = useState(initialTickets.length);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const observerTarget = useRef<HTMLDivElement>(null);

  const loadMore = useCallback(async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/tickets?limit=20&offset=${offset}`);
      if (!response.ok) throw new Error("Failed to load tickets");

      const data: PaginationResponse = await response.json();
      setTickets((prev) => [...prev, ...data.tickets]);
      setOffset(data.pagination.offset + data.pagination.limit);
      setHasMore(data.pagination.hasMore);
    } catch (err) {
      console.error("[InfiniteTicketFeed] Load error:", err);
    } finally {
      setIsLoading(false);
    }
  }, [offset, isLoading, hasMore]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          loadMore();
        }
      },
      { threshold: 0.1 },
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [loadMore, hasMore, isLoading]);

  return (
    <div className="space-y-4">
      <TicketFeed tickets={tickets} />
      {(hasMore || isLoading) && (
        <div ref={observerTarget} className="flex justify-center py-8">
          {isLoading && <Loader2 className="w-5 h-5 animate-spin text-[#10b981]" />}
        </div>
      )}
      {!hasMore && tickets.length > 0 && (
        <div className="text-center py-8 text-[#71717a] text-sm">
          No more issues to load
        </div>
      )}
    </div>
  );
}
