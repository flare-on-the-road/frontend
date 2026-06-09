import type { LucideIcon } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/atoms";
import { cn } from "@/lib/utils";

type StatCardProps = {
  label: string;
  value: string;
  description?: string;
  icon?: LucideIcon;
  trend?: string;
  className?: string;
};

export function StatCard({
  label,
  value,
  description,
  icon: Icon,
  trend,
  className,
}: StatCardProps) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="flex flex-row items-start justify-between gap-3 pb-2">
        <div className="space-y-1">
          <CardDescription>{label}</CardDescription>
          <CardTitle className="text-2xl">{value}</CardTitle>
        </div>
        {Icon ? (
          <div className="flex size-9 items-center justify-center rounded-md bg-secondary text-secondary-foreground">
            <Icon className="size-4" aria-hidden="true" />
          </div>
        ) : null}
      </CardHeader>
      {(description || trend) ? (
        <CardContent>
          <p className="text-sm leading-6 text-muted-foreground">
            {trend ? (
              <span className="font-medium text-foreground">{trend}</span>
            ) : null}
            {trend && description ? " · " : null}
            {description}
          </p>
        </CardContent>
      ) : null}
    </Card>
  );
}
