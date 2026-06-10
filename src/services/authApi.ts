import type {
  AuthResponse,
  AuthUser,
  UpdateProfilePayload,
} from "@/types/auth";

export type { AuthResponse, AuthUser, UpdateProfilePayload } from "@/types/auth";

type ApiEnvelope<T> = {
  success: boolean;
  message: string;
  data: T;
  msg?: string;
  error?: string;
  detail?: string;
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

export async function refreshAccessToken(refreshToken: string) {
  return request<{
    accessToken: string;
  }>("/auth/refresh", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${refreshToken}`,
    },
  });
}

export async function getCurrentUser(accessToken: string) {
  return request<AuthUser>("/users/me", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export async function updateCurrentUserProfile(
  accessToken: string,
  payload: UpdateProfilePayload,
) {
  return request<AuthUser>("/users/me", {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      name: payload.name,
      department: payload.department,
      phone: payload.phone,
    }),
  });
}

export async function updateCurrentUserProfileImage(
  accessToken: string,
  profileImage: File,
) {
  const formData = new FormData();
  formData.append("profileImage", profileImage);

  return request<AuthUser>("/users/me/profile-image", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: formData,
  });
}

async function request<T>(path: string, init: RequestInit) {
  const isFormData = init.body instanceof FormData;
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...(init.headers ?? {}),
    },
  });
  const payload = await parseResponsePayload<T>(response);

  if (!response.ok || !payload.success) {
    throw new Error(getErrorMessage(payload));
  }

  return payload.data;
}

function getErrorMessage<T>(payload: ApiEnvelope<T>) {
  return (
    payload.message ||
    payload.msg ||
    payload.error ||
    payload.detail ||
    "요청 처리 중 오류가 발생했습니다."
  );
}

async function parseResponsePayload<T>(response: Response) {
  const contentType = response.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    return (await response.json()) as ApiEnvelope<T>;
  }

  const message = await response.text();

  return {
    success: false,
    message: message || response.statusText,
    data: null as T,
  };
}
