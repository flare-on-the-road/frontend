import { useAuthStore } from "@/stores/authStore";
import type {
  CommentTreeResponse,
  PostDetail,
  PostListResponse,
  SearchType,
} from "@/types/bug";

export const API_BASE_URL =
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
    this.name = "ApiRequestError";
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
  const isFormData = init.body instanceof FormData;
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
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

export type ListPostsParams = {
  page?: number;
  size?: number;
  keyword?: string;
  searchType?: SearchType;
};

export function fetchPosts(accessToken: string, params: ListPostsParams = {}) {
  const query = new URLSearchParams();

  if (params.page) query.set("page", String(params.page));
  if (params.size) query.set("size", String(params.size));
  if (params.keyword) query.set("keyword", params.keyword);
  if (params.searchType) query.set("search_type", params.searchType);

  const queryString = query.toString();

  return request<PostListResponse>(
    `/posts${queryString ? `?${queryString}` : ""}`,
    accessToken,
  );
}

export function fetchPostDetail(accessToken: string, postId: number) {
  return request<PostDetail>(`/posts/${postId}`, accessToken);
}

export function createPost(
  accessToken: string,
  data: { title: string; content: string; attachments?: File[] },
) {
  const formData = new FormData();
  formData.append("title", data.title);
  formData.append("content", data.content);
  (data.attachments ?? []).forEach((file) => {
    formData.append("attachments", file);
  });

  return request<{ id: number }>("/posts", accessToken, {
    method: "POST",
    body: formData,
  });
}

export function updatePost(
  accessToken: string,
  postId: number,
  data: {
    title: string;
    content: string;
    attachments?: File[];
    removedFileIds?: number[];
  },
) {
  const formData = new FormData();
  formData.append("title", data.title);
  formData.append("content", data.content);
  (data.attachments ?? []).forEach((file) => {
    formData.append("attachments", file);
  });
  (data.removedFileIds ?? []).forEach((id) => {
    formData.append("removed_file_ids", String(id));
  });

  return request<{ id: number }>(`/posts/${postId}`, accessToken, {
    method: "PUT",
    body: formData,
  });
}

export function deletePost(accessToken: string, postId: number) {
  return request<{ id: number }>(`/posts/${postId}`, accessToken, {
    method: "DELETE",
  });
}

export function hidePost(accessToken: string, postId: number) {
  return request<{ id: number; is_hidden: boolean }>(
    `/posts/${postId}/hide`,
    accessToken,
    { method: "PATCH" },
  );
}

export function unhidePost(accessToken: string, postId: number) {
  return request<{ id: number; is_hidden: boolean }>(
    `/posts/${postId}/unhide`,
    accessToken,
    { method: "PATCH" },
  );
}

export function toggleLike(accessToken: string, postId: number) {
  return request<{ liked: boolean; like_count: number }>(
    `/posts/${postId}/like`,
    accessToken,
    { method: "POST" },
  );
}

export function fetchComments(accessToken: string, postId: number) {
  return request<CommentTreeResponse>(`/posts/${postId}/comments`, accessToken);
}

export function createComment(
  accessToken: string,
  postId: number,
  data: { content: string; parent_id?: number },
) {
  return request<{ id: number }>(`/posts/${postId}/comments`, accessToken, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function updateComment(
  accessToken: string,
  commentId: number,
  data: { content: string },
) {
  return request<{ id: number }>(`/comments/${commentId}`, accessToken, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export function deleteComment(accessToken: string, commentId: number) {
  return request<{ id: number }>(`/comments/${commentId}`, accessToken, {
    method: "DELETE",
  });
}

export function hideComment(accessToken: string, commentId: number) {
  return request<{ id: number; is_hidden: boolean }>(
    `/comments/${commentId}/hide`,
    accessToken,
    { method: "PATCH" },
  );
}

export function unhideComment(accessToken: string, commentId: number) {
  return request<{ id: number; is_hidden: boolean }>(
    `/comments/${commentId}/unhide`,
    accessToken,
    { method: "PATCH" },
  );
}
