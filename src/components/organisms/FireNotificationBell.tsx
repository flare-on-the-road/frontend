"use client";

import { Bell, Flame, X } from "lucide-react";
import { useRouter } from "next/navigation";
import * as React from "react";
import { toast } from "sonner";

import { Button } from "@/components/atoms";
import { formatDateTime } from "@/lib/format";
import { fetchFireAlerts } from "@/services/eventsApi";
import { useAuthStore } from "@/stores/authStore";
import type { Event } from "@/types/event";

const LAST_SEEN_KEY = "flare-fire-alert-last-seen-id";
const POLL_INTERVAL_MS = 10000;

export function FireNotificationBell() {
  const router = useRouter();
  const accessToken = useAuthStore((state) => state.accessToken);
  const user = useAuthStore((state) => state.user);
  const [unreadCount, setUnreadCount] = React.useState(0);
  const storedLastSeenId = React.useMemo(() => readStoredLastSeenId(), []);
  const initializedRef = React.useRef(false);
  const lastSeenIdRef = React.useRef(storedLastSeenId);
  const lastFetchedIdRef = React.useRef<number | null>(storedLastSeenId);
  const shownIdsRef = React.useRef<Set<number>>(new Set());

  const markSeen = React.useCallback((eventId?: number | null) => {
    if (!eventId || typeof window === "undefined") return;
    window.localStorage.setItem(LAST_SEEN_KEY, String(eventId));
    lastSeenIdRef.current = eventId;
    setUnreadCount(0);
  }, []);

  const showFireToast = React.useCallback(
    (event: Event) => {
      if (shownIdsRef.current.has(event.id)) return;
      shownIdsRef.current.add(event.id);

      toast.custom(
        (toastId) => (
          <FireAlertPopup
            event={event}
            onClose={() => toast.dismiss(toastId)}
            onConfirm={() => {
              markSeen(event.id);
              toast.dismiss(toastId);
              router.push(`/admin?tab=monitor&cctvId=${encodeURIComponent(event.cctvId)}`);
            }}
          />
        ),
        { duration: Infinity },
      );
    },
    [markSeen, router],
  );

  React.useEffect(() => {
    if (!accessToken || !user) return;
    const token = accessToken;
    let cancelled = false;

    async function poll() {
      try {
        const data = await fetchFireAlerts(token, {
          afterId: lastFetchedIdRef.current,
          size: 20,
        });
        if (cancelled) return;

        if (!initializedRef.current) {
          initializedRef.current = true;
          if (lastSeenIdRef.current === null && data.latestId) {
            lastFetchedIdRef.current = data.latestId;
            markSeen(data.latestId);
          } else {
            setUnreadCount(data.events.length);
            lastFetchedIdRef.current = data.latestId ?? lastFetchedIdRef.current;
          }
          return;
        }

        if (data.events.length > 0) {
          setUnreadCount((count) => Math.min(count + data.events.length, 99));
          lastFetchedIdRef.current = data.latestId ?? data.events[data.events.length - 1]?.id ?? lastFetchedIdRef.current;
          data.events.forEach(showFireToast);
        }
      } catch {
        // 알림 폴링 실패는 화면 사용 흐름을 막지 않는다.
      }
    }

    void poll();
    const intervalId = window.setInterval(poll, POLL_INTERVAL_MS);

    return () => {
      cancelled = true;
      window.clearInterval(intervalId);
    };
  }, [accessToken, markSeen, showFireToast, user]);

  if (!user) return null;

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className="relative size-11 rounded-full text-slate-600 hover:bg-warm-100 hover:text-flare-600 dark:text-warm-200 dark:hover:bg-slate-800 dark:hover:text-flare-400"
      aria-label={`화재 알림 ${unreadCount}건`}
      title="화재 알림"
      onClick={() => {
        markSeen(lastFetchedIdRef.current);
        router.push("/events");
      }}
    >
      <Bell className="size-5" aria-hidden="true" />
      {unreadCount > 0 ? (
        <span className="absolute right-1 top-1 flex min-w-5 items-center justify-center rounded-full bg-danger-critical px-1.5 py-0.5 text-[11px] font-black leading-none text-cream-50">
          {unreadCount > 99 ? "99+" : unreadCount}
        </span>
      ) : null}
    </Button>
  );
}

function readStoredLastSeenId() {
  if (typeof window === "undefined") return null;
  const stored = Number(window.localStorage.getItem(LAST_SEEN_KEY));
  return Number.isFinite(stored) && stored > 0 ? stored : null;
}

function FireAlertPopup({
  event,
  onClose,
  onConfirm,
}: {
  event: Event;
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="w-[min(92vw,420px)] overflow-hidden rounded-lg border border-danger-critical/30 bg-white shadow-xl dark:border-danger-critical/50 dark:bg-slate-900">
      <div className="flex items-start justify-between gap-3 border-b border-warm-200 p-4 dark:border-slate-800">
        <div className="flex min-w-0 items-start gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-danger-critical/10 text-danger-critical">
            <Flame className="size-5" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <p className="text-sm font-black text-danger-critical">화재 확정 알림</p>
            <h3 className="mt-1 truncate text-lg font-black text-slate-950 dark:text-cream-50">
              {event.cctvName}
            </h3>
            <p className="mt-1 truncate text-xs font-bold text-slate-500 dark:text-warm-300">
              {event.detectedAt ? formatDateTime(event.detectedAt) : "탐지 시각 없음"}
            </p>
          </div>
        </div>
        <button
          type="button"
          className="rounded-full p-1 text-slate-400 hover:bg-warm-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-cream-50"
          aria-label="알림 닫기"
          onClick={onClose}
        >
          <X className="size-4" aria-hidden="true" />
        </button>
      </div>

      {event.snapshotUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={event.snapshotUrl}
          alt={`${event.cctvName} 탐지 캡처 이미지`}
          className="aspect-video w-full bg-slate-950 object-cover"
        />
      ) : (
        <div className="flex aspect-video items-center justify-center bg-slate-950 text-sm font-bold text-warm-300">
          탐지 캡처 이미지를 불러올 수 없습니다.
        </div>
      )}

      <div className="space-y-3 p-4">
        <p className="text-sm font-semibold leading-6 text-slate-600 dark:text-warm-200">
          {event.locationName}에서 화재로 확정된 탐지 이벤트가 발생했습니다.
        </p>
        {Array.isArray(event.vlmResults) && event.vlmResults.length > 0 ? (
          <p className="rounded-md bg-warm-100 p-3 text-xs font-bold leading-5 text-slate-600 dark:bg-slate-800 dark:text-warm-200">
            {event.vlmResults
              .filter((r) => !r.is_false_positive)
              .map((r) => r.reason)
              .join(" / ") || event.vlmResults[0].reason}
          </p>
        ) : null}
        <Button type="button" className="w-full bg-flare-500 font-bold hover:bg-flare-600" onClick={onConfirm}>
          관제 화면에서 확인
        </Button>
      </div>
    </div>
  );
}
