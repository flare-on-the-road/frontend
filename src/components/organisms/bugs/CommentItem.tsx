"use client";

import { Reply } from "lucide-react";
import * as React from "react";

import { Badge, Button, Textarea } from "@/components/atoms";
import { formatDateTime } from "@/lib/format";
import { cn } from "@/lib/utils";
import {
  ApiRequestError,
  deleteComment,
  hideComment,
  unhideComment,
  updateComment,
} from "@/services/bugsApi";
import { COMMENT_CONTENT_MAX_LENGTH, type CommentNode } from "@/types/bug";

import { CommentForm } from "./CommentForm";

type CommentItemProps = {
  comment: CommentNode;
  postId: number;
  accessToken: string;
  depth: number;
  onChanged: () => void;
};

export function CommentItem({
  comment,
  postId,
  accessToken,
  depth,
  onChanged,
}: CommentItemProps) {
  const [isReplying, setIsReplying] = React.useState(false);
  const [isEditing, setIsEditing] = React.useState(false);
  const [error, setError] = React.useState("");

  async function handleDelete() {
    if (!window.confirm("댓글을 삭제하시겠습니까?")) return;

    try {
      await deleteComment(accessToken, comment.id);
      onChanged();
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : "삭제에 실패했습니다.");
    }
  }

  async function handleHideToggle() {
    try {
      if (comment.is_hidden) {
        await unhideComment(accessToken, comment.id);
      } else {
        await hideComment(accessToken, comment.id);
      }
      onChanged();
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : "처리에 실패했습니다.");
    }
  }

  const canReply = depth === 0 && !comment.is_deleted && !comment.is_hidden;

  return (
    <div
      className={cn(
        depth > 0 &&
          "ml-6 border-l-2 border-warm-200 pl-4 dark:border-slate-700 sm:ml-10",
      )}
    >
      <div className="space-y-2 rounded-lg bg-cream-50 p-4 dark:bg-slate-900">
        <div className="flex flex-wrap items-center gap-2 text-sm font-bold text-slate-900 dark:text-cream-50">
          <span>{comment.author_nickname ?? "알 수 없음"}</span>
          <span className="text-xs font-semibold text-slate-400 dark:text-warm-400">
            {formatDateTime(comment.created_at)}
          </span>
          {comment.is_hidden ? (
            <Badge variant="destructive">관리자 가림</Badge>
          ) : null}
          {comment.is_deleted ? <Badge variant="outline">삭제됨</Badge> : null}
        </div>

        {isEditing ? (
          <CommentEditForm
            accessToken={accessToken}
            commentId={comment.id}
            initialContent={comment.content}
            onCancel={() => setIsEditing(false)}
            onSaved={() => {
              setIsEditing(false);
              onChanged();
            }}
          />
        ) : (
          <p className="whitespace-pre-wrap break-words text-sm font-medium leading-6 text-slate-700 dark:text-warm-200">
            {comment.content}
          </p>
        )}

        {error ? (
          <p className="text-xs font-bold text-danger-critical">{error}</p>
        ) : null}

        <div className="flex flex-wrap gap-3 text-xs font-bold text-slate-500 dark:text-warm-300">
          {canReply ? (
            <button
              type="button"
              className="inline-flex items-center gap-1 hover:text-flare-600"
              onClick={() => setIsReplying((value) => !value)}
            >
              <Reply className="size-3.5" aria-hidden="true" />
              답글
            </button>
          ) : null}
          {comment.permissions.can_edit ? (
            <button
              type="button"
              className="hover:text-flare-600"
              onClick={() => setIsEditing((value) => !value)}
            >
              수정
            </button>
          ) : null}
          {comment.permissions.can_delete ? (
            <button
              type="button"
              className="hover:text-danger-critical"
              onClick={handleDelete}
            >
              삭제
            </button>
          ) : null}
          {comment.permissions.can_hide ? (
            <button
              type="button"
              className="hover:text-flare-600"
              onClick={handleHideToggle}
            >
              {comment.is_hidden ? "가림 해제" : "가리기"}
            </button>
          ) : null}
        </div>

        {isReplying ? (
          <CommentForm
            accessToken={accessToken}
            postId={postId}
            parentId={comment.id}
            compact
            onSubmitted={() => {
              setIsReplying(false);
              onChanged();
            }}
          />
        ) : null}
      </div>

      {comment.replies.length > 0 ? (
        <div className="mt-3 space-y-3">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              postId={postId}
              accessToken={accessToken}
              depth={depth + 1}
              onChanged={onChanged}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}

type CommentEditFormProps = {
  accessToken: string;
  commentId: number;
  initialContent: string;
  onCancel: () => void;
  onSaved: () => void;
};

function CommentEditForm({
  accessToken,
  commentId,
  initialContent,
  onCancel,
  onSaved,
}: CommentEditFormProps) {
  const [content, setContent] = React.useState(initialContent);
  const [error, setError] = React.useState("");
  const [isPending, startTransition] = React.useTransition();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    startTransition(async () => {
      try {
        await updateComment(accessToken, commentId, { content });
        onSaved();
      } catch (err) {
        if (err instanceof ApiRequestError) {
          setError(err.details?.content ?? err.message);
        } else {
          setError("댓글 수정에 실패했습니다.");
        }
      }
    });
  }

  return (
    <form className="space-y-2" onSubmit={handleSubmit}>
      <Textarea
        value={content}
        onChange={(event) => setContent(event.target.value)}
        maxLength={COMMENT_CONTENT_MAX_LENGTH}
        className="min-h-20 rounded-lg border-warm-300 bg-cream-50 px-4 py-3 text-sm font-medium dark:border-slate-700 dark:bg-slate-800"
      />
      {error ? (
        <p className="text-xs font-bold text-danger-critical">{error}</p>
      ) : null}
      <div className="flex justify-end gap-2">
        <Button type="button" size="sm" variant="outline" onClick={onCancel}>
          취소
        </Button>
        <Button
          type="submit"
          size="sm"
          disabled={isPending || !content.trim()}
          className="bg-flare-500 font-bold hover:bg-flare-600"
        >
          {isPending ? "저장 중..." : "저장"}
        </Button>
      </div>
    </form>
  );
}
