"use client";

import { useMemo, useRef, useState } from "react";
import {
  Activity,
  ArrowUpRight,
  RotateCcw,
  Search,
  SlidersHorizontal,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import {
  NetworkGraph,
  type GraphFilter,
  type NetworkGraphHandle,
} from "@/components/dashboard/network-graph";
import { graphData } from "@/lib/graph-data";
import type { RmHeartbeat } from "@/lib/types";

const FILTER_MAP: Record<string, GraphFilter> = {
  All: "All",
  Equity: "equity",
  Debt: "debt",
  "Mutual Funds": "mutualFunds",
  REITs: "reits",
  "Alerts Only": "Alerts Only",
};

export function HeartbeatBar({ data }: { data: RmHeartbeat }) {
  const [activeFilter, setActiveFilter] = useState(data.filters[0]);
  const [search, setSearch] = useState("");
  const graphRef = useRef<NetworkGraphHandle>(null);

  const [changePart, trailing] = useMemo(() => {
    const idx = data.aumChange.indexOf(" vs ");
    if (idx === -1) return [data.aumChange, null] as const;
    return [data.aumChange.slice(0, idx), data.aumChange.slice(idx + 1)] as const;
  }, [data.aumChange]);

  return (
    <div className="flex flex-col overflow-hidden rounded-2xl bg-gradient-to-br from-[#201931] via-[#161020] to-[#0c0a12]">
      <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-start sm:justify-between sm:p-6">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10">
              <Activity className="h-4 w-4 text-white/80" strokeWidth={2} />
            </span>
            <h2 className="font-semibold text-white">{data.label}</h2>
            <span className="rounded-full bg-white/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wide text-white/60">
              {data.badge}
            </span>
          </div>
          <p className="mt-2 font-mono text-xs uppercase tracking-wide text-white/40">
            {data.clients} CLIENTS · {data.holdings} HOLDINGS ·{" "}
            <span className="text-amber-400">{data.flagged} FLAGGED</span>
          </p>
        </div>
        <div className="flex flex-col items-start gap-2 sm:items-end">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-semibold text-white sm:text-4xl">{data.totalAum}</span>
            <span className="font-mono text-xs uppercase tracking-wide text-white/40">
              Total AUM
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="flex items-center gap-1 rounded-full bg-emerald-400/15 px-2.5 py-1 font-medium text-emerald-400">
              <ArrowUpRight className="h-3 w-3" strokeWidth={2.5} />
              {changePart}
            </span>
            {trailing && <span className="text-white/40">{trailing}</span>}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 border-t border-white/5 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <div className="flex flex-wrap gap-2">
          {data.filters.map((label) => (
            <button
              key={label}
              type="button"
              onClick={() => setActiveFilter(label)}
              className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
                activeFilter === label
                  ? "bg-white text-[#1b1626]"
                  : "text-white/50 hover:bg-white/10 hover:text-white/80"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-white/40" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search ticker or client"
              className="w-48 rounded-full border border-white/10 bg-white/5 py-1.5 pl-8 pr-3 text-sm text-white placeholder:text-white/35 focus:outline-none focus:ring-1 focus:ring-white/30"
            />
          </div>
          <button
            type="button"
            className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-white/70 hover:bg-white/10"
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            Asset Types
          </button>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              aria-label="Zoom in"
              onClick={() => graphRef.current?.zoomIn()}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 hover:bg-white/10"
            >
              <ZoomIn className="h-4 w-4" />
            </button>
            <button
              type="button"
              aria-label="Zoom out"
              onClick={() => graphRef.current?.zoomOut()}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 hover:bg-white/10"
            >
              <ZoomOut className="h-4 w-4" />
            </button>
            <button
              type="button"
              aria-label="Reset view"
              onClick={() => graphRef.current?.reset()}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 hover:bg-white/10"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="h-[480px] border-t border-white/5 sm:h-[560px]">
        <NetworkGraph
          ref={graphRef}
          data={graphData}
          filter={FILTER_MAP[activeFilter] ?? "All"}
          searchQuery={search}
        />
      </div>
    </div>
  );
}
