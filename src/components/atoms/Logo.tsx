import { Flame } from "lucide-react";
import Link from "next/link";

import { cn } from "@/lib/utils";

type LogoProps = {
  className?: string;
};

export function Logo({ className }: LogoProps) {
  return (
    <Link
      className={cn(
        "flex items-center gap-3 rounded-full outline-none focus-visible:ring-[3px] focus-visible:ring-flare-400/40",
        className,
      )}
      href="/"
      aria-label="메인페이지로 이동"
    >
      <div className="flex size-11 items-center justify-center rounded-full bg-flare-500 text-cream-50 shadow-sm shadow-flare-500/30">
        <Flame className="size-6 fill-current" aria-hidden="true" />
      </div>
      <span className="text-2xl font-black leading-none text-slate-900 dark:text-cream-50">
        Flare
      </span>
    </Link>
  );
}
