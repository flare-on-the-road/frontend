"use client";

import { Paperclip, X } from "lucide-react";
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
} from "@/services/bugsApi";
import {
  ALLOWED_ATTACHMENT_TYPES,
  MAX_ATTACHMENTS,
  MAX_ATTACHMENT_BYTES,
  POST_CONTENT_MAX_LENGTH,
  POST_TITLE_MAX_LENGTH,
  type Attachment,
} from "@/types/bug";

type BugPostFormProps = {
  mode: "create" | "edit";
  postId?: number;
};

export function BugPostForm({ mode, postId }: BugPostFormProps) {
  const router = useRouter();
  const { isReady, accessToken } = useRequireAuth();

  const [title, setTitle] = React.useState("");
  const [content, setContent] = React.useState("");
  const [fieldErrors, setFieldErrors] = React.useState<Record<string, string>>({});
  const [error, setError] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(mode === "edit");
  const [isPending, startTransition] = React.useTransition();

  const [existingAttachments, setExistingAttachments] = React.useState<Attachment[]>([]);
  const [removedFileIds, setRemovedFileIds] = React.useState<number[]>([]);
  const [newFiles, setNewFiles] = React.useState<File[]>([]);
  const [attachmentError, setAttachmentError] = React.useState("");
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (!isReady || !accessToken || mode !== "edit" || !postId) return;

    fetchPostDetail(accessToken, postId)
      .then((post) => {
        if (!post.permissions.can_edit) {
          setError("수정 권한이 없습니다.");
          return;
        }

        setTitle(post.title);
        setContent(post.content);
        setExistingAttachments(post.attachments);
      })
      .catch((err) => {
        setError(
          err instanceof ApiRequestError ? err.message : "게시글을 불러오지 못했습니다.",
        );
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [isReady, accessToken, mode, postId]);

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(event.target.files ?? []);
    event.target.value = "";
    if (selected.length === 0) return;

    setAttachmentError("");

    const remainingExisting = existingAttachments.length - removedFileIds.length;
    const currentCount = remainingExisting + newFiles.length;

    if (currentCount + selected.length > MAX_ATTACHMENTS) {
      setAttachmentError(`첨부파일은 최대 ${MAX_ATTACHMENTS}개까지 등록할 수 있습니다.`);
      return;
    }

    for (const file of selected) {
      if (!ALLOWED_ATTACHMENT_TYPES.includes(file.type)) {
        setAttachmentError("이미지 파일(jpg, png, gif, webp)만 첨부할 수 있습니다.");
        return;
      }
      if (file.size > MAX_ATTACHMENT_BYTES) {
        setAttachmentError("업로드 가능한 파일 크기를 초과했습니다. (최대 10MB)");
        return;
      }
    }

    setNewFiles((prev) => [...prev, ...selected]);
  }

  function handleRemoveExisting(id: number) {
    setExistingAttachments((prev) => prev.filter((attachment) => attachment.id !== id));
    setRemovedFileIds((prev) => [...prev, id]);
    setAttachmentError("");
  }

  function handleRemoveNewFile(index: number) {
    setNewFiles((prev) => prev.filter((_, i) => i !== index));
    setAttachmentError("");
  }

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
            attachments: newFiles,
          });
          router.push(`/bugs/${result.id}`);
        } else if (postId) {
          await updatePost(accessToken, postId, {
            title,
            content,
            attachments: newFiles,
            removedFileIds,
          });
          router.push(`/bugs/${postId}`);
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
          title={mode === "create" ? "버그 제보하기" : "게시글 수정"}
          description="재현 경로와 증상을 자세히 작성해주세요."
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
              placeholder="재현 경로, 증상, 환경 정보를 입력하세요"
              className="min-h-64 rounded-lg border-warm-300 bg-cream-50 px-4 py-3 text-base font-medium dark:border-slate-700 dark:bg-slate-900"
            />
            {fieldErrors.content ? (
              <p className="text-sm font-bold text-danger-critical">{fieldErrors.content}</p>
            ) : null}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-base font-black text-slate-900 dark:text-cream-50">
                첨부파일
              </span>
              <span className="text-xs font-semibold text-slate-400 dark:text-warm-400">
                {existingAttachments.length + newFiles.length} / {MAX_ATTACHMENTS}
              </span>
            </div>

            {existingAttachments.length + newFiles.length > 0 ? (
              <ul className="space-y-2">
                {existingAttachments.map((attachment) => (
                  <li
                    key={`existing-${attachment.id}`}
                    className="flex items-center justify-between gap-2 rounded-lg border border-warm-300 bg-cream-50 px-4 py-2 text-sm font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-warm-200"
                  >
                    <span className="truncate">{attachment.original_filename}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveExisting(attachment.id)}
                      className="shrink-0 text-slate-400 hover:text-danger-critical"
                      aria-label="첨부파일 삭제"
                    >
                      <X className="size-4" aria-hidden="true" />
                    </button>
                  </li>
                ))}
                {newFiles.map((file, index) => (
                  <li
                    key={`new-${file.name}-${index}`}
                    className="flex items-center justify-between gap-2 rounded-lg border border-warm-300 bg-cream-50 px-4 py-2 text-sm font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-warm-200"
                  >
                    <span className="truncate">{file.name}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveNewFile(index)}
                      className="shrink-0 text-slate-400 hover:text-danger-critical"
                      aria-label="첨부파일 삭제"
                    >
                      <X className="size-4" aria-hidden="true" />
                    </button>
                  </li>
                ))}
              </ul>
            ) : null}

            {existingAttachments.length + newFiles.length < MAX_ATTACHMENTS ? (
              <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
                <Paperclip className="size-4" aria-hidden="true" />
                이미지 첨부
              </Button>
            ) : null}
            <input
              ref={fileInputRef}
              type="file"
              accept={ALLOWED_ATTACHMENT_TYPES.join(",")}
              multiple
              className="sr-only"
              onChange={handleFileChange}
            />

            <p className="text-xs font-semibold text-slate-400 dark:text-warm-400">
              이미지 파일(jpg, png, gif, webp), 최대 {MAX_ATTACHMENTS}개, 파일당 10MB 이하
            </p>
            {attachmentError ? (
              <p className="text-sm font-bold text-danger-critical">{attachmentError}</p>
            ) : null}
            {fieldErrors.attachments ? (
              <p className="text-sm font-bold text-danger-critical">{fieldErrors.attachments}</p>
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
