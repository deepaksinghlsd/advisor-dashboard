import { FileText, Phone, RefreshCw } from "lucide-react";
import type { AttentionCard as AttentionCardData, BadgeColor } from "@/lib/types";

const ACCENT_BAR: Record<BadgeColor, string> = {
  red: "bg-rose-400",
  green: "bg-emerald-400",
  yellow: "bg-amber-400",
  orange: "bg-orange-400",
};

const BADGE_STYLE: Record<BadgeColor, string> = {
  red: "bg-rose-50 text-rose-600",
  green: "bg-emerald-50 text-emerald-700",
  yellow: "bg-amber-50 text-amber-700",
  orange: "bg-orange-50 text-orange-700",
};

const CTA_STYLE: Record<string, { className: string; icon: typeof Phone }> = {
  "Call Now": {
    className: "bg-rose-50 text-rose-600 hover:bg-rose-100",
    icon: Phone,
  },
  "Open Brief": {
    className: "bg-[#1b1626] text-white hover:bg-[#2a2237]",
    icon: FileText,
  },
  Rebalance: {
    className: "border border-black/10 bg-white text-[#1b1626] hover:bg-black/5",
    icon: RefreshCw,
  },
};

export function AttentionCard({ card }: { card: AttentionCardData }) {
  const cta = card.cta ? CTA_STYLE[card.cta] : null;
  const CtaIcon = cta?.icon;

  return (
    <div className="relative flex h-full w-[280px] shrink-0 snap-start flex-col overflow-hidden rounded-xl border border-black/5 bg-white shadow-sm sm:w-[300px]">
      <span
        className={`absolute inset-y-0 left-0 w-1 ${ACCENT_BAR[card.badgeColor ?? "orange"]}`}
      />
      <div className="flex flex-1 flex-col gap-3 p-5 pl-6">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#1b1626] text-sm font-medium text-white">
              {card.initials}
            </div>
            <div>
              <p className="whitespace-nowrap font-medium leading-tight text-[#1b1626]">
                {card.name}
              </p>
              <p className="font-mono text-sm text-[#1b1626]/50">{card.aum}</p>
            </div>
          </div>
          {card.badge && card.badgeColor && (
            <span
              className={`shrink-0 rounded-full px-2 py-1 text-center font-mono text-[9px] font-semibold uppercase tracking-wide whitespace-nowrap ${BADGE_STYLE[card.badgeColor]}`}
            >
              {card.badge}
            </span>
          )}
        </div>
        <p className="flex-1 text-sm leading-relaxed text-[#1b1626]/70">{card.note}</p>
        {(card.meta || cta) && (
          <div className="flex items-center justify-between gap-3 border-t border-black/5 pt-4">
            {card.meta ? (
              <span className="font-mono text-xs text-[#1b1626]/45">{card.meta}</span>
            ) : (
              <span />
            )}
            {cta && CtaIcon && (
              <button
                type="button"
                className={`flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${cta.className}`}
              >
                <CtaIcon className="h-3.5 w-3.5" strokeWidth={2} />
                {card.cta}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
