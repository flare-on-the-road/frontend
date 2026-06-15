import { useAuthStore } from "@/stores/authStore";
import type { Event, EventListResponse, ListEventsParams } from "@/types/event";

class ApiRequestError extends Error {
  constructor(
    public code: string,
    message: string,
    public status: number,
    public details?: unknown,
  ) {
    super(message);
    this.name = "ApiRequestError";
  }
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5001/api";

async function request<T>(path: string, accessToken: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const text = await response.text();
  const payload = text ? JSON.parse(text) : null;

  if (!response.ok) {
    const error = payload?.error ?? {};
    const code = error.code ?? "UNKNOWN_ERROR";
    const message = error.message ?? "요청 처리 중 오류가 발생했습니다.";

    if (code === "AUTH_REQUIRED" && typeof window !== "undefined") {
      useAuthStore.getState().logout();
      window.location.href = "/login";
    }

    throw new ApiRequestError(code, message, response.status, error.details);
  }

  return payload as T;
}

export function fetchEvents(
  accessToken: string,
  params: ListEventsParams = {},
) {
  const query = new URLSearchParams();
  if (params.page) query.set("page", String(params.page));
  if (params.size) query.set("size", String(params.size));
  if (params.cctvId) query.set("cctv_id", params.cctvId);
  if (params.isFire !== undefined) query.set("is_fire", String(params.isFire));
  if (params.dateFrom) query.set("date_from", params.dateFrom);
  if (params.dateTo) query.set("date_to", params.dateTo);

  const qs = query.toString();
  return request<EventListResponse>(`/events${qs ? `?${qs}` : ""}`, accessToken);
}

export function fetchEventDetail(accessToken: string, eventId: number) {
  return request<Event>(`/events/${eventId}`, accessToken);
}

export { ApiRequestError };
