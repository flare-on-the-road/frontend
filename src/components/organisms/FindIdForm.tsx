"use client";

import Link from "next/link";
import * as React from "react";

import { Button } from "@/components/atoms";
import { FormField } from "@/components/molecules";
import { findId } from "@/services/authApi";

type FoundAccount = {
  email: string;
  provider: string;
  createdAt?: string | null;
};

export function FindIdForm() {
  const [accounts, setAccounts] = React.useState<FoundAccount[] | null>(null);
  const [error, setError] = React.useState("");
  const [isPending, startTransition] = React.useTransition();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setAccounts(null);

    const formData = new FormData(event.currentTarget);

    startTransition(async () => {
      try {
        const result = await findId({
          name: String(formData.get("name") ?? ""),
          phone: String(formData.get("phone") ?? ""),
        });
        setAccounts(result.accounts);
      } catch (err) {
        setError(err instanceof Error ? err.message : "아이디 찾기에 실패했습니다.");
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
      <FormField id="name" label="이름" placeholder="이름을 입력하세요" required />
      <FormField id="phone" label="전화번호" placeholder="010-1234-5678" required />
      <Button
        type="submit"
        disabled={isPending}
        className="h-14 w-full rounded-lg bg-flare-500 text-lg font-black hover:bg-flare-600"
      >
        {isPending ? "조회 중..." : "아이디 찾기"}
      </Button>

      {accounts ? (
        <div className="rounded-lg border border-warm-200 bg-cream-50 p-5 dark:border-slate-700 dark:bg-slate-900">
          <h3 className="font-black text-slate-900 dark:text-cream-50">
            조회 결과
          </h3>
          {accounts.length > 0 ? (
            <div className="mt-4 space-y-3">
              {accounts.map((account) => (
                <p key={`${account.provider}-${account.email}`} className="font-semibold text-slate-600 dark:text-warm-300">
                  {account.email} · {account.provider}
                </p>
              ))}
            </div>
          ) : (
            <p className="mt-4 font-semibold text-slate-600 dark:text-warm-300">
              일치하는 계정이 없습니다.
            </p>
          )}
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
