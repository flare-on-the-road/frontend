"use client";

import { useRouter } from "next/navigation";
import * as React from "react";

import { Button, Input, Textarea } from "@/components/atoms";
import { SectionHeader } from "@/components/molecules";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import {
  ApiRequestError,
  createPost,
  fetchPostDetail,
  updatePost,
} from "@/services/postsApi";
import { POST_CONTENT_MAX_LENGTH, POST_TITLE_MAX_LENGTH } from "@/types/board";

type InquiryPostFormProps = {
  mode: "create" | "edit";
  postId?: number;
};

export function InquiryPostForm({ mode, postId }: InquiryPostFormProps) {
  const router = useRouter();
  const { isReady, accessToken } = useRequireAuth();

  const [title, setTitle] = React.useState("");
  const [content, setContent] = React.useState("");
  const [fieldErrors, setFieldErrors] = React.useState<Record<string, string>>({});
  const [error, setError] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(mode === "edit");
  const [isPending, startTransition] = React.useTransition();

  React.useEffect(() => {
    if (!isReady || !accessToken || mode !== "edit" || !postId) return;

    let cancelled = false;

    fetchPostDetail(accessToken, postId)
      .then((post) => {
        if (cancelled) return;

        if (!post.permissions.can_edit) {
          setError("수정 권한이 없습니다.");
          return;
        }

        setTitle(post.title);
        setContent(post.content);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(
            err instanceof ApiRequestError ? err.message : "게시글을 불러오지 못했습니다.",
          );
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [isReady, accessToken, mode, postId]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!accessToken) return;

    setError("");
    setFieldErrors({});

    startTransition(async () => {
      try {
        if (mode === "create") {
          const result = await createPost(accessToken, {
            title,
            content,
            board_type: "inquiry",
          });
          router.push(`/inquiries/${result.id}`);
        } else if (postId) {
          await updatePost(accessToken, postId, { title, content });
          router.push(`/inquiries/${postId}`);
        }
      } catch (err) {
        if (err instanceof ApiRequestError && err.code === "VALIDATION_ERROR") {
          setFieldErrors(err.details ?? {});
          setError(err.message);
        } else {
          setError(err instanceof Error ? err.message : "처리 중 오류가 발생했습니다.");
        }
      }
    });
  }

  if (!isReady || isLoading) {
    return (
      <section className="px-5 py-10 sm:px-8">
        <div className="mx-auto max-w-3xl">
          <p className="text-center text-base font-bold text-slate-500 dark:text-warm-300">
            불러오는 중입니다...
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="px-5 py-10 sm:px-8">
      <div className="mx-auto max-w-3xl">
        <SectionHeader
          title={mode === "create" ? "1:1 문의하기" : "문의 수정"}
          description="작성한 문의는 본인과 관리자만 확인할 수 있습니다."
        />

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error ? (
            <p className="rounded-lg bg-danger-critical/10 px-4 py-3 text-sm font-bold text-danger-critical">
              {error}
            </p>
          ) : null}

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label
                className="text-base font-black text-slate-900 dark:text-cream-50"
                htmlFor="title"
              >
                제목
              </label>
              <span className="text-xs font-semibold text-slate-400 dark:text-warm-400">
                {title.length} / {POST_TITLE_MAX_LENGTH}
              </span>
            </div>
            <Input
              id="title"
              value={title}
              maxLength={POST_TITLE_MAX_LENGTH}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="제목을 입력하세요"
              className="h-12 rounded-lg border-warm-300 bg-cream-50 px-4 text-base font-semibold dark:border-slate-700 dark:bg-slate-900"
            />
            {fieldErrors.title ? (
              <p className="text-sm font-bold text-danger-critical">{fieldErrors.title}</p>
            ) : null}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label
                className="text-base font-black text-slate-900 dark:text-cream-50"
                htmlFor="content"
              >
                내용
              </label>
              <span className="text-xs font-semibold text-slate-400 dark:text-warm-400">
                {content.length} / {POST_CONTENT_MAX_LENGTH}
              </span>
            </div>
            <Textarea
              id="content"
              value={content}
              maxLength={POST_CONTENT_MAX_LENGTH}
              onChange={(event) => setContent(event.target.value)}
              placeholder="문의 내용을 입력하세요"
              className="min-h-64 rounded-lg border-warm-300 bg-cream-50 px-4 py-3 text-base font-medium dark:border-slate-700 dark:bg-slate-900"
            />
            {fieldErrors.content ? (
              <p className="text-sm font-bold text-danger-critical">{fieldErrors.content}</p>
            ) : null}
          </div>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              취소
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="bg-flare-500 font-bold hover:bg-flare-600"
            >
              {isPending ? "저장 중..." : mode === "create" ? "등록" : "수정 완료"}
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
}
