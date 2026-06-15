"use client";

import { Check, Cpu } from "lucide-react";

import { Card, CardContent } from "@/components/atoms";
import { cn } from "@/lib/utils";
import type { ModelInfo } from "@/types/ai-lab";

type ModelCardProps = {
  model: ModelInfo;
  selected: boolean;
  onToggle: () => void;
};

export function ModelCard({ model, selected, onToggle }: ModelCardProps) {
  const accentClass =
    model.accentColor === "teal" ? "bg-teal-500" : "bg-flare-500";

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={selected}
      className="h-full text-left"
    >
      <Card
        className={cn(
          "relative h-full transition-colors",
          selected
            ? "border-2 border-flare-500"
            : "border-border opacity-60",
        )}
      >
        {selected ? (
          <span className="absolute right-3 top-3 flex size-6 items-center justify-center rounded-full bg-flare-500 text-cream-50">
            <Check className="size-4" aria-hidden="true" />
          </span>
        ) : null}
        <CardContent className="space-y-3 p-5">
          <div className="flex items-center gap-3">
            <span
              className={cn(
                "flex size-9 shrink-0 items-center justify-center rounded-lg text-cream-50",
                accentClass,
              )}
            >
              <Cpu className="size-5" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <p className="font-bold text-foreground">{model.name}</p>
              <p className="truncate text-xs text-muted-foreground">
                {model.fullName}
              </p>
            </div>
          </div>
          <p className="text-sm leading-6 text-muted-foreground">
            {model.description}
          </p>
          <div className="flex gap-4 text-xs font-semibold text-foreground">
            <span>mAP50 {model.map50.toFixed(1)}%</span>
            <span>파라미터 {model.params}</span>
          </div>
        </CardContent>
      </Card>
    </button>
  );
}
