export const POST_TITLE_MAX_LENGTH = 100;
export const POST_CONTENT_MAX_LENGTH = 10000;
export const COMMENT_CONTENT_MAX_LENGTH = 1000;

export type Pagination = {
  current_page: number;
  size: number;
  total_count: number;
  total_pages: number;
};

export type PostSummary = {
  id: number;
  title: string;
  author_nickname: string | null;
  view_count: number;
  comment_count: number;
  like_count: number;
  is_hidden: boolean;
  created_at: string;
};

export type PostListResponse = {
  posts: PostSummary[];
  pagination: Pagination;
};

export type PostPermissions = {
  can_edit: boolean;
  can_delete: boolean;
  can_hide: boolean;
};

export type PostDetail = {
  id: number;
  title: string;
  content: string;
  author_id: number;
  author_nickname: string | null;
  is_hidden: boolean;
  view_count: number;
  like_count: number;
  liked_by_me: boolean;
  comment_count: number;
  created_at: string;
  updated_at: string;
  permissions: PostPermissions;
};

export type CommentPermissions = {
  can_edit: boolean;
  can_delete: boolean;
  can_hide: boolean;
};

export type CommentNode = {
  id: number;
  author_nickname: string | null;
  content: string;
  is_deleted: boolean;
  is_hidden: boolean;
  created_at: string;
  permissions: CommentPermissions;
  replies: CommentNode[];
};

export type CommentTreeResponse = {
  comments: CommentNode[];
  total_count: number;
};

export type SearchType = "title" | "content" | "title_content" | "author";

export const SEARCH_TYPE_OPTIONS: Array<{ value: SearchType; label: string }> = [
  { value: "title", label: "제목" },
  { value: "content", label: "내용" },
  { value: "title_content", label: "제목+내용" },
  { value: "author", label: "작성자" },
];
