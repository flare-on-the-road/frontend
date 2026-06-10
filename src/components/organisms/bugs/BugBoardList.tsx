"use client";

import { Eye, Heart, MessageCircle, Plus, Search } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import * as React from "react";

import { Badge, Button, Input } from "@/components/atoms";
import { SectionHeader } from "@/components/molecules";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { formatDateTime } from "@/lib/format";
import { ApiRequestError, fetchPosts } from "@/services/bugsApi";
import {
  SEARCH_TYPE_OPTIONS,
  type PostListResponse,
  type SearchType,
} from "@/types/bug";

const PAGE_SIZE = 10;

export function BugBoardList() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isReady, accessToken } = useRequireAuth();

  const page = Math.max(Number(searchParams.get("page") ?? "1") || 1, 1);
  const keywordParam = searchParams.get("keyword") ?? "";
  const searchTypeParam =
    (searchParams.get("search_type") as SearchType | null) ?? "title";

  const [data, setData] = React.useState<PostListResponse | null>(null);
  const [error, setError] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(true);

  const fetchedKeyRef = React.useRef<string | null>(null);

  React.useEffect(() => {
    if (!isReady || !accessToken) return;

    const key = `${accessToken}:${page}:${keywordParam}:${searchTypeParam}`;
    if (fetchedKeyRef.current === key) return;
    fetchedKeyRef.current = key;

    let cancelled = false;

    fetchPosts(accessToken, {
      page,
      size: PAGE_SIZE,
      keyword: keywordParam || undefined,
      searchType: searchTypeParam,
    })
      .then((res) => {
        if (cancelled) return;
        setData(res);
        setError("");
      })
      .catch((err) => {
        if (!cancelled) {
          setError(
            err instanceof ApiRequestError
              ? err.message
              : "게시글을 불러오지 못했습니다.",
          );
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [isReady, accessToken, page, keywordParam, searchTypeParam]);

  function updateQuery(next: {
    page?: number;
    keyword?: string;
    search_type?: SearchType;
  }) {
    const params = new URLSearchParams(searchParams.toString());

    if (next.page !== undefined) {
      if (next.page <= 1) params.delete("page");
      else params.set("page", String(next.page));
    }
    if (next.keyword !== undefined) {
      if (!next.keyword) params.delete("keyword");
      else params.set("keyword", next.keyword);
    }
    if (next.search_type !== undefined) {
      if (next.search_type === "title") params.delete("search_type");
      else params.set("search_type", next.search_type);
    }

    const queryString = params.toString();
    router.push(`/bugs${queryString ? `?${queryString}` : ""}`);
  }

  function handleSearchSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const keyword = String(formData.get("keyword") ?? "").trim();
    const searchType = (formData.get("search_type") as SearchType | null) ?? "title";
    updateQuery({ page: 1, keyword, search_type: searchType });
  }

  if (!isReady) {
    return (
      <section className="px-5 py-10 sm:px-8">
        <div className="mx-auto max-w-6xl">
          <p className="text-center text-base font-bold text-slate-500 dark:text-warm-300">
            로그인 확인 중입니다...
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="px-5 py-10 sm:px-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <SectionHeader
          title="세스코"
          description="세스코 코드로 관리합니다. 버그 박멸을 원하시면 제보해 주세요! "
          action={
            <Button asChild className="bg-flare-500 font-bold hover:bg-flare-600">
              <Link href="/bugs/new">
                <Plus className="size-4" aria-hidden="true" />
                버그 제보
              </Link>
            </Button>
          }
        />

        <form
          key={`${searchTypeParam}:${keywordParam}`}
          className="flex flex-col gap-2 sm:flex-row"
          onSubmit={handleSearchSubmit}
        >
          <select
            name="search_type"
            defaultValue={searchTypeParam}
            className="h-10 rounded-md border border-input bg-transparent px-3 text-sm font-semibold text-slate-900 outline-none dark:bg-slate-900 dark:text-cream-50"
          >
            {SEARCH_TYPE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <Input
            name="keyword"
            defaultValue={keywordParam}
            placeholder="검색어를 입력하세요"
            className="h-10 flex-1 rounded-md border-warm-300 bg-cream-50 dark:border-slate-700 dark:bg-slate-900"
          />
          <Button type="submit" variant="outline" className="h-10">
            <Search className="size-4" aria-hidden="true" />
            검색
          </Button>
        </form>

        {error ? (
          <p className="rounded-lg bg-danger-critical/10 px-4 py-3 text-sm font-bold text-danger-critical">
            {error}
          </p>
        ) : null}

        {isLoading ? (
          <p className="text-center text-base font-bold text-slate-500 dark:text-warm-300">
            게시글을 불러오는 중입니다...
          </p>
        ) : data && data.posts.length > 0 ? (
          <div className="divide-y divide-warm-200 overflow-hidden rounded-xl border border-warm-200 bg-warm-50 dark:divide-slate-700 dark:border-slate-700 dark:bg-slate-800">
            {data.posts.map((post) => (
              <Link
                key={post.id}
                href={`/bugs/${post.id}`}
                className="flex flex-col gap-2 px-5 py-4 transition-colors hover:bg-cream-100 dark:hover:bg-slate-700 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0 space-y-1">
                  <div className="flex items-center gap-2">
                    {post.is_hidden ? (
                      <Badge variant="destructive">가려짐</Badge>
                    ) : null}
                    <p className="truncate text-base font-bold text-slate-900 dark:text-cream-50">
                      {post.title}
                    </p>
                  </div>
                  <p className="text-xs font-semibold text-slate-500 dark:text-warm-300">
                    {post.author_nickname ?? "알 수 없음"} ·{" "}
                    {formatDateTime(post.created_at)}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-4 text-xs font-bold text-slate-500 dark:text-warm-300">
                  <span className="inline-flex items-center gap-1">
                    <Eye className="size-3.5" aria-hidden="true" />
                    {post.view_count}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <MessageCircle className="size-3.5" aria-hidden="true" />
                    {post.comment_count}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Heart className="size-3.5" aria-hidden="true" />
                    {post.like_count}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="rounded-xl border border-dashed border-warm-300 p-10 text-center text-sm font-bold text-slate-500 dark:border-slate-600 dark:text-warm-300">
            게시글이 없습니다.
          </p>
        )}

        {data && data.pagination.total_pages > 1 ? (
          <PostPagination
            currentPage={data.pagination.current_page}
            totalPages={data.pagination.total_pages}
            onPageChange={(nextPage) => updateQuery({ page: nextPage })}
          />
        ) : null}
      </div>
    </section>
  );
}

type PostPaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

function PostPagination({ currentPage, totalPages, onPageChange }: PostPaginationProps) {
  const windowSize = 5;
  const half = Math.floor(windowSize / 2);
  let start = Math.max(1, currentPage - half);
  const end = Math.min(totalPages, start + windowSize - 1);
  start = Math.max(1, end - windowSize + 1);

  const pageNumbers = Array.from({ length: end - start + 1 }, (_, i) => start + i);

  return (
    <div className="flex items-center justify-center gap-2">
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        이전
      </Button>
      {pageNumbers.map((number) => (
        <Button
          key={number}
          type="button"
          size="sm"
          variant={number === currentPage ? "default" : "outline"}
          className={number === currentPage ? "bg-flare-500 hover:bg-flare-600" : ""}
          onClick={() => onPageChange(number)}
        >
          {number}
        </Button>
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={currentPage >= totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        다음
      </Button>
    </div>
  );
}
