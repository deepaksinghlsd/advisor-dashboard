"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight, TriangleAlert } from "lucide-react";
import { AttentionCard } from "@/components/dashboard/attention-card";
import type { ClientsNeedingAttention } from "@/lib/types";

export function AttentionSection({ data }: { data: ClientsNeedingAttention }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollBy = (dir: 1 | -1) => {
    scrollRef.current?.scrollBy({ left: dir * 320, behavior: "smooth" });
  };

  return (
    <div className="flex h-full flex-col rounded-2xl border border-black/5 bg-white/60 p-5">
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
        <div className="flex items-center gap-2 lg:hidden">
          <button
            type="button"
            aria-label="Scroll left"
            onClick={() => scrollBy(-1)}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-black/10 bg-white text-[#1b1626]/60 hover:bg-black/5"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            aria-label="Scroll right"
            onClick={() => scrollBy(1)}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-black/10 bg-white text-[#1b1626]/60 hover:bg-black/5"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div
        ref={scrollRef}
        className="flex flex-1 gap-4 overflow-x-auto pb-1 snap-x snap-mandatory [scrollbar-width:thin] lg:grid lg:grid-cols-2 lg:overflow-visible xl:grid-cols-4"
      >
        {data.cards.map((card) => (
          <AttentionCard key={card.name} card={card} />
        ))}
      </div>
    </div>
  );
}
