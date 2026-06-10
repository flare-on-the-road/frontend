"use client";

import { useRouter, useSearchParams } from "next/navigation";
import * as React from "react";

import { useAuthStore } from "@/stores/authStore";

export function OAuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setOAuthTokens = useAuthStore((state) => state.setOAuthTokens);
  const fetchCurrentUser = useAuthStore((state) => state.fetchCurrentUser);

  React.useEffect(() => {
    const accessToken = searchParams.get("accessToken");
    const refreshToken = searchParams.get("refreshToken");

    if (!accessToken) {
      router.replace("/login?error=oauth_failed");
      return;
    }

    const confirmedAccessToken = accessToken;
    const confirmedRefreshToken = refreshToken ?? "";

    async function finishSocialLogin() {
      setOAuthTokens({
        accessToken: confirmedAccessToken,
        refreshToken: confirmedRefreshToken,
      });
      await fetchCurrentUser();
      router.replace("/");
    }

    finishSocialLogin().catch(() => {
      router.replace("/login?error=oauth_failed");
    });
  }, [fetchCurrentUser, router, searchParams, setOAuthTokens]);

  return (
    <p className="text-center text-lg font-bold text-slate-500 dark:text-warm-300">
      소셜 로그인 처리 중입니다.
    </p>
  );
}
