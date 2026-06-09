"use client";

import { Moon, Sun } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/atoms/Button";

export function ThemeToggle() {
  React.useEffect(() => {
    const storedTheme = window.localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const shouldUseDark = storedTheme ? storedTheme === "dark" : prefersDark;

    document.documentElement.classList.toggle("dark", shouldUseDark);
  }, []);

  function handleClick() {
    const nextIsDark = !document.documentElement.classList.contains("dark");

    document.documentElement.classList.toggle("dark", nextIsDark);
    window.localStorage.setItem("theme", nextIsDark ? "dark" : "light");
  }

  return (
    <Button
      variant="outline"
      size="icon"
      className="size-11 rounded-full border-flare-500 bg-transparent text-flare-600 hover:bg-flare-500 hover:text-cream-50 dark:border-flare-400 dark:text-flare-400 dark:hover:bg-flare-500 dark:hover:text-slate-900"
      aria-label="테마 변경"
      onClick={handleClick}
    >
      <Moon className="size-5 dark:hidden" aria-hidden="true" />
      <Sun className="hidden size-5 dark:block" aria-hidden="true" />
    </Button>
  );
}
