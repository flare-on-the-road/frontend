import type { CctvListResponse } from "@/types/cctv";

type ApiEnvelope<T> = {
  success: boolean;
  message: string;
  data: T;
};

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5001/api";

export async function fetchCctvs(params?: { cctvType?: string; limit?: number }) {
  const searchParams = new URLSearchParams();

  if (params?.cctvType) {
    searchParams.set("cctvType", params.cctvType);
  }

  if (params?.limit) {
    searchParams.set("limit", String(params.limit));
  }

  const queryString = searchParams.toString();
  const response = await fetch(
    `${API_BASE_URL}/cctvs${queryString ? `?${queryString}` : ""}`,
  );
  const payload = (await response.json()) as ApiEnvelope<CctvListResponse>;

  if (!response.ok || !payload.success) {
    throw new Error(payload.message || "CCTV 목록을 불러오지 못했습니다.");
  }

  return payload.data;
}
