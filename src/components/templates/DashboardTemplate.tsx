import * as React from "react";

import { cn } from "@/lib/utils";

type DashboardTemplateProps = {
  children: React.ReactNode;
  className?: string;
};

export function DashboardTemplate({
  children,
  className,
}: DashboardTemplateProps) {
  return (
    <main className={cn("min-h-screen bg-background text-foreground", className)}>
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </div>
    </main>
  );
}
