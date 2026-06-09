import { Flame } from "lucide-react";

import { cn } from "@/lib/utils";

type LogoProps = {
  className?: string;
};

export function Logo({ className }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className="flex size-11 items-center justify-center rounded-full bg-flare-500 text-cream-50 shadow-sm shadow-flare-500/30">
        <Flame className="size-6 fill-current" aria-hidden="true" />
      </div>
      <span className="text-2xl font-black leading-none text-slate-900 dark:text-cream-50">
        Flare
      </span>
    </div>
  );
}
