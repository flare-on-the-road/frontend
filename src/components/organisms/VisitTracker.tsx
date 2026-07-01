"use client";

import * as React from "react";

import { recordVisit } from "@/services/visitsApi";
import { useAuthStore } from "@/stores/authStore";

const VISITOR_KEY_STORAGE = "flare-visitor-key";
const LAST_VISIT_DATE_STORAGE = "flare-last-visit-date";

export function VisitTracker() {
  const accessToken = useAuthStore((state) => state.accessToken);

  React.useEffect(() => {
    if (typeof window === "undefined") return;

    const today = new Date().toISOString().slice(0, 10);
    const lastVisitDate = window.localStorage.getItem(LAST_VISIT_DATE_STORAGE);
    if (lastVisitDate === today) return;

    const visitorKey = getOrCreateVisitorKey();
    window.localStorage.setItem(LAST_VISIT_DATE_STORAGE, today);

    void recordVisit({
      visitorKey,
      path: `${window.location.pathname}${window.location.search}`,
      accessToken,
    }).catch(() => {
      window.localStorage.removeItem(LAST_VISIT_DATE_STORAGE);
    });
  }, [accessToken]);

  return null;
}

function getOrCreateVisitorKey() {
  const existing = window.localStorage.getItem(VISITOR_KEY_STORAGE);
  if (existing) return existing;

  const generated =
    window.crypto?.randomUUID?.() ??
    `visitor-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  window.localStorage.setItem(VISITOR_KEY_STORAGE, generated);
  return generated;
}
