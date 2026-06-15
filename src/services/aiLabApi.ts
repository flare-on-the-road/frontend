import { useAuthStore } from "@/stores/authStore";
import type { DetectResponse, ModelKey } from "@/types/ai-lab";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5001/api";

export class ApiRequestError extends Error {
  code: string;
  status: number;
  details?: Record<string, string>;

  constructor(
    code: string,
    message: string,
    status: number,
    details?: Record<string, string>,
  ) {
    super(message);
    this.code = code;
    this.status = status;
    this.details = details;
  }
}

async function request<T>(
  path: string,
  accessToken: string,
  init: RequestInit = {},
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
      ...(init.headers ?? {}),
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

export type DetectParams = {
  models: ModelKey[];
  threshold: number;
  imageKey?: string;
  imageBase64?: string;
};

export function detectImages(accessToken: string, params: DetectParams) {
  return request<DetectResponse>("/ai-lab/detect", accessToken, {
    method: "POST",
    body: JSON.stringify({
      models: params.models,
      threshold: params.threshold,
      image_key: params.imageKey,
      image_base64: params.imageBase64,
    }),
  });
}
