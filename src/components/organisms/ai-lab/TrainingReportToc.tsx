"use client";

import { useEffect, useState } from "react";

const sections = [
  { id: "sec-01", label: "정량 지표 비교" },
  { id: "sec-02", label: "채택 근거" },
  { id: "sec-03", label: "클래스별 성능" },
  { id: "sec-04", label: "학습 결과" },
  { id: "sec-05", label: "정성 검증 요약" },
  { id: "sec-06", label: "케이스 6·18" },
  { id: "sec-07", label: "케이스 11·21" },
  { id: "sec-08", label: "현재 한계" },
  { id: "sec-09", label: "향후 개선 계획" },
  { id: "sec-10", label: "결론" },
];

export function TrainingReportToc() {
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
            <span
              className={`pointer-events-none rounded border border-warm-200 bg-warm-50 px-2 py-0.5 text-xs font-semibold shadow-sm transition-all duration-150 dark:border-slate-700 dark:bg-slate-800 ${
                isHovered ? "translate-x-0 opacity-100" : "translate-x-1 opacity-0"
              } ${isActive ? "font-black text-flare-600 dark:text-flare-400" : "text-slate-500 dark:text-warm-300"}`}
            >
              {label}
            </span>

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
