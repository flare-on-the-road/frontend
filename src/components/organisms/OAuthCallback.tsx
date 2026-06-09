"use client";

import { useRouter, useSearchParams } from "next/navigation";
import * as React from "react";

export function OAuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();

  React.useEffect(() => {
    const accessToken = searchParams.get("accessToken");
    const refreshToken = searchParams.get("refreshToken");

    if (!accessToken) {
      router.replace("/login?error=oauth_failed");
      return;
    }

    window.localStorage.setItem("accessToken", accessToken);

    if (refreshToken) {
      window.localStorage.setItem("refreshToken", refreshToken);
    }

    router.replace("/");
  }, [router, searchParams]);

  return (
    <p className="text-center text-lg font-bold text-slate-500 dark:text-warm-300">
      소셜 로그인 처리 중입니다.
    </p>
  );
}
