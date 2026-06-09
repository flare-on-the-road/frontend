import type { LucideIcon } from "lucide-react";

import { Badge } from "@/components/atoms";
import { cn } from "@/lib/utils";

type ListItemProps = {
  icon?: LucideIcon;
  title: string;
  description?: string;
  meta?: string;
  badge?: string;
  className?: string;
};

export function ListItem({
  icon: Icon,
  title,
  description,
  meta,
  badge,
  className,
}: ListItemProps) {
  return (
    <div
      className={cn(
        "flex min-h-16 items-start gap-3 rounded-lg border bg-card p-4 text-card-foreground",
        className,
      )}
    >
      {Icon ? (
        <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-secondary text-secondary-foreground">
          <Icon className="size-4" aria-hidden="true" />
        </div>
      ) : null}
      <div className="min-w-0 flex-1 space-y-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="font-medium leading-5">{title}</p>
          {badge ? <Badge variant="outline">{badge}</Badge> : null}
        </div>
        {description ? (
          <p className="text-sm leading-6 text-muted-foreground">
            {description}
          </p>
        ) : null}
      </div>
      {meta ? (
        <span className="shrink-0 text-xs font-medium text-muted-foreground">
          {meta}
        </span>
      ) : null}
    </div>
  );
}
