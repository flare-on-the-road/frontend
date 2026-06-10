"use client";

import { create } from "zustand";
import {
  createJSONStorage,
  persist,
  type StateStorage,
} from "zustand/middleware";

import {
  getCurrentUser,
  refreshAccessToken,
  updateCurrentUserProfile,
  updateCurrentUserProfileImage,
} from "@/services/authApi";
import type {
  AuthResponse,
  AuthUser,
  UpdateProfilePayload,
} from "@/types/auth";

type AuthStatus = "idle" | "authenticated" | "unauthenticated";

type AuthState = {
  accessToken: string | null;
  refreshToken: string | null;
  user: AuthUser | null;
  profileImagePreviewUrl: string | null;
  status: AuthStatus;
  isHydrated: boolean;
  setSession: (auth: AuthResponse) => void;
  setOAuthTokens: (tokens: {
    accessToken: string;
    refreshToken?: string | null;
  }) => void;
  fetchCurrentUser: () => Promise<AuthUser>;
  updateProfile: (payload: UpdateProfilePayload) => Promise<AuthUser>;
  updateProfileImage: (profileImage: File) => Promise<AuthUser>;
  setProfileImagePreviewUrl: (imageUrl: string | null) => void;
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
      profileImagePreviewUrl: null,
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
        const user = await runWithFreshAccessToken(get, set, getCurrentUser);
        set({ user, status: "authenticated" });
        return user;
      },
      updateProfile: async (payload) => {
        const user = await runWithFreshAccessToken(get, set, (accessToken) =>
          updateCurrentUserProfile(accessToken, payload),
        );
        set({ user, status: "authenticated" });
        return user;
      },
      updateProfileImage: async (profileImage) => {
        const user = await runWithFreshAccessToken(get, set, (accessToken) =>
          updateCurrentUserProfileImage(accessToken, profileImage),
        );
        set({ profileImagePreviewUrl: null, user, status: "authenticated" });
        return user;
      },
      setProfileImagePreviewUrl: (imageUrl) => {
        set({ profileImagePreviewUrl: imageUrl });
      },
      logout: () => {
        set({
          accessToken: null,
          refreshToken: null,
          user: null,
          profileImagePreviewUrl: null,
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

async function runWithFreshAccessToken<T>(
  get: () => AuthState,
  set: (
    partial:
      | Partial<AuthState>
      | ((state: AuthState) => Partial<AuthState>),
  ) => void,
  request: (accessToken: string) => Promise<T>,
) {
  const { accessToken } = get();

  if (!accessToken) {
    set({ status: "unauthenticated", user: null });
    throw new Error("로그인이 필요합니다.");
  }

  try {
    return await request(accessToken);
  } catch (error) {
    if (!isTokenExpiredError(error)) {
      throw error;
    }

    const { refreshToken } = get();

    if (!refreshToken) {
      set({
        accessToken: null,
        refreshToken: null,
        user: null,
        profileImagePreviewUrl: null,
        status: "unauthenticated",
      });
      throw new Error("로그인이 만료되었습니다. 다시 로그인해주세요.");
    }

    try {
      const refreshed = await refreshAccessToken(refreshToken);
      set({ accessToken: refreshed.accessToken, status: "authenticated" });
      return await request(refreshed.accessToken);
    } catch {
      set({
        accessToken: null,
        refreshToken: null,
        user: null,
        profileImagePreviewUrl: null,
        status: "unauthenticated",
      });
      throw new Error("로그인이 만료되었습니다. 다시 로그인해주세요.");
    }
  }
}

function isTokenExpiredError(error: unknown) {
  if (!(error instanceof Error)) {
    return false;
  }

  return error.message.toLowerCase().includes("token has expired");
}
