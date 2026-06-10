"use client";

import * as React from "react";

import { Button, Textarea } from "@/components/atoms";
import { cn } from "@/lib/utils";
import { ApiRequestError, createComment } from "@/services/bugsApi";
import { COMMENT_CONTENT_MAX_LENGTH } from "@/types/bug";

type CommentFormProps = {
  accessToken: string;
  postId: number;
  parentId?: number;
  onSubmitted: () => void;
  compact?: boolean;
};

export function CommentForm({
  accessToken,
  postId,
  parentId,
  onSubmitted,
  compact,
}: CommentFormProps) {
  const [content, setContent] = React.useState("");
  const [error, setError] = React.useState("");
  const [isPending, startTransition] = React.useTransition();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    startTransition(async () => {
      try {
        await createComment(accessToken, postId, {
          content,
          ...(parentId ? { parent_id: parentId } : {}),
        });
        setContent("");
        onSubmitted();
      } catch (err) {
        if (err instanceof ApiRequestError) {
          setError(err.details?.content ?? err.message);
        } else {
          setError("댓글 등록에 실패했습니다.");
        }
      }
    });
  }

  return (
    <form className={cn("space-y-2", compact && "mt-3")} onSubmit={handleSubmit}>
      <Textarea
        value={content}
        onChange={(event) => setContent(event.target.value)}
        maxLength={COMMENT_CONTENT_MAX_LENGTH}
        placeholder={parentId ? "답글을 입력하세요" : "댓글을 입력하세요"}
        className={cn(
          "rounded-lg border-warm-300 bg-cream-50 px-4 py-3 text-sm font-medium dark:border-slate-700 dark:bg-slate-900",
          compact ? "min-h-16" : "min-h-20",
        )}
      />
      {error ? (
        <p className="text-xs font-bold text-danger-critical">{error}</p>
      ) : null}
      <div className="flex justify-end">
        <Button
          type="submit"
          size="sm"
          disabled={isPending || !content.trim()}
          className="bg-flare-500 font-bold hover:bg-flare-600"
        >
          {isPending ? "등록 중..." : parentId ? "답글 등록" : "댓글 등록"}
        </Button>
      </div>
    </form>
  );
}
