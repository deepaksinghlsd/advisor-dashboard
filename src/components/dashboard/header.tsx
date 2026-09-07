import { Plus } from "lucide-react";
import type { DashboardStats } from "@/lib/types";

export function DashboardHeader({
  user,
  date,
  stats,
}: {
  user: string;
  date: string;
  stats: DashboardStats;
}) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h1 className="font-serif text-3xl font-medium tracking-tight text-[#1b1626] sm:text-4xl">
          Good morning, {user}
        </h1>
        <p className="mt-2 font-mono text-xs uppercase tracking-wider text-[#1b1626]/45">
          {date} · {stats.clients} CLIENTS · {stats.bookValue}
        </p>
      </div>
      <button
        type="button"
        className="flex items-center gap-1.5 self-start rounded-full bg-[#1b1626] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#2a2237]"
      >
        <Plus className="h-4 w-4" strokeWidth={2} />
        New Review
      </button>
    </div>
  );
}
