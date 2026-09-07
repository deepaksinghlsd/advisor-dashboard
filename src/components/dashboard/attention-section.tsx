"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, TriangleAlert } from "lucide-react";
import { AttentionCard } from "@/components/dashboard/attention-card";
import type { ClientsNeedingAttention } from "@/lib/types";

const GAP = 16;

export function AttentionSection({ data }: { data: ClientsNeedingAttention }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setAtStart(el.scrollLeft <= 1);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 1);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    updateScrollState();
    el.addEventListener("scroll", updateScrollState, { passive: true });
    const observer = new ResizeObserver(updateScrollState);
    observer.observe(el);
    return () => {
      el.removeEventListener("scroll", updateScrollState);
      observer.disconnect();
    };
  }, [updateScrollState]);

  const scrollByCard = (dir: 1 | -1) => {
    const el = scrollRef.current;
    if (!el) return;
    const card = el.firstElementChild as HTMLElement | null;
    const step = (card?.offsetWidth ?? 300) + GAP;
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  return (
    <div className="flex h-full min-w-0 flex-col rounded-2xl border border-black/5 bg-white/60 p-5">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TriangleAlert className="h-4 w-4 text-amber-500" strokeWidth={2} />
          <h2 className="text-sm font-semibold text-[#1b1626]">
            CLIENTS NEEDING ATTENTION
          </h2>
          <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-amber-400 px-1.5 text-xs font-semibold text-[#1b1626]">
            {data.count}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Previous clients"
            onClick={() => scrollByCard(-1)}
            disabled={atStart}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-black/10 bg-white text-[#1b1626]/60 transition-opacity hover:bg-black/5 disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:bg-white"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            aria-label="Next clients"
            onClick={() => scrollByCard(1)}
            disabled={atEnd}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-black/10 bg-white text-[#1b1626]/60 transition-opacity hover:bg-black/5 disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:bg-white"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div
        ref={scrollRef}
        className="flex flex-1 snap-x snap-mandatory gap-4 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {data.cards.map((card) => (
          <AttentionCard key={card.name} card={card} />
        ))}
      </div>
    </div>
  );
}
