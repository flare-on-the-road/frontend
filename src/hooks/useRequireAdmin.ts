"use client";

import { useRouter } from "next/navigation";
import * as React from "react";

import { useAuthStore } from "@/stores/authStore";

export function useRequireAdmin() {
  const router = useRouter();
  const isHydrated = useAuthStore((state) => state.isHydrated);
  const status = useAuthStore((state) => state.status);
  const accessToken = useAuthStore((state) => state.accessToken);
  const user = useAuthStore((state) => state.user);

  React.useEffect(() => {
    if (!isHydrated) return;

    if (status !== "authenticated") {
      router.replace("/login");
      return;
    }

  }, [isHydrated, status, user, router]);

  const canReadAdmin =
    user?.role === "admin" || user?.role === "admin_viewer";
  const canManageAdmin = user?.role === "admin";

  return {
    isReady:
      isHydrated &&
      status === "authenticated" &&
      Boolean(accessToken),
    canReadAdmin,
    canManageAdmin,
    accessToken,
    user,
  };
}
