"use client";

import { Camera, RefreshCw } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import * as React from "react";

import { Badge, Button } from "@/components/atoms";
import { SectionHeader } from "@/components/molecules";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { formatDateTime } from "@/lib/format";
import { ApiRequestError, fetchEvents } from "@/services/eventsApi";
import type { Event, EventListResponse } from "@/types/event";

const PAGE_SIZE = 20;
const POLL_INTERVAL_MS = 30_000;

const IS_FIRE_OPTIONS = [
  { label: "전체", value: "" },
  { label: "화재 확정", value: "true" },
  { label: "오탐 처리 / 오탐 확정", value: "false" },
];

export function EventList() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isReady, accessToken } = useRequireAuth();

  const page = Math.max(Number(searchParams.get("page") ?? "1") || 1, 1);
  const isFireParam = searchParams.get("is_fire") ?? "";

  const [data, setData] = React.useState<EventListResponse | null>(null);
  const [error, setError] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(true);
  const [forceRefresh, setForceRefresh] = React.useState(0);

  const fetchedKeyRef = React.useRef<string | null>(null);

  React.useEffect(() => {
    if (!isReady || !accessToken) return;

    const key = `${accessToken}:${page}:${isFireParam}:${forceRefresh}`;
    if (fetchedKeyRef.current === key) return;
    fetchedKeyRef.current = key;

    setIsLoading(true);

    const isFireFilter =
      isFireParam === "true" ? true : isFireParam === "false" ? false : undefined;

    fetchEvents(accessToken, { page, size: PAGE_SIZE, isFire: isFireFilter })
      .then((res) => {
        setData(res);
        setError("");
      })
      .catch((err) => {
        setError(
          err instanceof ApiRequestError
            ? err.message
            : "이벤트를 불러오지 못했습니다.",
        );
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [isReady, accessToken, page, isFireParam, forceRefresh]);

  React.useEffect(() => {
    if (!isReady || !accessToken) return;

    const isFireFilter =
      isFireParam === "true" ? true : isFireParam === "false" ? false : undefined;

    const id = setInterval(() => {
      fetchEvents(accessToken, { page, size: PAGE_SIZE, isFire: isFireFilter })
        .then((res) => {
          setData(res);
          fetchedKeyRef.current = `${accessToken}:${page}:${isFireParam}:${forceRefresh}`;
        })
        .catch(() => {});
    }, POLL_INTERVAL_MS);

    return () => clearInterval(id);
  }, [isReady, accessToken, page, isFireParam, forceRefresh]);

  function updateQuery(next: { page?: number; is_fire?: string }) {
    const params = new URLSearchParams(searchParams.toString());

    if (next.page !== undefined) {
      if (next.page <= 1) params.delete("page");
      else params.set("page", String(next.page));
    }
    if (next.is_fire !== undefined) {
      if (!next.is_fire) params.delete("is_fire");
      else params.set("is_fire", next.is_fire);
      params.delete("page");
    }

    const queryString = params.toString();
    router.push(`/events${queryString ? `?${queryString}` : ""}`);
  }

  if (!isReady) {
    return (
      <section className="px-5 py-10 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-center text-base font-bold text-slate-500 dark:text-warm-300">
            로그인 확인 중입니다...
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="px-5 py-10 sm:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <SectionHeader
          title="탐지 이벤트"
          description="AI가 탐지한 화재 위험 이벤트 목록입니다."
          action={
            <Button
              type="button"
              variant="outline"
              disabled={isLoading}
              onClick={() => setForceRefresh((c) => c + 1)}
            >
              <RefreshCw className="size-4" aria-hidden="true" />
              새로고침
            </Button>
          }
        />

        <div className="flex flex-col gap-2 sm:flex-row">
          <select
            value={isFireParam}
            onChange={(e) => updateQuery({ is_fire: e.target.value })}
            className="h-10 rounded-md border border-input bg-transparent px-3 text-sm font-semibold text-slate-900 outline-none dark:bg-slate-900 dark:text-cream-50"
          >
            {IS_FIRE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {error ? (
          <p className="rounded-lg bg-danger-critical/10 px-4 py-3 text-sm font-bold text-danger-critical">
            {error}
          </p>
        ) : null}

        {isLoading ? (
          <p className="text-center text-base font-bold text-slate-500 dark:text-warm-300">
            이벤트를 불러오는 중입니다...
          </p>
        ) : data && data.events.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {data.events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <p className="rounded-xl border border-dashed border-warm-300 p-10 text-center text-sm font-bold text-slate-500 dark:border-slate-600 dark:text-warm-300">
            탐지된 이벤트가 없습니다.
          </p>
        )}

        {data && data.pagination.total_pages > 1 ? (
          <EventPagination
            currentPage={data.pagination.current_page}
            totalPages={data.pagination.total_pages}
            onPageChange={(nextPage) => updateQuery({ page: nextPage })}
          />
        ) : null}
      </div>
    </section>
  );
}

function _resolveEventBadge(event: Event): React.ReactNode {
  // 옛 형식(vlm_results가 단일 dict)이 섞여 들어와도 렌더가 죽지 않도록 배열만 허용
  const results = Array.isArray(event.vlmResults) ? event.vlmResults : [];

  if (results.length === 0) {
    return <Badge className="bg-flare-500 text-cream-50">탐지 후보</Badge>;
  }

  const isConfirmedFire = results.some(
    (r) =>
      ["fire", "smoke"].includes(r.class_name) &&
      !r.is_false_positive &&
      !r.undetermined,
  );
  if (isConfirmedFire) {
    return <Badge className="bg-danger-critical text-cream-50">화재 확정</Badge>;
  }

  const needsReview = results.some((r) => r.undetermined);
  if (needsReview) {
    return <Badge className="bg-flare-500 text-cream-50">미확정 · 확인 필요</Badge>;
  }

  const hasConfirmedFalsePositive = results.some(
    (r) => r.class_name === "carlight" && r.is_false_positive,
  );
  if (hasConfirmedFalsePositive) {
    return <Badge variant="secondary">오탐 확정</Badge>;
  }

  return <Badge variant="secondary">오탐 처리</Badge>;
}

function EventCard({ event }: { event: Event }) {
  const fireBadge = _resolveEventBadge(event);

  return (
    <div className="overflow-hidden rounded-xl border border-warm-200 bg-warm-50 shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <div className="relative aspect-video w-full bg-slate-200 dark:bg-slate-700">
        {event.snapshotUrl ? (
          <img
            src={event.snapshotUrl}
            alt={`${event.locationName} 스냅샷`}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Camera className="size-10 text-slate-400 dark:text-slate-500" />
          </div>
        )}
        <div className="absolute right-2 top-2">{fireBadge}</div>
      </div>

      <div className="space-y-2 p-3">
        <p className="truncate text-sm font-black text-slate-900 dark:text-cream-50">
          {event.locationName}
        </p>
        <p className="text-xs font-semibold text-slate-500 dark:text-warm-300">
          {event.detectedAt ? formatDateTime(event.detectedAt) : "-"}
        </p>
        {event.detections.length > 0 ? (
          <div className="flex flex-wrap gap-1">
            {event.detections.map((d, i) => (
              <span
                key={i}
                className="rounded-full bg-cream-100 px-2 py-0.5 text-[11px] font-bold text-slate-600 dark:bg-slate-700 dark:text-warm-200"
              >
                {d.label} {Math.round(d.confidence * 100)}%
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}

type EventPaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

function EventPagination({
  currentPage,
  totalPages,
  onPageChange,
}: EventPaginationProps) {
  const windowSize = 5;
  const half = Math.floor(windowSize / 2);
  let start = Math.max(1, currentPage - half);
  const end = Math.min(totalPages, start + windowSize - 1);
  start = Math.max(1, end - windowSize + 1);

  const pageNumbers = Array.from(
    { length: end - start + 1 },
    (_, i) => start + i,
  );

  return (
    <div className="flex items-center justify-center gap-2">
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        이전
      </Button>
      {pageNumbers.map((number) => (
        <Button
          key={number}
          type="button"
          size="sm"
          variant={number === currentPage ? "default" : "outline"}
          className={number === currentPage ? "bg-flare-500 hover:bg-flare-600" : ""}
          onClick={() => onPageChange(number)}
        >
          {number}
        </Button>
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={currentPage >= totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        다음
      </Button>
    </div>
  );
}
