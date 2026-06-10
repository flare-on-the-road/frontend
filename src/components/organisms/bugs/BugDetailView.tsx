"use client";

import { ArrowLeft, Eye, EyeOff, Heart, MessageCircle, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import * as React from "react";

import { Badge, Button, Card, CardContent } from "@/components/atoms";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { formatDateTime } from "@/lib/format";
import { cn } from "@/lib/utils";
import {
  ApiRequestError,
  deletePost,
  fetchPostDetail,
  hidePost,
  toggleLike,
  unhidePost,
} from "@/services/bugsApi";
import type { PostDetail } from "@/types/bug";

import { CommentSection } from "./CommentSection";

export function BugDetailView() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const postId = Number(params.id);
  const { isReady, accessToken } = useRequireAuth();

  const [post, setPost] = React.useState<PostDetail | null>(null);
  const [error, setError] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(true);
  const [isLiking, setIsLiking] = React.useState(false);

  const loadPost = React.useCallback(() => {
    if (!accessToken) return;

    fetchPostDetail(accessToken, postId)
      .then((result) => {
        setPost(result);
        setError("");
      })
      .catch((err) => {
        setError(
          err instanceof ApiRequestError ? err.message : "게시글을 불러오지 못했습니다.",
        );
      })
      .finally(() => setIsLoading(false));
  }, [accessToken, postId]);

  React.useEffect(() => {
    if (!isReady || !accessToken || Number.isNaN(postId)) return;
    loadPost();
  }, [isReady, accessToken, postId, loadPost]);

  async function handleLike() {
    if (!accessToken || !post || isLiking) return;

    setIsLiking(true);
    try {
      const result = await toggleLike(accessToken, postId);
      setPost({ ...post, liked_by_me: result.liked, like_count: result.like_count });
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : "좋아요 처리에 실패했습니다.");
    } finally {
      setIsLiking(false);
    }
  }

  async function handleDelete() {
    if (!accessToken || !post) return;
    if (!window.confirm("게시글을 삭제하시겠습니까?")) return;

    try {
      await deletePost(accessToken, postId);
      router.push("/bugs");
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : "삭제에 실패했습니다.");
    }
  }

  async function handleHideToggle() {
    if (!accessToken || !post) return;

    try {
      if (post.is_hidden) {
        await unhidePost(accessToken, postId);
      } else {
        await hidePost(accessToken, postId);
      }
      loadPost();
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : "처리에 실패했습니다.");
    }
  }

  if (!isReady || isLoading) {
    return (
      <section className="px-5 py-10 sm:px-8">
        <div className="mx-auto max-w-4xl">
          <p className="text-center text-base font-bold text-slate-500 dark:text-warm-300">
            불러오는 중입니다...
          </p>
        </div>
      </section>
    );
  }

  if (!accessToken || !post) {
    return (
      <section className="px-5 py-10 sm:px-8">
        <div className="mx-auto max-w-4xl space-y-4">
          <p className="rounded-lg bg-danger-critical/10 px-4 py-3 text-sm font-bold text-danger-critical">
            {error || "게시글을 찾을 수 없습니다."}
          </p>
          <Link
            href="/bugs"
            className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-flare-600 dark:text-warm-300"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            목록으로
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="px-5 py-10 sm:px-8">
      <div className="mx-auto max-w-4xl space-y-6">
        <Link
          href="/bugs"
          className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-flare-600 dark:text-warm-300"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          목록으로
        </Link>

        {error ? (
          <p className="rounded-lg bg-danger-critical/10 px-4 py-3 text-sm font-bold text-danger-critical">
            {error}
          </p>
        ) : null}

        <Card className="rounded-xl border-warm-200 bg-warm-50 dark:border-slate-700 dark:bg-slate-800">
          <CardContent className="space-y-4 p-6 sm:p-8">
            <div className="flex flex-wrap items-center gap-2">
              {post.is_hidden ? (
                <Badge variant="destructive">관리자에 의해 가려짐</Badge>
              ) : null}
              <h1 className="text-2xl font-black text-slate-900 dark:text-cream-50 sm:text-3xl">
                {post.title}
              </h1>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-sm font-semibold text-slate-500 dark:text-warm-300">
              <span>{post.author_nickname ?? "알 수 없음"}</span>
              <span>·</span>
              <span>{formatDateTime(post.created_at)}</span>
              <span className="inline-flex items-center gap-1">
                <Eye className="size-4" aria-hidden="true" />
                {post.view_count}
              </span>
              <span className="inline-flex items-center gap-1">
                <MessageCircle className="size-4" aria-hidden="true" />
                {post.comment_count}
              </span>
              <span className="inline-flex items-center gap-1">
                <Heart className="size-4" aria-hidden="true" />
                {post.like_count}
              </span>
            </div>

            <div className="whitespace-pre-wrap break-words text-base font-medium leading-7 text-slate-700 dark:text-warm-200">
              {post.content}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-warm-200 pt-4 dark:border-slate-700">
              <Button
                type="button"
                variant={post.liked_by_me ? "default" : "outline"}
                onClick={handleLike}
                disabled={isLiking}
                className={post.liked_by_me ? "bg-flare-500 hover:bg-flare-600" : ""}
              >
                <Heart
                  className={cn("size-4", post.liked_by_me && "fill-current")}
                  aria-hidden="true"
                />
                좋아요 {post.like_count}
              </Button>

              <div className="flex flex-wrap gap-2">
                {post.permissions.can_edit ? (
                  <Button asChild variant="outline">
                    <Link href={`/bugs/${post.id}/edit`}>
                      <Pencil className="size-4" aria-hidden="true" />
                      수정
                    </Link>
                  </Button>
                ) : null}
                {post.permissions.can_delete ? (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleDelete}
                    className="text-danger-critical hover:text-danger-critical"
                  >
                    <Trash2 className="size-4" aria-hidden="true" />
                    삭제
                  </Button>
                ) : null}
                {post.permissions.can_hide ? (
                  <Button type="button" variant="outline" onClick={handleHideToggle}>
                    <EyeOff className="size-4" aria-hidden="true" />
                    {post.is_hidden ? "가림 해제" : "가리기"}
                  </Button>
                ) : null}
              </div>
            </div>
          </CardContent>
        </Card>

        <CommentSection postId={postId} accessToken={accessToken} />
      </div>
    </section>
  );
}
