"use client";

import { ClipboardList, Info, LogOut, UserCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button, Logo, ThemeToggle } from "@/components/atoms";
import { useAuthStore } from "@/stores/authStore";

const flareMenuItems = [
  { label: "프로젝트 개요", href: "/overview" },
  { label: "개발 정보", href: "/development" },
];

const boardMenuItems = [
  { label: "공지사항", href: "#notice" },
  { label: "자주 묻는 질문", href: "#faq" },
  { label: "1:1 문의", href: "#contact" },
  { label: "버그 게시판", href: "#bugs" },
  { label: "자료 게시판", href: "#resources" },
];

export function Header() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  function handleLogout() {
    logout();
    router.push("/");
  }

  return (
    <header className="group/header sticky top-0 z-20 border-b border-warm-200 bg-cream-50/95 backdrop-blur dark:border-slate-700 dark:bg-slate-900/95">
      <div className="mx-auto flex h-[76px] max-w-[1440px] items-center justify-between px-5 sm:px-8 lg:px-12">
        <Logo />

        <nav
          className="hidden items-center gap-14 text-sm font-black text-slate-900 dark:text-cream-100 md:flex"
          aria-label="Primary navigation"
        >
          <Link
            className="flex h-[76px] items-center gap-3 transition-colors hover:text-flare-600 focus-visible:text-flare-600 focus-visible:outline-none dark:hover:text-flare-400"
            href="/#about"
          >
            <Info className="size-6" aria-hidden="true" />
            Flare
          </Link>
          <Link
            className="flex h-[76px] items-center gap-3 transition-colors hover:text-flare-600 focus-visible:text-flare-600 focus-visible:outline-none dark:hover:text-flare-400"
            href="/#process"
          >
            <ClipboardList className="size-6" aria-hidden="true" />
            게시판
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex min-w-0 items-center gap-2 rounded-full border border-warm-200 bg-cream-100 px-2.5 py-2 shadow-sm dark:border-slate-700 dark:bg-slate-800">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-flare-500 text-sm font-black text-cream-50">
                {getInitial(user.name)}
              </div>
              <div className="hidden min-w-0 leading-tight sm:block">
                <div className="flex items-center gap-2">
                  <span className="max-w-28 truncate text-sm font-black text-slate-900 dark:text-cream-50 lg:max-w-36">
                    {user.name}
                  </span>
                  <span className="rounded-full bg-process-resolved/15 px-2 py-0.5 text-[11px] font-black text-process-resolved">
                    로그인됨
                  </span>
                </div>
                <p className="max-w-44 truncate text-xs font-semibold text-slate-500 dark:text-warm-300">
                  {user.email}
                </p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="size-9 rounded-full text-slate-600 hover:bg-warm-100 hover:text-flare-600 dark:text-warm-200 dark:hover:bg-slate-700"
                aria-label="로그아웃"
                title="로그아웃"
                onClick={handleLogout}
              >
                <LogOut className="size-5" aria-hidden="true" />
              </Button>
            </div>
          ) : (
            <Button
              asChild
              variant="outline"
              className="h-11 rounded-full border-flare-500 bg-transparent px-6 font-bold text-flare-600 hover:bg-flare-500 hover:text-cream-50 dark:border-flare-400 dark:text-flare-400 dark:hover:bg-flare-500 dark:hover:text-slate-900"
            >
              <Link href="/login">
                <UserCircle className="size-5" aria-hidden="true" />
                로그인
              </Link>
            </Button>
          )}
          <ThemeToggle />
        </div>
      </div>

      <div className="hidden border-t border-warm-200 bg-warm-50/98 shadow-sm transition-[max-height,opacity] duration-200 group-focus-within/header:block group-hover/header:block dark:border-slate-700 dark:bg-slate-800/98 md:block md:max-h-0 md:overflow-hidden md:opacity-0 md:group-focus-within/header:max-h-96 md:group-focus-within/header:opacity-100 md:group-hover/header:max-h-96 md:group-hover/header:opacity-100">
        <div className="mx-auto grid max-w-[560px] grid-cols-2 gap-12 px-8 py-7 text-center">
          <div className="space-y-5">
            {flareMenuItems.map((item) => (
              <Link
                key={item.label}
                className="block text-base font-bold text-slate-800 transition-colors hover:text-flare-600 focus-visible:text-flare-600 focus-visible:outline-none dark:text-cream-100 dark:hover:text-flare-400"
                href={item.href}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="space-y-5">
            {boardMenuItems.map((item) => (
              <Link
                key={item.label}
                className="block text-base font-bold text-slate-800 transition-colors hover:text-flare-600 focus-visible:text-flare-600 focus-visible:outline-none dark:text-cream-100 dark:hover:text-flare-400"
                href={item.href}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-warm-200 bg-warm-50 px-5 py-4 dark:border-slate-700 dark:bg-slate-800 md:hidden">
        <div className="grid grid-cols-2 gap-3 text-sm font-bold text-slate-700 dark:text-warm-200">
          {[...flareMenuItems, ...boardMenuItems].map((item) => (
            <Link key={item.label} href={item.href}>
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}

function getInitial(name: string) {
  return name.trim().charAt(0).toUpperCase() || "U";
}
