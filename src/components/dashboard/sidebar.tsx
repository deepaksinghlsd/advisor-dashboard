"use client";

import { Briefcase, Gem, Home, LineChart, Search, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "Home", icon: Home, active: true },
  { label: "Portfolio", icon: Briefcase, active: false },
  { label: "Performance", icon: LineChart, active: false },
  { label: "Settings", icon: Settings, active: false },
];

function NavButton({
  icon: Icon,
  active,
  label,
}: {
  icon: typeof Home;
  active: boolean;
  label: string;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex h-11 w-11 items-center justify-center rounded-xl transition-colors",
        active
          ? "bg-[#1b1626] text-white shadow-sm"
          : "text-[#1b1626]/45 hover:bg-black/5 hover:text-[#1b1626]/80"
      )}
    >
      <Icon className="h-5 w-5" strokeWidth={1.75} />
    </button>
  );
}

export function Sidebar() {
  return (
    <>
      <aside className="hidden w-20 shrink-0 flex-col items-center gap-8 py-6 sm:flex">
        <div className="flex h-9 w-9 items-center justify-center">
          <Gem className="h-6 w-6 text-[#e8703a]" strokeWidth={1.5} />
        </div>
        <nav className="flex flex-1 flex-col gap-2">
          {NAV_ITEMS.map((item) => (
            <NavButton key={item.label} {...item} />
          ))}
        </nav>
        <button
          type="button"
          aria-label="Search"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-[#1b1626]/15 text-[#1b1626]/60 hover:bg-black/5"
        >
          <Search className="h-4 w-4" strokeWidth={1.75} />
        </button>
      </aside>

      <nav className="fixed inset-x-0 bottom-0 z-20 flex items-center justify-around border-t border-black/10 bg-[#f4f1ea]/95 px-2 py-2 backdrop-blur sm:hidden">
        {NAV_ITEMS.map((item) => (
          <NavButton key={item.label} {...item} />
        ))}
        <NavButton icon={Search} active={false} label="Search" />
      </nav>
    </>
  );
}
