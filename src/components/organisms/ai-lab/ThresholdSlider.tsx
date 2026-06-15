"use client";

import { Tag } from "lucide-react";

import { Button, Slider } from "@/components/atoms";
import { cn } from "@/lib/utils";
import { THRESHOLD_MAX, THRESHOLD_MIN, THRESHOLD_STEP } from "@/types/ai-lab";

type ThresholdSliderProps = {
  threshold: number;
  onThresholdChange: (value: number) => void;
  showLabels: boolean;
  onToggleLabels: () => void;
};

export function ThresholdSlider({
  threshold,
  onThresholdChange,
  showLabels,
  onToggleLabels,
}: ThresholdSliderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 items-center gap-4">
        <span className="shrink-0 text-sm font-bold text-foreground">
          임계값 (Confidence Threshold)
        </span>
        <Slider
          value={[threshold]}
          min={THRESHOLD_MIN}
          max={THRESHOLD_MAX}
          step={THRESHOLD_STEP}
          onValueChange={([value]) => onThresholdChange(value)}
          className="max-w-xs"
          aria-label="탐지 신뢰도 임계값"
        />
        <span className="w-12 shrink-0 text-right text-sm font-bold text-flare-600 dark:text-flare-400">
          {threshold.toFixed(2)}
        </span>
      </div>
      <Button
        type="button"
        variant="outline"
        onClick={onToggleLabels}
        aria-pressed={showLabels}
        className={cn(
          "border-flare-500 text-flare-600 hover:bg-flare-500 hover:text-cream-50 dark:text-flare-400",
          showLabels && "bg-flare-500 text-cream-50 hover:bg-flare-600",
        )}
      >
        <Tag className="size-4" aria-hidden="true" />
        라벨 표시 {showLabels ? "ON" : "OFF"}
      </Button>
    </div>
  );
}
