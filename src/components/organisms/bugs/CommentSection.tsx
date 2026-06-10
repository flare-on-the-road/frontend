"use client";

import * as React from "react";

import { Card, CardContent } from "@/components/atoms";
import { ApiRequestError, fetchComments } from "@/services/bugsApi";
import type { CommentTreeResponse } from "@/types/bug";

import { CommentForm } from "./CommentForm";
import { CommentItem } from "./CommentItem";

type CommentSectionProps = {
  postId: number;
  accessToken: string;
};

export function CommentSection({ postId, accessToken }: CommentSectionProps) {
  const [data, setData] = React.useState<CommentTreeResponse | null>(null);
  const [error, setError] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(true);

  const load = React.useCallback(() => {
    fetchComments(accessToken, postId)
      .then((result) => {
        setData(result);
        setError("");
      })
      .catch((err) => {
        setError(
          err instanceof ApiRequestError ? err.message : "댓글을 불러오지 못했습니다.",
        );
      })
      .finally(() => setIsLoading(false));
  }, [accessToken, postId]);

  const loadedKeyRef = React.useRef<string | null>(null);

  React.useEffect(() => {
    const key = `${accessToken}:${postId}`;
    if (loadedKeyRef.current === key) return;
    loadedKeyRef.current = key;
    load();
  }, [load, accessToken, postId]);

  return (
    <Card className="rounded-xl border-warm-200 bg-warm-50 dark:border-slate-700 dark:bg-slate-800">
      <CardContent className="space-y-6 p-6 sm:p-8">
        <h2 className="text-xl font-black text-slate-900 dark:text-cream-50">
          댓글 {data?.total_count ?? 0}개
        </h2>

        <CommentForm accessToken={accessToken} postId={postId} onSubmitted={load} />

        {error ? (
          <p className="rounded-lg bg-danger-critical/10 px-4 py-3 text-sm font-bold text-danger-critical">
            {error}
          </p>
        ) : null}

        {isLoading ? (
          <p className="text-center text-sm font-bold text-slate-500 dark:text-warm-300">
            댓글을 불러오는 중입니다...
          </p>
        ) : data && data.comments.length > 0 ? (
          <div className="space-y-4">
            {data.comments.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                postId={postId}
                accessToken={accessToken}
                depth={0}
                onChanged={load}
              />
            ))}
          </div>
        ) : (
          <p className="rounded-lg border border-dashed border-warm-300 p-6 text-center text-sm font-bold text-slate-500 dark:border-slate-600 dark:text-warm-300">
            아직 댓글이 없습니다.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
