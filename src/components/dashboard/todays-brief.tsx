import type { ReactNode } from "react";
import type { TodaysBrief } from "@/lib/types";

const DOT_COLORS = ["bg-rose-400", "bg-amber-400", "bg-indigo-400"];

function highlightNames(text: string, names: string[]): ReactNode[] {
  if (names.length === 0) return [text];
  const pattern = new RegExp(`(${names.join("|")})`, "g");
  return text.split(pattern).map((part, i) =>
    names.includes(part) ? (
      <strong key={i} className="font-semibold text-white">
        {part}
      </strong>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}

export function TodaysBriefCard({
  brief,
  clientFirstNames,
}: {
  brief: TodaysBrief;
  clientFirstNames: string[];
}) {
  return (
    <div className="relative h-full overflow-hidden rounded-2xl bg-gradient-to-br from-[#241c33] via-[#181120] to-[#0c0a12] p-6">
      <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-indigo-500/10 blur-3xl" />
      <p className="font-mono text-[11px] uppercase tracking-wider text-white/40">
        {brief.label}
      </p>
      <p className="relative mt-4 text-xl leading-relaxed text-white/85 sm:text-2xl">
        {highlightNames(brief.text, clientFirstNames)}
      </p>
      <div className="relative mt-6 flex flex-wrap gap-2.5">
        {brief.actions.map((action, i) => (
          <button
            key={action}
            type="button"
            className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm text-white/90 hover:bg-white/15"
          >
            <span className={`h-1.5 w-1.5 rounded-full ${DOT_COLORS[i % DOT_COLORS.length]}`} />
            {action}
          </button>
        ))}
      </div>
    </div>
  );
}
