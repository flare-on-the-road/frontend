"use client";

import { Loader2, Server } from "lucide-react";
import * as React from "react";
import { toast } from "sonner";

import { useRequireAuth } from "@/hooks/useRequireAuth";
import { cn } from "@/lib/utils";
import { ApiRequestError, detectImages } from "@/services/aiLabApi";
import {
  AI_LAB_MODELS,
  getSampleImageUrl,
  SAMPLE_IMAGES,
  THRESHOLD_DEFAULT,
  type DetectResults,
  type ModelKey,
} from "@/types/ai-lab";

import { DetectionResultCard } from "./DetectionResultCard";
import { ModelCard } from "./ModelCard";
import { PerformanceTable } from "./PerformanceTable";
import { SampleImageGrid, type SelectedImage } from "./SampleImageGrid";
import { ThresholdSlider } from "./ThresholdSlider";

const ALL_MODEL_KEYS: ModelKey[] = AI_LAB_MODELS.map((model) => model.key);
const INFERENCE_DELAY_MS = 1000;

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function formatApiErrorDetail(details?: Record<string, string>) {
  if (!details) return "";
  return Object.values(details).filter(Boolean).join(" ");
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(",")[1] ?? "");
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export function ModelDemoPage() {
  const { isReady, accessToken } = useRequireAuth();

  const [selectedModelKeys, setSelectedModelKeys] =
    React.useState<ModelKey[]>(ALL_MODEL_KEYS);
  const [selectedImage, setSelectedImage] = React.useState<SelectedImage>({
    type: "sample",
    key: SAMPLE_IMAGES[0].key,
  });
  const [threshold, setThreshold] = React.useState(THRESHOLD_DEFAULT);
  const [showLabels, setShowLabels] = React.useState(true);
  const [results, setResults] = React.useState<DetectResults | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    if (!isReady || !accessToken) return;

    const token = accessToken;
    let cancelled = false;

    async function run() {
      setError("");
      setIsLoading(true);

      if (selectedImage.type === "sample") {
        const [response] = await Promise.all([
          detectImages(token, {
            models: selectedModelKeys,
            threshold: 0,
            imageKey: selectedImage.key,
          }),
          sleep(INFERENCE_DELAY_MS),
        ]);

        if (!cancelled) setResults(response.results);
        return;
      }

      const imageBase64 = await fileToBase64(selectedImage.file);
      const [response] = await Promise.all([
        detectImages(token, {
          models: selectedModelKeys,
          threshold: 0,
          imageBase64,
        }),
        sleep(INFERENCE_DELAY_MS),
      ]);

      if (cancelled) return;
      setResults(response.results);
    }

    run()
      .catch((err) => {
        if (cancelled) return;
        const detail =
          err instanceof ApiRequestError ? formatApiErrorDetail(err.details) : "";
        setError(
          err instanceof ApiRequestError
            ? [err.message, detail].filter(Boolean).join(" ")
            : "탐지 결과를 불러오지 못했습니다.",
        );
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [isReady, accessToken, selectedImage, selectedModelKeys]);

  React.useEffect(() => {
    return () => {
      if (selectedImage.type === "upload") {
        URL.revokeObjectURL(selectedImage.previewUrl);
      }
    };
  }, [selectedImage]);

  function handleToggleModel(modelKey: ModelKey) {
    setSelectedModelKeys((prev) => {
      if (prev.includes(modelKey)) {
        if (prev.length === 1) {
          toast.warning("최소 1개 이상의 모델을 선택해야 합니다.");
          return prev;
        }
        return prev.filter((key) => key !== modelKey);
      }
      return [...prev, modelKey];
    });
  }

  function handleSelectSample(key: string) {
    setIsLoading(true);
    setSelectedImage((prev) => {
      if (prev.type === "upload") {
        URL.revokeObjectURL(prev.previewUrl);
      }
      return { type: "sample", key };
    });
  }

  function handleUpload(file: File) {
    setIsLoading(true);
    setSelectedImage((prev) => {
      if (prev.type === "upload") {
        URL.revokeObjectURL(prev.previewUrl);
      }
      return { type: "upload", file, previewUrl: URL.createObjectURL(file) };
    });
  }

  if (!isReady) {
    return (
      <section className="px-5 py-10 sm:px-8">
        <p className="text-center text-base font-bold text-slate-500 dark:text-warm-300">
          로그인 확인 중입니다...
        </p>
      </section>
    );
  }

  const selectedModels = AI_LAB_MODELS.filter((model) =>
    selectedModelKeys.includes(model.key),
  );

  const placeholderLabel =
    selectedImage.type === "sample"
      ? SAMPLE_IMAGES.find((image) => image.key === selectedImage.key)?.name ?? ""
      : selectedImage.file.name;

  const imageUrl =
    selectedImage.type === "upload"
      ? selectedImage.previewUrl
      : getSampleImageUrl(selectedImage.key);

  return (
    <div className="mx-auto max-w-[1440px] space-y-12 px-5 py-10 sm:px-8 lg:px-12">
      {/* 헤더 영역 */}
      <section className="space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-3xl space-y-3">
            <h1 className="text-3xl font-black text-foreground sm:text-4xl">
              화재 / 연기 객체탐지 모델 데모
            </h1>
            <p className="text-sm leading-7 text-muted-foreground sm:text-base">
              Flare on the road의 1차 탐지 파이프라인에서 사용하는 RT-DETR ·
              YOLOv8 · YOLOv11 모델의 성능을 직접 비교해볼 수 있는 페이지입니다.
              샘플 이미지를 선택하거나 직접 도로 이미지를 업로드해 세 모델의
              탐지 결과와 추론 속도를 확인해보세요.
            </p>
          </div>

          <div className="flex shrink-0 flex-col items-start gap-2 sm:items-end">
            <span className="flex items-center gap-1.5 text-sm font-bold text-process-resolved">
              <span
                className="size-2 rounded-full bg-process-resolved"
                aria-hidden="true"
              />
              모델 서빙 정상
            </span>
            <span className="flex items-center gap-1.5 text-sm font-semibold text-muted-foreground">
              <Server className="size-4" aria-hidden="true" />
              GPU: GTX 1060 VM
            </span>
          </div>
        </div>
      </section>

      {/* 섹션 ① 모델 선택 */}
      <section className="space-y-4">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-xl font-bold text-foreground">
              ① 비교할 모델 선택
            </h2>
            <p className="text-sm text-muted-foreground">
              기본은 세 모델 전부 활성. 비교에서 제외하려면 카드를 클릭하세요.
            </p>
          </div>
          <p className="text-sm font-bold text-foreground">
            선택: {selectedModelKeys.length}/{AI_LAB_MODELS.length}
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {AI_LAB_MODELS.map((model) => (
            <ModelCard
              key={model.key}
              model={model}
              selected={selectedModelKeys.includes(model.key)}
              onToggle={() => handleToggleModel(model.key)}
            />
          ))}
        </div>
      </section>

      {/* 섹션 ② 이미지 선택 */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-foreground">
          ② 이미지 선택 또는 업로드
        </h2>
        <SampleImageGrid
          selected={selectedImage}
          onSelectSample={handleSelectSample}
          onUpload={handleUpload}
        />
      </section>

      {/* 섹션 ③ 탐지 결과 비교 */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-foreground">③ 탐지 결과 비교</h2>
        <ThresholdSlider
          threshold={threshold}
          onThresholdChange={setThreshold}
          showLabels={showLabels}
          onToggleLabels={() => setShowLabels((prev) => !prev)}
        />

        {isLoading ? (
          <div className="flex h-48 items-center justify-center gap-2 text-sm font-semibold text-muted-foreground">
            <Loader2 className="size-5 animate-spin" aria-hidden="true" />
            모델 추론 중...
          </div>
        ) : error ? (
          <p className="text-sm font-semibold text-destructive">{error}</p>
        ) : results ? (
          <div
            className={cn(
              "grid gap-4",
              selectedModels.length === 1 && "grid-cols-1",
              selectedModels.length === 2 && "grid-cols-1 sm:grid-cols-2",
              selectedModels.length >= 3 && "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
            )}
          >
            {selectedModels.map((model) => (
              <DetectionResultCard
                key={model.key}
                model={model}
                result={results[model.key]}
                threshold={threshold}
                showLabels={showLabels}
                imageUrl={imageUrl}
                placeholderLabel={placeholderLabel}
              />
            ))}
          </div>
        ) : null}
      </section>

      {/* 성능 비교 섹션 */}
      {results ? (
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-foreground">성능 비교</h2>
          <PerformanceTable
            models={selectedModels}
            results={results}
            threshold={threshold}
          />
        </section>
      ) : null}
    </div>
  );
}
