"use client";

import { ArrowLeft, KeyRound, LockKeyhole } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";

import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/atoms";
import { FormField } from "@/components/molecules";
import { useAuthStore } from "@/stores/authStore";

export function ChangePasswordForm() {
  const router = useRouter();
  const accessToken = useAuthStore((state) => state.accessToken);
  const user = useAuthStore((state) => state.user);
  const isHydrated = useAuthStore((state) => state.isHydrated);
  const fetchCurrentUser = useAuthStore((state) => state.fetchCurrentUser);
  const changePassword = useAuthStore((state) => state.changePassword);
  const [error, setError] = React.useState("");
  const [successMessage, setSuccessMessage] = React.useState("");
  const [isPending, startTransition] = React.useTransition();

  React.useEffect(() => {
    if (!isHydrated) {
      return;
    }

    if (!accessToken) {
      router.replace("/login");
      return;
    }

    if (!user) {
      fetchCurrentUser().catch(() => {
        router.replace("/login");
      });
    }
  }, [accessToken, fetchCurrentUser, isHydrated, router, user]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccessMessage("");

    const form = event.currentTarget;
    const formData = new FormData(form);
    const currentPassword = String(formData.get("currentPassword") ?? "");
    const newPassword = String(formData.get("newPassword") ?? "");
    const newPasswordConfirm = String(
      formData.get("newPasswordConfirm") ?? "",
    );

    if (newPassword !== newPasswordConfirm) {
      setError("새 비밀번호 확인이 일치하지 않습니다.");
      return;
    }

    if (newPassword.length < 8) {
      setError("새 비밀번호는 8자 이상 입력해주세요.");
      return;
    }

    startTransition(async () => {
      try {
        await changePassword({
          currentPassword,
          newPassword,
          newPasswordConfirm,
        });
        form.reset();
        setSuccessMessage("비밀번호가 변경되었습니다.");
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "비밀번호 변경에 실패했습니다.",
        );
      }
    });
  }

  if (!isHydrated || !user) {
    return (
      <section className="px-5 py-20 sm:px-8">
        <div className="mx-auto max-w-3xl text-center text-lg font-bold text-slate-500 dark:text-warm-300">
          사용자 정보를 불러오는 중입니다.
        </div>
      </section>
    );
  }

  return (
    <section className="px-5 py-16 sm:px-8">
      <div className="mx-auto max-w-2xl">
        <Button
          asChild
          variant="ghost"
          className="mb-6 h-11 rounded-lg px-3 text-base font-black text-slate-600 hover:text-slate-900 dark:text-warm-300 dark:hover:text-cream-50"
        >
          <Link href="/my-page">
            <ArrowLeft className="size-5" aria-hidden="true" />
            마이페이지
          </Link>
        </Button>

        <Card className="rounded-xl border-warm-200 bg-warm-50 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <CardHeader className="p-7 pb-3">
            <CardTitle className="flex items-center gap-3 text-2xl font-black text-slate-900 dark:text-cream-50">
              <LockKeyhole className="size-7 text-flare-600" />
              비밀번호 변경
            </CardTitle>
            <p className="pt-2 text-base font-semibold text-slate-500 dark:text-warm-300">
              현재 비밀번호를 확인한 뒤 새 비밀번호로 변경합니다.
            </p>
          </CardHeader>
          <CardContent className="p-7 pt-3">
            <form className="space-y-6" onSubmit={handleSubmit}>
              {successMessage ? (
                <p className="rounded-lg bg-process-resolved/10 px-4 py-3 text-sm font-bold text-process-resolved">
                  {successMessage}
                </p>
              ) : null}
              {error ? (
                <p className="rounded-lg bg-danger-critical/10 px-4 py-3 text-sm font-bold text-danger-critical">
                  {error}
                </p>
              ) : null}

              <FormField
                id="currentPassword"
                label="현재 비밀번호"
                type="password"
                placeholder="현재 비밀번호를 입력하세요"
                required
              />
              <FormField
                id="newPassword"
                label="새 비밀번호"
                type="password"
                placeholder="8자 이상 입력하세요"
                required
              />
              <FormField
                id="newPasswordConfirm"
                label="새 비밀번호 확인"
                type="password"
                placeholder="새 비밀번호를 다시 입력하세요"
                required
              />

              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={isPending}
                  className="h-12 rounded-lg bg-flare-500 px-7 text-base font-black hover:bg-flare-600"
                >
                  <KeyRound className="size-5" aria-hidden="true" />
                  {isPending ? "저장 중..." : "저장"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
