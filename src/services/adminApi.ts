import { useAuthStore } from "@/stores/authStore";
import type {
  AdminInquiriesResponse,
  AdminPostsResponse,
  AdminRole,
  AdminSummary,
  AdminUser,
  AdminUserPayload,
  AdminUsersResponse,
} from "@/types/admin";
import type { BoardType } from "@/types/board";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5001/api";

export class AdminApiRequestError extends Error {
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
    this.name = "AdminApiRequestError";
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

    throw new AdminApiRequestError(code, message, response.status, error.details);
  }

  return payload as T;
}

function buildQuery(params: Record<string, string | number | undefined>) {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      query.set(key, String(value));
    }
  });

  const queryString = query.toString();
  return queryString ? `?${queryString}` : "";
}

export function fetchAdminSummary(accessToken: string) {
  return request<AdminSummary>("/admin/summary", accessToken);
}

export function fetchAdminUsers(
  accessToken: string,
  params: {
    page?: number;
    size?: number;
    keyword?: string;
    role?: AdminRole | "all";
    active?: "all" | "true" | "false";
  } = {},
) {
  return request<AdminUsersResponse>(
    `/admin/users${buildQuery({
      page: params.page,
      size: params.size,
      keyword: params.keyword,
      role: params.role === "all" ? undefined : params.role,
      active: params.active === "all" ? undefined : params.active,
    })}`,
    accessToken,
  );
}

export function createAdminUser(accessToken: string, payload: AdminUserPayload) {
  return request<AdminUser>("/admin/users", accessToken, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function fetchAdminUser(accessToken: string, userId: number) {
  return request<AdminUser>(`/admin/users/${userId}`, accessToken);
}

export function updateAdminUser(
  accessToken: string,
  userId: number,
  payload: Partial<AdminUserPayload>,
) {
  return request<AdminUser>(`/admin/users/${userId}`, accessToken, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export function deactivateAdminUser(accessToken: string, userId: number) {
  return request<AdminUser>(`/admin/users/${userId}`, accessToken, {
    method: "DELETE",
  });
}

export function updateAdminUserRole(
  accessToken: string,
  userId: number,
  role: AdminRole,
) {
  return request<AdminUser>(`/admin/users/${userId}/role`, accessToken, {
    method: "PATCH",
    body: JSON.stringify({ role }),
  });
}

export function updateAdminUserActive(
  accessToken: string,
  userId: number,
  isActive: boolean,
) {
  return request<AdminUser>(`/admin/users/${userId}/active`, accessToken, {
    method: "PATCH",
    body: JSON.stringify({ is_active: isActive }),
  });
}

export function fetchAdminPosts(
  accessToken: string,
  params: {
    page?: number;
    size?: number;
    keyword?: string;
    boardType?: BoardType | "all";
    visibility?: "all" | "visible" | "hidden";
  } = {},
) {
  return request<AdminPostsResponse>(
    `/admin/posts${buildQuery({
      page: params.page,
      size: params.size,
      keyword: params.keyword,
      board_type: params.boardType === "all" ? undefined : params.boardType,
      visibility: params.visibility === "all" ? undefined : params.visibility,
    })}`,
    accessToken,
  );
}

export function hideAdminPost(accessToken: string, postId: number) {
  return request<{ id: number; is_hidden: boolean }>(
    `/admin/posts/${postId}/hide`,
    accessToken,
    { method: "PATCH" },
  );
}

export function unhideAdminPost(accessToken: string, postId: number) {
  return request<{ id: number; is_hidden: boolean }>(
    `/admin/posts/${postId}/unhide`,
    accessToken,
    { method: "PATCH" },
  );
}

export function fetchAdminInquiries(
  accessToken: string,
  params: {
    page?: number;
    size?: number;
    keyword?: string;
    status?: "all" | "open" | "answered";
  } = {},
) {
  return request<AdminInquiriesResponse>(
    `/admin/inquiries${buildQuery({
      page: params.page,
      size: params.size,
      keyword: params.keyword,
      status: params.status === "all" ? undefined : params.status,
    })}`,
    accessToken,
  );
}

export function answerAdminInquiry(
  accessToken: string,
  postId: number,
  content: string,
) {
  return request<{ id: number }>(`/admin/inquiries/${postId}/answer`, accessToken, {
    method: "POST",
    body: JSON.stringify({ content }),
  });
}
