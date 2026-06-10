"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import * as React from "react";

import { Button } from "@/components/atoms";
import { FormField } from "@/components/molecules";
import { SocialLoginButtons } from "@/components/organisms/SocialLoginButtons";
import { login } from "@/services/authApi";
import { useAuthStore } from "@/stores/authStore";

const SAVED_EMAIL_KEY = "savedLoginEmail";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setSession = useAuthStore((state) => state.setSession);
  const [error, setError] = React.useState("");
  const [isPending, startTransition] = React.useTransition();
  const savedEmail =
    typeof window !== "undefined"
      ? window.localStorage.getItem(SAVED_EMAIL_KEY) ?? ""
      : "";
  const oauthErrorMessage = getOAuthErrorMessage(searchParams);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");
    const rememberEmail = formData.get("rememberEmail") === "on";

    startTransition(async () => {
      try {
        const auth = await login({ email, password });
        setSession(auth);

        if (rememberEmail) {
          window.localStorage.setItem(SAVED_EMAIL_KEY, email);
        } else {
          window.localStorage.removeItem(SAVED_EMAIL_KEY);
        }

        router.push("/");
      } catch (err) {
        setError(err instanceof Error ? err.message : "로그인에 실패했습니다.");
      }
    });
  }

  return (
    <form className="space-y-7" onSubmit={handleSubmit}>
      {oauthErrorMessage ? (
        <p className="rounded-lg bg-danger-critical/10 px-4 py-3 text-sm font-bold text-danger-critical">
          {oauthErrorMessage}
        </p>
      ) : null}
      {error ? (
        <p className="rounded-lg bg-danger-critical/10 px-4 py-3 text-sm font-bold text-danger-critical">
          {error}
        </p>
      ) : null}

      <FormField
        id="email"
        label="아이디"
        type="email"
        placeholder="아이디를 입력하세요"
        required
        defaultValue={savedEmail}
      />
      <FormField
        id="password"
        label="비밀번호"
        type="password"
        placeholder="비밀번호를 입력하세요"
        required
      />

      <div className="flex flex-wrap items-center justify-between gap-4 text-base font-bold text-slate-500 dark:text-warm-300">
        <label className="flex items-center gap-3 text-slate-900 dark:text-cream-50">
          <input
            name="rememberEmail"
            type="checkbox"
            defaultChecked={Boolean(savedEmail)}
            className="size-5 rounded border-warm-300 accent-flare-500"
          />
          아이디 저장
        </label>
        <div className="flex gap-2">
          <Link href="/find-id">아이디 찾기</Link>
          <span>·</span>
          <Link href="/forgot-password">비밀번호 찾기</Link>
        </div>
      </div>

      <Button
        type="submit"
        disabled={isPending}
        className="h-16 w-full rounded-lg bg-flare-500 text-xl font-black hover:bg-flare-600"
      >
        {isPending ? "로그인 중..." : "로그인"}
      </Button>

      <SocialLoginButtons />

      <p className="text-center text-lg font-semibold text-slate-500 dark:text-warm-300">
        계정이 없으신가요?{" "}
        <Link className="font-black text-flare-600" href="/register">
          회원가입
        </Link>
      </p>
    </form>
  );
}

function getOAuthErrorMessage(searchParams: URLSearchParams) {
  if (!searchParams.get("error")) {
    return "";
  }

  const provider = searchParams.get("provider");
  const reason = searchParams.get("reason");
  const providerLabel =
    provider === "kakao"
      ? "카카오"
      : provider === "naver"
        ? "네이버"
        : provider === "google"
          ? "구글"
          : "소셜";

  if (reason) {
    return `${providerLabel} 로그인 처리 중 문제가 발생했습니다. (${reason})`;
  }

  return `${providerLabel} 로그인 처리 중 문제가 발생했습니다.`;
}
