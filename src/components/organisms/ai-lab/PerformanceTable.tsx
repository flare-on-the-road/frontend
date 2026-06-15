import { Info } from "lucide-react";

import {
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/atoms";
import { cn } from "@/lib/utils";
import { AI_LAB_MODELS } from "@/types/ai-lab";
import type { DetectResults, ModelInfo, ModelResult } from "@/types/ai-lab";

type PerformanceTableProps = {
  models: ModelInfo[];
  results: DetectResults;
  threshold: number;
};

type ModelStats = {
  model: ModelInfo;
  result: ModelResult;
  detectionCount: number;
  avgConfidence: number;
};

export function PerformanceTable({
  models,
  results,
  threshold,
}: PerformanceTableProps) {
  const stats: ModelStats[] = models.map((model) => {
    const result = results[model.key];
    const detections = result.detections.filter(
      (detection) => detection.confidence >= threshold,
    );
    const avgConfidence =
      detections.length > 0
        ? (detections.reduce((sum, detection) => sum + detection.confidence, 0) /
            detections.length) *
          100
        : 0;

    return { model, result, detectionCount: detections.length, avgConfidence };
  });

  const fastest = stats.reduce((best, current) =>
    current.result.inference_ms < best.result.inference_ms ? current : best,
  );
  const topConfidence = stats.reduce((best, current) =>
    current.avgConfidence > best.avgConfidence ? current : best,
  );

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <SummaryCard
          label="가장 빠른 모델"
          value={fastest.model.name}
          sub={`${fastest.result.inference_ms.toFixed(1)} ms / ${fastest.result.fps} FPS`}
        />
        <SummaryCard
          label="평균 신뢰도 1위"
          value={topConfidence.model.name}
          sub={`평균 ${topConfidence.avgConfidence.toFixed(1)}%`}
        />
        <SummaryCard
          label="현재 임계값"
          value={`Confidence ≥ ${threshold.toFixed(2)}`}
        />
      </div>

      <Card>
        <CardContent className="space-y-4 p-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-lg font-bold text-foreground">상세 비교</h3>
            <p className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
              <Info className="size-3.5" aria-hidden="true" />
              동일 입력 / 동일 임계값 기준
            </p>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>모델</TableHead>
                <TableHead>추론 시간</TableHead>
                <TableHead>FPS</TableHead>
                <TableHead>탐지 개수</TableHead>
                <TableHead>평균 Conf.</TableHead>
                <TableHead>mAP50</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stats.map(({ model, result, detectionCount, avgConfidence }) => (
                <TableRow key={model.key}>
                  <TableCell className="font-bold text-foreground">
                    {model.name}
                  </TableCell>
                  <TableCell>{result.inference_ms.toFixed(1)} ms</TableCell>
                  <TableCell>{result.fps}</TableCell>
                  <TableCell>{detectionCount}개</TableCell>
                  <TableCell>{avgConfidence.toFixed(1)}%</TableCell>
                  <TableCell>{model.map50.toFixed(1)}%</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="rounded-lg border border-border bg-cream-100 p-4 text-sm leading-6 text-muted-foreground dark:bg-slate-800">
        본 데모에 표시되는 추론 시간 및 FPS 수치는 NVIDIA A10 GPU(24GB), TensorRT
        FP16 환경에서 측정한 참고 값입니다. 실제 운영 환경(Edge Worker, Jetson
        등)에서는 결과가 달라질 수 있으며, 1차 탐지 후 2차 VLM(Vision-Language
        Model) 단계를 거쳐 화재 / 연기 / 후미등 / 가로등 / 안개 등을 정밀 구분하여
        오탐을 줄입니다.
      </div>

      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-semibold text-muted-foreground">
        {AI_LAB_MODELS.map((model) => (
          <span key={model.key} className="flex items-center gap-1.5">
            <span
              className={cn(
                "size-2 rounded-full",
                model.accentColor === "teal"
                  ? "bg-teal-500"
                  : model.accentColor === "violet"
                    ? "bg-violet-500"
                    : "bg-flare-500",
              )}
              aria-hidden="true"
            />
            {model.name} · mAP {model.legendMap50.toFixed(1)}%
          </span>
        ))}
      </div>
    </div>
  );
}

function SummaryCard({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <Card>
      <CardContent className="space-y-1 p-5">
        <p className="text-xs font-semibold text-muted-foreground">{label}</p>
        <p className="text-lg font-bold text-foreground">{value}</p>
        {sub ? <p className="text-sm text-muted-foreground">{sub}</p> : null}
      </CardContent>
    </Card>
  );
}
