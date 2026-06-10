"use client";

import { useRouter } from "next/navigation";
import * as React from "react";

import { useAuthStore } from "@/stores/authStore";

export function useRequireAuth() {
  const router = useRouter();
  const isHydrated = useAuthStore((state) => state.isHydrated);
  const status = useAuthStore((state) => state.status);
  const accessToken = useAuthStore((state) => state.accessToken);
  const user = useAuthStore((state) => state.user);

  React.useEffect(() => {
    if (isHydrated && status !== "authenticated") {
      router.replace("/login");
    }
  }, [isHydrated, status, router]);

  return {
    isReady: isHydrated && status === "authenticated" && Boolean(accessToken),
    accessToken,
    user,
  };
}
