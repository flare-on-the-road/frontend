import { Cpu } from "lucide-react";

import { Card, CardContent, CardHeader } from "@/components/atoms";
import { cn } from "@/lib/utils";
import type { ModelInfo, ModelResult } from "@/types/ai-lab";

import { DetectionCanvas } from "./DetectionCanvas";

type DetectionResultCardProps = {
  model: ModelInfo;
  result: ModelResult;
  threshold: number;
  showLabels: boolean;
  imageUrl?: string;
  placeholderLabel: string;
};

export function DetectionResultCard({
  model,
  result,
  threshold,
  showLabels,
  imageUrl,
  placeholderLabel,
}: DetectionResultCardProps) {
  const detections = result.detections.filter(
    (detection) => detection.confidence >= threshold,
  );
  const accentClass =
    model.accentColor === "teal" ? "bg-teal-500" : "bg-flare-500";

  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex-row items-center justify-between gap-2 border-b border-border pb-4">
        <div className="flex min-w-0 items-center gap-2">
          <span
            className={cn(
              "flex size-7 shrink-0 items-center justify-center rounded-md text-cream-50",
              accentClass,
            )}
          >
            <Cpu className="size-4" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <p className="text-sm font-bold text-foreground">{model.name}</p>
            <p className="truncate text-xs text-muted-foreground">
              {model.fullName}
            </p>
          </div>
        </div>
        <span className="flex shrink-0 items-center gap-1.5 text-xs font-bold text-foreground">
          <span className="size-2 rounded-full bg-flare-500" aria-hidden="true" />
          탐지 {detections.length}개
        </span>
      </CardHeader>
      <CardContent className="space-y-3 p-3">
        <DetectionCanvas
          imageUrl={imageUrl}
          placeholderLabel={placeholderLabel}
          detections={detections}
          showLabels={showLabels}
        />
        <div className="flex justify-between text-xs font-semibold text-muted-foreground">
          <span>추론 시간 {result.inference_ms.toFixed(1)} ms</span>
          <span>{result.fps} FPS</span>
        </div>
      </CardContent>
    </Card>
  );
}
