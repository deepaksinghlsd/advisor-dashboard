import Link from "next/link";
import { ArrowLeft, Construction } from "lucide-react";

export function ComingSoon({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#1b1626]">
        <Construction className="h-6 w-6 text-amber-400" strokeWidth={1.75} />
      </span>
      <p className="mt-6 font-mono text-xs uppercase tracking-wider text-[#1b1626]/45">
        Coming soon
      </p>
      <h1 className="mt-2 font-serif text-3xl font-medium tracking-tight text-[#1b1626] sm:text-4xl">
        {title}
      </h1>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-[#1b1626]/60">
        {description}
      </p>
      <Link
        href="/"
        className="mt-8 flex items-center gap-1.5 rounded-full bg-[#1b1626] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#2a2237]"
      >
        <ArrowLeft className="h-4 w-4" strokeWidth={2} />
        Back to dashboard
      </Link>
    </div>
  );
}
