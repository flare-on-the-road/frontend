import type { AuthResponse, AuthUser } from "@/types/auth";

export type { AuthResponse, AuthUser } from "@/types/auth";

type ApiEnvelope<T> = {
  success: boolean;
  message: string;
  data: T;
};

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5001/api";

export function getOAuthLoginUrl(provider: "kakao" | "naver" | "google") {
  return `${API_BASE_URL}/auth/oauth/${provider}/login`;
}

export async function login(payload: { email: string; password: string }) {
  return request<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function register(payload: {
  email: string;
  name: string;
  password: string;
  department?: string;
  phone?: string;
}) {
  return request<AuthResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function findId(payload: { name: string; phone: string }) {
  return request<{
    accounts: Array<{
      email: string;
      provider: string;
      createdAt?: string | null;
    }>;
  }>("/auth/find-id", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function forgotPassword(payload: {
  email: string;
  name: string;
  phone: string;
}) {
  return request<{
    temporaryPassword: string;
    message: string;
  }>("/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function getCurrentUser(accessToken: string) {
  return request<AuthUser>("/auth/me", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

async function request<T>(path: string, init: RequestInit) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
  });
  const payload = (await response.json()) as ApiEnvelope<T>;

  if (!response.ok || !payload.success) {
    throw new Error(payload.message || "요청 처리 중 오류가 발생했습니다.");
  }

  return payload.data;
}
