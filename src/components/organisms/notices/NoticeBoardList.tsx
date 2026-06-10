"use client";

import { Heart, MessageCircle, Plus, Search } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import * as React from "react";

import { Badge, Button, Input } from "@/components/atoms";
import { SectionHeader } from "@/components/molecules";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { formatDateShort } from "@/lib/format";
import { cn } from "@/lib/utils";
import { ApiRequestError, fetchPosts } from "@/services/postsApi";
import { useAuthStore } from "@/stores/authStore";
import {
  SEARCH_TYPE_OPTIONS,
  type PostListResponse,
  type SearchType,
} from "@/types/board";

const PAGE_SIZE = 10;

export function NoticeBoardList() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isReady, accessToken } = useRequireAuth();
  const user = useAuthStore((state) => state.user);
  const isAdmin = user?.role === "admin";

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
      boardType: "notice",
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
    router.push(`/notices${queryString ? `?${queryString}` : ""}`);
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
          title="공지사항"
          description="Flare 운영 관련 공지사항을 확인하세요."
          action={
            isAdmin ? (
              <Button asChild className="bg-flare-500 font-bold hover:bg-flare-600">
                <Link href="/notices/new">
                  <Plus className="size-4" aria-hidden="true" />
                  공지 작성
                </Link>
              </Button>
            ) : undefined
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
          <div className="overflow-x-auto rounded-xl border border-warm-200 bg-warm-50 dark:border-slate-700 dark:bg-slate-800">
            <table className="w-full min-w-[640px] table-fixed text-sm">
              <thead>
                <tr className="border-b border-warm-200 text-xs font-black text-slate-500 dark:border-slate-700 dark:text-warm-300">
                  <th className="w-16 px-3 py-3 text-center">No</th>
                  <th className="px-3 py-3 text-left">제목</th>
                  <th className="w-24 px-3 py-3 text-center">글쓴이</th>
                  <th className="w-20 px-3 py-3 text-center">작성일</th>
                  <th className="w-16 px-3 py-3 text-center">조회</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-warm-200 dark:divide-slate-700">
                {data.posts.map((post, index) => {
                  const no =
                    data.pagination.total_count -
                    (data.pagination.current_page - 1) * PAGE_SIZE -
                    index;

                  return (
                    <tr
                      key={post.id}
                      className="transition-colors hover:bg-cream-100 dark:hover:bg-slate-700"
                    >
                      <td className="px-3 py-3 text-center text-xs font-semibold text-slate-500 dark:text-warm-300">
                        {no}
                      </td>
                      <td className="px-3 py-3">
                        <Link
                          href={`/notices/${post.id}`}
                          className="flex min-w-0 items-center gap-2 font-bold text-slate-900 hover:text-flare-600 dark:text-cream-50 dark:hover:text-flare-400"
                        >
                          {post.is_hidden ? (
                            <Badge variant="destructive">가려짐</Badge>
                          ) : null}
                          {post.is_important ? (
                            <Badge className="bg-flare-500 text-cream-50">중요</Badge>
                          ) : null}
                          <span
                            className={cn(
                              "truncate",
                              post.is_important && "font-black",
                            )}
                          >
                            {post.title}
                          </span>
                          <span className="inline-flex shrink-0 items-center gap-2 text-xs font-bold text-slate-400 dark:text-warm-400">
                            {post.comment_count > 0 ? (
                              <span className="inline-flex items-center gap-0.5">
                                <MessageCircle className="size-3.5" aria-hidden="true" />
                                {post.comment_count}
                              </span>
                            ) : null}
                            {post.like_count > 0 ? (
                              <span className="inline-flex items-center gap-0.5">
                                <Heart className="size-3.5" aria-hidden="true" />
                                {post.like_count}
                              </span>
                            ) : null}
                          </span>
                        </Link>
                      </td>
                      <td className="truncate px-3 py-3 text-center text-xs font-semibold text-slate-500 dark:text-warm-300">
                        {post.author_nickname ?? "알 수 없음"}
                      </td>
                      <td className="px-3 py-3 text-center text-xs font-semibold text-slate-500 dark:text-warm-300">
                        {formatDateShort(post.created_at)}
                      </td>
                      <td className="px-3 py-3 text-center text-xs font-bold text-slate-500 dark:text-warm-300">
                        {post.view_count}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
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
