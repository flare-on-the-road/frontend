import { useAuthStore } from "@/stores/authStore";
import type {
  BoardType,
  PostDetail,
  PostListResponse,
  SearchType,
} from "@/types/board";

export {
  ApiRequestError,
  fetchComments,
  createComment,
  updateComment,
  deleteComment,
  hideComment,
  unhideComment,
} from "./bugsApi";

import { ApiRequestError } from "./bugsApi";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5001/api";

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

export type ListPostsParams = {
  page?: number;
  size?: number;
  keyword?: string;
  searchType?: SearchType;
  boardType: BoardType;
};

export function fetchPosts(accessToken: string, params: ListPostsParams) {
  const query = new URLSearchParams();

  if (params.page) query.set("page", String(params.page));
  if (params.size) query.set("size", String(params.size));
  if (params.keyword) query.set("keyword", params.keyword);
  if (params.searchType) query.set("search_type", params.searchType);
  query.set("board_type", params.boardType);

  return request<PostListResponse>(`/posts?${query.toString()}`, accessToken);
}

export function fetchPostDetail(accessToken: string, postId: number) {
  return request<PostDetail>(`/posts/${postId}`, accessToken);
}

export function createPost(
  accessToken: string,
  data: { title: string; content: string; board_type: BoardType; is_important?: boolean },
) {
  return request<{ id: number }>("/posts", accessToken, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function updatePost(
  accessToken: string,
  postId: number,
  data: { title: string; content: string; is_important?: boolean },
) {
  return request<{ id: number }>(`/posts/${postId}`, accessToken, {
    method: "PUT",
    body: JSON.stringify(data),
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
