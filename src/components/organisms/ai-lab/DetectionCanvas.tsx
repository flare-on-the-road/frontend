"use client";

import { ImageIcon } from "lucide-react";
import { useEffect, useRef } from "react";

import type { Detection } from "@/types/ai-lab";

type DetectionCanvasProps = {
  imageUrl?: string;
  placeholderLabel: string;
  detections: Detection[];
  showLabels: boolean;
};

const LABEL_COLORS: Record<string, string> = {
  FIRE: "#ef4444",
  SMOKE: "#14b8a6",
};

export function DetectionCanvas({
  imageUrl,
  placeholderLabel,
  detections,
  showLabels,
}: DetectionCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    function draw() {
      if (!container || !canvas) return;

      const { width, height } = container.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);

      for (const detection of detections) {
        const [x, y, w, h] = detection.bbox;
        const color = LABEL_COLORS[detection.label] ?? "#ef4444";
        const boxX = x * width;
        const boxY = y * height;
        const boxW = w * width;
        const boxH = h * height;

        ctx.lineWidth = 2;
        ctx.strokeStyle = color;
        ctx.strokeRect(boxX, boxY, boxW, boxH);

        if (showLabels) {
          const label = `${detection.label} ${(detection.confidence * 100).toFixed(1)}%`;
          ctx.font = "bold 12px Pretendard, sans-serif";
          const textWidth = ctx.measureText(label).width;
          const labelHeight = 18;
          const labelY = boxY > labelHeight ? boxY - labelHeight : boxY;

          ctx.fillStyle = color;
          ctx.fillRect(boxX, labelY, textWidth + 12, labelHeight);

          ctx.fillStyle = "#ffffff";
          ctx.fillText(label, boxX + 6, labelY + 13);
        }
      }
    }

    draw();

    const observer = new ResizeObserver(draw);
    observer.observe(container);

    return () => observer.disconnect();
  }, [detections, showLabels]);

  return (
    <div
      ref={containerRef}
      className="relative aspect-video w-full overflow-hidden rounded-md bg-warm-100 dark:bg-slate-800"
    >
      {imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={imageUrl}
          alt={placeholderLabel}
          className="absolute inset-0 size-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-warm-400 dark:text-slate-500">
          <ImageIcon className="size-12" aria-hidden="true" />
          <span className="text-sm font-semibold">{placeholderLabel}</span>
        </div>
      )}
      <canvas ref={canvasRef} className="absolute inset-0" />
    </div>
  );
}
