import type { BoardType, Pagination } from "@/types/board";

export type AdminRole = "admin" | "operator" | "viewer";

export type AdminUser = {
  id: number;
  email: string;
  name: string;
  role: AdminRole;
  provider: string;
  department?: string | null;
  phone?: string | null;
  is_active: boolean;
  created_at?: string | null;
  updated_at?: string | null;
};

export type AdminPost = {
  id: number;
  title: string;
  author_name: string;
  author_email: string;
  board_type: BoardType;
  is_important: boolean;
  is_hidden: boolean;
  view_count: number;
  comment_count: number;
  admin_comment_count: number;
  inquiry_status?: "open" | "answered";
  created_at?: string | null;
  updated_at?: string | null;
};

export type AdminSummary = {
  metrics: {
    total_users: number;
    active_users: number;
    total_posts: number;
    hidden_posts: number;
    hidden_comments: number;
    open_inquiries: number;
  };
  board_counts: Record<BoardType, number>;
  latest_inquiries: AdminPost[];
  latest_posts: AdminPost[];
};

export type AdminUsersResponse = {
  users: AdminUser[];
  pagination: Pagination;
};

export type AdminUserPayload = {
  email: string;
  name: string;
  password?: string;
  role: AdminRole;
  department?: string;
  phone?: string;
  is_active: boolean;
};

export type AdminPostsResponse = {
  posts: AdminPost[];
  pagination: Pagination;
};

export type AdminInquiriesResponse = {
  inquiries: AdminPost[];
  pagination: Pagination;
};
