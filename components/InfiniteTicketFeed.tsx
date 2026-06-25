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

export function InfiniteTicketFeed({ initialTickets, nextCursor: initialCursor }: { initialTickets: Ticket[], nextCursor: string | null }) {
  const [tickets,   setTickets]  = useState<Ticket[]>(initialTickets);
  const [cursor,    setCursor]   = useState<string | null>(initialCursor);
  const [hasMore,   setHasMore]  = useState(initialCursor !== null);
  const [isLoading, setIsLoading] = useState(false);
  const observerTarget = useRef<HTMLDivElement>(null);

  const isLoadingRef = useRef(false);
  const cursorRef    = useRef(cursor);
  const hasMoreRef   = useRef(hasMore);

  useEffect(() => { cursorRef.current  = cursor;  }, [cursor]);
  useEffect(() => { hasMoreRef.current = hasMore; }, [hasMore]);

  const loadMore = useCallback(async () => {
    if (isLoadingRef.current || !hasMoreRef.current) return;

    isLoadingRef.current = true;
    setIsLoading(true);

    try {
      const url = cursorRef.current
        ? `/api/tickets?limit=20&cursor=${encodeURIComponent(cursorRef.current)}`
        : `/api/tickets?limit=20`;

      const res  = await fetch(url);
      if (!res.ok) throw new Error("Failed");

      const data = await res.json();

      setTickets((prev) => {
        // Deduplicate by id as a safety net
        const existingIds = new Set(prev.map((t) => t.id));
        const fresh = data.tickets.filter((t: Ticket) => !existingIds.has(t.id));
        return [...prev, ...fresh];
      });

      setCursor(data.pagination.nextCursor);
      setHasMore(data.pagination.hasMore);
    } catch {
      setHasMore(false);
    } finally {
      isLoadingRef.current = false;
      setIsLoading(false);
    }
  }, []);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { threshold: 0.1 },
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [loadMore]);

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
