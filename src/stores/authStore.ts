"use client";

import { create } from "zustand";
import {
  createJSONStorage,
  persist,
  type StateStorage,
} from "zustand/middleware";

import { getCurrentUser } from "@/services/authApi";
import type { AuthResponse, AuthUser } from "@/types/auth";

type AuthStatus = "idle" | "authenticated" | "unauthenticated";

type AuthState = {
  accessToken: string | null;
  refreshToken: string | null;
  user: AuthUser | null;
  status: AuthStatus;
  isHydrated: boolean;
  setSession: (auth: AuthResponse) => void;
  setOAuthTokens: (tokens: {
    accessToken: string;
    refreshToken?: string | null;
  }) => void;
  fetchCurrentUser: () => Promise<AuthUser>;
  logout: () => void;
  setHydrated: (isHydrated: boolean) => void;
};

const AUTH_STORAGE_KEY = "flare-auth-session";
const LEGACY_ACCESS_TOKEN_KEY = "accessToken";
const LEGACY_REFRESH_TOKEN_KEY = "refreshToken";
const LEGACY_USER_KEY = "user";

const noopStorage: StateStorage = {
  getItem: () => null,
  setItem: () => undefined,
  removeItem: () => undefined,
};

function getAuthStorage() {
  if (typeof window === "undefined") {
    return noopStorage;
  }

  return {
    getItem: (name: string) => {
      const value = window.localStorage.getItem(name);

      if (value) {
        return value;
      }

      if (name !== AUTH_STORAGE_KEY) {
        return null;
      }

      return getLegacyAuthSession();
    },
    setItem: (name: string, value: string) => {
      window.localStorage.setItem(name, value);
      clearLegacyAuthSession();
    },
    removeItem: (name: string) => {
      window.localStorage.removeItem(name);
      clearLegacyAuthSession();
    },
  };
}

function getLegacyAuthSession() {
  const accessToken = window.localStorage.getItem(LEGACY_ACCESS_TOKEN_KEY);
  const refreshToken = window.localStorage.getItem(LEGACY_REFRESH_TOKEN_KEY);
  const rawUser = window.localStorage.getItem(LEGACY_USER_KEY);

  if (!accessToken || !rawUser) {
    return null;
  }

  try {
    const user = JSON.parse(rawUser) as AuthUser;

    return JSON.stringify({
      state: {
        accessToken,
        refreshToken: refreshToken ?? "",
        user,
        status: "authenticated",
      },
      version: 0,
    });
  } catch {
    clearLegacyAuthSession();
    return null;
  }
}

function clearLegacyAuthSession() {
  window.localStorage.removeItem(LEGACY_ACCESS_TOKEN_KEY);
  window.localStorage.removeItem(LEGACY_REFRESH_TOKEN_KEY);
  window.localStorage.removeItem(LEGACY_USER_KEY);
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      accessToken: null,
      refreshToken: null,
      user: null,
      status: "idle",
      isHydrated: false,
      setSession: (auth) => {
        set({
          accessToken: auth.accessToken,
          refreshToken: auth.refreshToken,
          user: auth.user,
          status: "authenticated",
        });
      },
      setOAuthTokens: ({ accessToken, refreshToken }) => {
        set({
          accessToken,
          refreshToken: refreshToken ?? "",
          status: "idle",
        });
      },
      fetchCurrentUser: async () => {
        const { accessToken } = get();

        if (!accessToken) {
          set({ status: "unauthenticated", user: null });
          throw new Error("로그인이 필요합니다.");
        }

        const user = await getCurrentUser(accessToken);
        set({ user, status: "authenticated" });
        return user;
      },
      logout: () => {
        set({
          accessToken: null,
          refreshToken: null,
          user: null,
          status: "unauthenticated",
        });
      },
      setHydrated: (isHydrated) => {
        set({ isHydrated });
      },
    }),
    {
      name: AUTH_STORAGE_KEY,
      storage: createJSONStorage(getAuthStorage),
      partialize: ({ accessToken, refreshToken, user, status }) => ({
        accessToken,
        refreshToken,
        user,
        status,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);

        if (state?.accessToken && state.user) {
          state.status = "authenticated";
          return;
        }

        state?.logout();
      },
    },
  ),
);
