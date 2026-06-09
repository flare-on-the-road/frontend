"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";

import { Button } from "@/components/atoms";
import { FormField } from "@/components/molecules";
import { register, saveAuthSession } from "@/services/authApi";

export function RegisterForm() {
  const router = useRouter();
  const [error, setError] = React.useState("");
  const [isPending, startTransition] = React.useTransition();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const formData = new FormData(event.currentTarget);
    const password = String(formData.get("password") ?? "");
    const passwordConfirm = String(formData.get("passwordConfirm") ?? "");

    if (password !== passwordConfirm) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    startTransition(async () => {
      try {
        const auth = await register({
          email: String(formData.get("email") ?? ""),
          name: String(formData.get("name") ?? ""),
          password,
          department: String(formData.get("department") ?? ""),
          phone: String(formData.get("phone") ?? ""),
        });
        saveAuthSession(auth);
        router.push("/");
      } catch (err) {
        setError(err instanceof Error ? err.message : "회원가입에 실패했습니다.");
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
      <FormField id="phone" label="전화번호" placeholder="010-1234-5678" />
      <FormField id="department" label="부서" placeholder="관제팀" />
      <FormField id="password" label="비밀번호" type="password" placeholder="비밀번호를 입력하세요" required />
      <FormField id="passwordConfirm" label="비밀번호 확인" type="password" placeholder="비밀번호를 다시 입력하세요" required />

      <Button
        type="submit"
        disabled={isPending}
        className="h-14 w-full rounded-lg bg-flare-500 text-lg font-black hover:bg-flare-600"
      >
        {isPending ? "가입 중..." : "회원가입"}
      </Button>
      <p className="text-center text-base font-semibold text-slate-500 dark:text-warm-300">
        이미 계정이 있으신가요?{" "}
        <Link className="font-black text-flare-600" href="/login">
          로그인
        </Link>
      </p>
    </form>
  );
}
