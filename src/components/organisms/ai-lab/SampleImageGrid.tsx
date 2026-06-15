"use client";

import { Check, Upload } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

import { Card } from "@/components/atoms";
import { cn } from "@/lib/utils";
import {
  ACCEPTED_IMAGE_TYPES,
  getSampleImageUrl,
  MAX_UPLOAD_SIZE_BYTES,
  SAMPLE_IMAGES,
} from "@/types/ai-lab";

export type SelectedImage =
  | { type: "sample"; key: string }
  | { type: "upload"; file: File; previewUrl: string };

type SampleImageGridProps = {
  selected: SelectedImage;
  onSelectSample: (key: string) => void;
  onUpload: (file: File) => void;
};

export function SampleImageGrid({
  selected,
  onSelectSample,
  onUpload,
}: SampleImageGridProps) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFiles(files: FileList | null) {
    const file = files?.[0];
    if (!file) return;

    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      toast.error("JPG, PNG 형식의 이미지만 업로드할 수 있습니다.");
      return;
    }

    if (file.size > MAX_UPLOAD_SIZE_BYTES) {
      toast.error("이미지 용량은 최대 8MB까지 업로드할 수 있습니다.");
      return;
    }

    onUpload(file);
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {SAMPLE_IMAGES.map((image) => {
          const isSelected =
            selected.type === "sample" && selected.key === image.key;

          return (
            <button
              key={image.key}
              type="button"
              onClick={() => onSelectSample(image.key)}
              className="text-left"
            >
              <Card
                className={cn(
                  "relative overflow-hidden p-0",
                  isSelected ? "border-2 border-flare-500" : "border-border",
                )}
              >
                <div className="relative aspect-4/3 overflow-hidden bg-warm-100 dark:bg-slate-800">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={getSampleImageUrl(image.key)}
                    alt={image.name}
                    className="absolute inset-0 size-full object-cover"
                  />
                </div>
                {isSelected ? (
                  <span className="absolute right-2 top-2 flex size-5 items-center justify-center rounded-full bg-flare-500 text-cream-50">
                    <Check className="size-3" aria-hidden="true" />
                  </span>
                ) : null}
                <div className="space-y-1 p-3">
                  <p className="text-sm font-bold text-foreground">
                    {image.name}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {image.description}
                  </p>
                </div>
              </Card>
            </button>
          );
        })}
      </div>

      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            inputRef.current?.click();
          }
        }}
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setIsDragging(false);
          handleFiles(event.dataTransfer.files);
        }}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-8 text-center transition-colors",
          isDragging || selected.type === "upload"
            ? "border-flare-500 bg-flare-500/5"
            : "border-border",
        )}
      >
        <Upload className="size-8 text-muted-foreground" aria-hidden="true" />
        <p className="font-bold text-foreground">
          도로 화재 / 연기 이미지를 업로드하세요
        </p>
        <p className="text-sm text-muted-foreground">
          클릭하거나 파일을 끌어다 놓으세요 · JPG, PNG · 최대 8MB
        </p>
        {selected.type === "upload" ? (
          <p className="text-xs font-semibold text-flare-600 dark:text-flare-400">
            선택됨: {selected.file.name}
          </p>
        ) : null}
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png"
          className="hidden"
          onChange={(event) => handleFiles(event.target.files)}
        />
      </div>
    </div>
  );
}
