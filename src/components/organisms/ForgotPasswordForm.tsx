"use client";

import Link from "next/link";
import * as React from "react";

import { Button } from "@/components/atoms";
import { FormField } from "@/components/molecules";
import { forgotPassword } from "@/services/authApi";

export function ForgotPasswordForm() {
  const [temporaryPassword, setTemporaryPassword] = React.useState("");
  const [error, setError] = React.useState("");
  const [isPending, startTransition] = React.useTransition();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setTemporaryPassword("");

    const formData = new FormData(event.currentTarget);

    startTransition(async () => {
      try {
        const result = await forgotPassword({
          email: String(formData.get("email") ?? ""),
          name: String(formData.get("name") ?? ""),
          phone: String(formData.get("phone") ?? ""),
        });
        setTemporaryPassword(result.temporaryPassword);
      } catch (err) {
        setError(err instanceof Error ? err.message : "비밀번호 찾기에 실패했습니다.");
      }
    });
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      {error ? (
        <p className="rounded-lg bg-danger-critical/10 px-4 py-3 text-sm font-bold text-danger-critical">
          {error}
        </p>
      ) : null}
      <FormField id="email" label="아이디" type="email" placeholder="이메일을 입력하세요" required />
      <FormField id="name" label="이름" placeholder="이름을 입력하세요" required />
      <FormField id="phone" label="전화번호" placeholder="010-1234-5678" required />
      <Button
        type="submit"
        disabled={isPending}
        className="h-14 w-full rounded-lg bg-flare-500 text-lg font-black hover:bg-flare-600"
      >
        {isPending ? "처리 중..." : "임시 비밀번호 발급"}
      </Button>

      {temporaryPassword ? (
        <div className="rounded-lg border border-flare-400 bg-cream-100 p-5 dark:bg-slate-900">
          <h3 className="font-black text-slate-900 dark:text-cream-50">
            임시 비밀번호
          </h3>
          <p className="mt-3 rounded-md bg-cream-50 px-4 py-3 font-mono text-lg font-black text-flare-600 dark:bg-slate-800">
            {temporaryPassword}
          </p>
        </div>
      ) : null}

      <p className="text-center text-base font-semibold text-slate-500 dark:text-warm-300">
        <Link className="font-black text-flare-600" href="/login">
          로그인으로 돌아가기
        </Link>
      </p>
    </form>
  );
}
