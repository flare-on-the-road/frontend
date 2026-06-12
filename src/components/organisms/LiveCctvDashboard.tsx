"use client";

import Hls from "hls.js";
import { Camera, ChevronRight, RefreshCw, Video } from "lucide-react";
import dynamic from "next/dynamic";
import * as React from "react";

import { Button } from "@/components/atoms";
import { fetchCctvs } from "@/services/cctvApi";
import type { Cctv } from "@/types/cctv";

const HIGHWAY_CCTV_TYPE = "1";
const LeafletCctvMap = dynamic(() => import("./LeafletCctvMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center bg-slate-200 text-base font-bold text-slate-500">
      지도를 불러오는 중입니다.
    </div>
  ),
});

export function LiveCctvDashboard() {
  const [cctvs, setCctvs] = React.useState<Cctv[]>([]);
  const [selectedCctv, setSelectedCctv] = React.useState<Cctv | null>(null);
  const [error, setError] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(true);

  const applyCctvs = React.useCallback((items: Cctv[]) => {
    setCctvs(items);
    setSelectedCctv((current) => current ?? items[0] ?? null);
  }, []);

  const handleSelectCctv = React.useCallback((cctv: Cctv) => {
    setSelectedCctv(cctv);
  }, []);

  const loadCctvs = React.useCallback(async () => {
    setIsLoading(true);
    setError("");

    try {
      const data = await fetchCctvs({ cctvType: HIGHWAY_CCTV_TYPE, limit: 500 });
      applyCctvs(data.items);
    } catch (err) {
      setError(err instanceof Error ? err.message : "CCTV 목록을 불러오지 못했습니다.");
    } finally {
      setIsLoading(false);
    }
  }, [applyCctvs]);

  React.useEffect(() => {
    let cancelled = false;

    fetchCctvs({ cctvType: HIGHWAY_CCTV_TYPE, limit: 500 })
      .then((data) => {
        if (cancelled) return;
        applyCctvs(data.items);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "CCTV 목록을 불러오지 못했습니다.");
      })
      .finally(() => {
        if (!cancelled) {
          setIsLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [applyCctvs]);

  return (
    <section className="px-5 py-8 sm:px-8">
      <div className="mx-auto max-w-[1800px]">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl font-black text-slate-900 dark:text-cream-50">
              실시간 CCTV
            </h1>
            <p className="mt-3 text-lg font-semibold text-slate-500 dark:text-warm-300">
              전국 고속도로 CCTV를 지도에서 선택해 실시간으로 확인합니다.
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            className="h-11 rounded-full border-flare-500 bg-transparent px-5 font-bold text-flare-600 hover:bg-flare-500 hover:text-cream-50"
            onClick={() => loadCctvs()}
            disabled={isLoading}
          >
            <RefreshCw className="size-4" aria-hidden="true" />
            새로고침
          </Button>
        </div>

        {error ? (
          <p className="mb-5 rounded-lg bg-danger-critical/10 px-4 py-3 text-sm font-bold text-danger-critical">
            {error}
          </p>
        ) : null}

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(420px,0.85fr)]">
          <div className="h-[560px] overflow-hidden rounded-xl border border-warm-200 bg-warm-50 shadow-sm dark:border-slate-700 dark:bg-slate-800 xl:h-[640px]">
            <LeafletCctvMap
              cctvs={cctvs}
              selectedCctv={selectedCctv}
              onSelect={handleSelectCctv}
            />
          </div>

          <aside className="flex h-[560px] min-h-0 flex-col overflow-hidden rounded-xl border border-warm-200 bg-warm-50 shadow-sm dark:border-slate-700 dark:bg-slate-800 xl:h-[640px]">
            <div className="shrink-0 border-b border-warm-200 p-5 dark:border-slate-700">
              <CctvPlayer cctv={selectedCctv} />
            </div>

            <div className="shrink-0 border-b border-warm-200 p-5 dark:border-slate-700">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="flex items-center gap-3 text-xl font-black text-slate-900 dark:text-cream-50">
                    <Camera className="size-6 text-flare-600 dark:text-flare-400" />
                    CCTV 목록
                  </h2>
                  <p className="mt-2 text-sm font-bold text-slate-500 dark:text-warm-300">
                    고속도로 CCTV 총 {cctvs.length}대 {isLoading ? "조회 중" : "운영 중"}
                  </p>
                </div>
                <span className="h-10 whitespace-nowrap rounded-full bg-flare-500 px-4 py-2 text-sm font-black text-cream-50">
                  고속도로
                </span>
              </div>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto p-4">
              {isLoading ? (
                <p className="p-5 text-center text-base font-bold text-slate-500 dark:text-warm-300">
                  CCTV 목록을 불러오는 중입니다.
                </p>
              ) : (
                <div className="space-y-3">
                  {cctvs.map((cctv) => (
                    <button
                      key={cctv.id}
                      type="button"
                      className={`flex w-full items-center gap-4 rounded-lg border-l-4 p-3 text-left transition-colors ${
                        selectedCctv?.id === cctv.id
                          ? "border-flare-500 bg-flare-500/10 dark:bg-slate-900"
                          : "border-transparent hover:bg-cream-100 dark:hover:bg-slate-900"
                      }`}
                      onClick={() => handleSelectCctv(cctv)}
                    >
                      <div className="flex size-20 shrink-0 items-center justify-center rounded-lg bg-slate-200 text-slate-500 dark:bg-slate-700 dark:text-warm-300">
                        <Video className="size-8" aria-hidden="true" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="truncate text-lg font-black text-slate-900 dark:text-cream-50">
                          {cctv.name}
                        </h3>
                        <p className="mt-1 truncate text-sm font-bold text-slate-500 dark:text-warm-300">
                          {cctv.roadName || "도로 정보 없음"}
                        </p>
                        <p className="mt-2 flex items-center gap-2 text-sm font-black text-flare-600 dark:text-flare-400">
                          <span className="size-2 rounded-full bg-flare-500" />
                          실시간 연결중
                        </p>
                      </div>
                      <ChevronRight className="size-5 shrink-0 text-slate-400" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

function CctvPlayer({ cctv }: { cctv: Cctv | null }) {
  const videoRef = React.useRef<HTMLVideoElement>(null);

  React.useEffect(() => {
    if (!cctv?.streamUrl || !videoRef.current) {
      return;
    }

    const video = videoRef.current;
    let hls: Hls | null = null;

    const playVideo = () => {
      video.play().catch(() => {
        // 자동재생이 차단되면 사용자가 컨트롤로 직접 재생할 수 있다.
      });
    };

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = cctv.streamUrl;
      video.addEventListener("loadedmetadata", playVideo);
    } else if (Hls.isSupported()) {
      hls = new Hls();
      hls.loadSource(cctv.streamUrl);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, playVideo);
    } else {
      video.src = cctv.streamUrl;
    }

    return () => {
      hls?.destroy();
      video.removeEventListener("loadedmetadata", playVideo);
      video.removeAttribute("src");
      video.load();
    };
  }, [cctv]);

  if (!cctv) {
    return (
      <div className="flex aspect-video items-center justify-center rounded-lg bg-slate-900 text-base font-bold text-warm-300">
        CCTV를 선택하세요
      </div>
    );
  }

  return (
    <div className="relative h-full bg-slate-950">
      <video
        ref={videoRef}
        className="aspect-video w-full rounded-lg bg-slate-950 object-cover"
        controls
        autoPlay
        muted
        playsInline
      />
      <div className="pointer-events-none absolute left-4 top-4 flex max-w-[calc(100%-32px)] items-center gap-2">
        <span className="rounded-full bg-danger-critical px-3 py-1.5 text-xs font-black text-cream-50 shadow-sm">
          LIVE
        </span>
        <span className="truncate rounded-full bg-slate-950/70 px-3 py-1.5 text-xs font-black text-cream-50 backdrop-blur">
          {cctv.name}
        </span>
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-between gap-4 rounded-b-lg bg-slate-950/72 p-4 text-cream-50 backdrop-blur">
        <p className="min-w-0 truncate text-sm font-bold">
          {cctv.roadName || "도로 정보 없음"}
        </p>
        <span className="shrink-0 rounded-full bg-flare-500 px-4 py-2 text-sm font-black">
          상세보기
        </span>
      </div>
    </div>
  );
}
