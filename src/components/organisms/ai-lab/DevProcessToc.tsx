"use client";

import { useEffect, useState } from "react";

const sections = [
  { id: "step-01", label: "문제 정의" },
  { id: "step-02", label: "데이터셋 구성" },
  { id: "step-03", label: "데이터 증강 파이프라인" },
  { id: "step-04", label: "모델 선정" },
  { id: "step-05", label: "파이프라인 아키텍처" },
  { id: "step-06", label: "반복 개선 과정" },
  { id: "step-07", label: "확장 로드맵" },
  { id: "step-08", label: "결론" },
];

export function DevProcessToc() {
  const [activeId, setActiveId] = useState<string>("");
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: "-20% 0px -60% 0px", threshold: 0 },
    );

    sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="fixed right-5 top-1/2 z-50 hidden -translate-y-1/2 flex-col items-end gap-3 lg:flex">
      {sections.map(({ id, label }) => {
        const isActive = activeId === id;
        const isHovered = hoveredId === id;

        return (
          <div
            key={id}
            className="flex items-center gap-2"
            onMouseEnter={() => setHoveredId(id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            {/* 라벨 */}
            <span
              className={`pointer-events-none rounded border border-warm-200 bg-warm-50 px-2 py-0.5 text-xs font-semibold shadow-sm transition-all duration-150 dark:border-slate-700 dark:bg-slate-800 ${
                isHovered ? "translate-x-0 opacity-100" : "translate-x-1 opacity-0"
              } ${isActive ? "font-black text-flare-600 dark:text-flare-400" : "text-slate-500 dark:text-warm-300"}`}
            >
              {label}
            </span>

            {/* 인디케이터 */}
            <button
              onClick={() =>
                document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
              }
              aria-label={label}
              className={`rounded-full transition-all duration-200 ${
                isActive
                  ? "h-0.5 w-6 bg-flare-500"
                  : "h-px w-4 bg-warm-300 hover:w-5 hover:bg-warm-400 dark:bg-slate-600 dark:hover:bg-slate-400"
              }`}
            />
          </div>
        );
      })}
    </div>
  );
}
