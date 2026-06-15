"use client";

import { Bot, Camera, ClipboardList, Info, LogOut, Settings, UserCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";

import { Button, Logo, ThemeToggle } from "@/components/atoms";
import { useAuthStore } from "@/stores/authStore";

const flareMenuItems = [
  { label: "프로젝트 개요", href: "/overview" },
  { label: "개발 정보", href: "/development" },
];

const boardMenuItems = [
  { label: "공지사항", href: "/notices" },
  { label: "1:1 문의", href: "/inquiries" },
  { label: "버그 게시판", href: "/bugs" },
];

const cctvMenuItems = [
  { label: "전국 CCTV 보기", href: "/cctv" },
];

const aiLabMenuItems = [
  { label: "AI 모델 데모", href: "/ai-lab/model-demo" },
  { label: "탐지 파이프라인", href: "/ai-lab/pipeline" },
  { label: "학습 데이터셋", href: "/ai-lab/dataset" },
];

export function Header() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const profileImagePreviewUrl = useAuthStore(
    (state) => state.profileImagePreviewUrl,
  );
  const logout = useAuthStore((state) => state.logout);

  function handleLogout() {
    logout();
    router.push("/");
  }

  return (
    <header className="sticky top-0 z-20 border-b border-warm-200 bg-cream-50/95 backdrop-blur dark:border-slate-700 dark:bg-slate-900/95">
      <div className="mx-auto flex h-[76px] max-w-[1440px] items-center justify-between px-5 sm:px-8 lg:px-12">
        <Logo />

        <nav
          className="hidden h-full items-center gap-14 text-sm font-black text-slate-900 dark:text-cream-100 md:flex"
          aria-label="Primary navigation"
        >
          <HeaderMenu
            icon={<Info className="size-6" aria-hidden="true" />}
            label="Flare"
            items={flareMenuItems}
          />
          <HeaderMenu
            icon={<Camera className="size-6" aria-hidden="true" />}
            label="실시간 CCTV"
            items={cctvMenuItems}
          />
          <HeaderMenu
            icon={<Bot className="size-6" aria-hidden="true" />}
            label="AI Lab"
            items={aiLabMenuItems}
          />
          <HeaderMenu
            icon={<ClipboardList className="size-6" aria-hidden="true" />}
            label="게시판"
            items={boardMenuItems}
          />
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex min-w-0 items-center gap-2 rounded-full border border-warm-200 bg-cream-100 px-2.5 py-2 shadow-sm dark:border-slate-700 dark:bg-slate-800">
              <Link
                href="/my-page"
                className="flex min-w-0 items-center gap-2 rounded-full outline-none focus-visible:ring-[3px] focus-visible:ring-flare-400/40"
                aria-label="마이페이지로 이동"
              >
                <ProfileAvatar
                  imageUrl={profileImagePreviewUrl ?? user.profileImageUrl}
                  name={user.name}
                />
                <div className="hidden min-w-0 leading-tight sm:block">
                  <div className="flex items-center gap-2">
                    <span className="max-w-28 truncate text-sm font-black text-slate-900 dark:text-cream-50 lg:max-w-36">
                      {user.name}
                    </span>
                    <span
                      className="max-w-28 truncate rounded-full bg-process-resolved/15 px-2 py-0.5 text-[11px] font-black text-process-resolved lg:max-w-36"
                      title={getProviderLoginLabel(user.provider)}
                    >
                      {getProviderLoginLabel(user.provider)}
                    </span>
                  </div>
                  <p className="max-w-44 truncate text-xs font-semibold text-slate-500 dark:text-warm-300">
                    {user.email}
                  </p>
                </div>
              </Link>
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
          {user?.role === "admin" ? (
            <Button
              asChild
              variant="ghost"
              size="icon"
              className="size-11 rounded-full text-slate-600 hover:bg-warm-100 hover:text-flare-600 dark:text-warm-200 dark:hover:bg-slate-800 dark:hover:text-flare-400"
              aria-label="관리자 설정"
              title="관리자 설정"
            >
              <Link href="/admin">
                <Settings className="size-5" aria-hidden="true" />
              </Link>
            </Button>
          ) : null}
          <ThemeToggle />
        </div>
      </div>

      <div className="border-t border-warm-200 bg-warm-50 px-5 py-4 dark:border-slate-700 dark:bg-slate-800 md:hidden">
        <div className="grid grid-cols-2 gap-3 text-sm font-bold text-slate-700 dark:text-warm-200">
          {[
            ...flareMenuItems,
            ...cctvMenuItems,
            ...aiLabMenuItems,
            ...boardMenuItems,
          ].map((item) => (
            <Link key={item.label} href={item.href}>
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}

function HeaderMenu({
  icon,
  label,
  items,
}: {
  icon: ReactNode;
  label: string;
  items: Array<{ label: string; href: string }>;
}) {
  return (
    <div className="group/menu relative flex h-full items-center">
      <button
        className="flex h-[76px] cursor-default items-center gap-3 whitespace-nowrap bg-transparent transition-colors group-hover/menu:text-flare-600 focus-visible:text-flare-600 focus-visible:outline-none dark:group-hover/menu:text-flare-400"
        type="button"
        aria-haspopup="menu"
      >
        {icon}
        {label}
      </button>

      <div className="absolute left-1/2 top-full hidden min-w-max -translate-x-1/2 border border-warm-200 bg-warm-50/98 px-7 py-5 text-center shadow-sm transition-[max-height,opacity] duration-200 group-focus-within/menu:block group-hover/menu:block dark:border-slate-700 dark:bg-slate-800/98 md:block md:max-h-0 md:overflow-hidden md:opacity-0 md:group-focus-within/menu:max-h-96 md:group-focus-within/menu:opacity-100 md:group-hover/menu:max-h-96 md:group-hover/menu:opacity-100">
        <div className="space-y-4">
          {items.map((item) => (
            <Link
              key={item.label}
              className="block whitespace-nowrap text-base font-bold text-slate-800 transition-colors hover:text-flare-600 focus-visible:text-flare-600 focus-visible:outline-none dark:text-cream-100 dark:hover:text-flare-400"
              href={item.href}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

function getInitial(name: string) {
  return name.trim().charAt(0).toUpperCase() || "U";
}

function ProfileAvatar({
  imageUrl,
  name,
}: {
  imageUrl?: string | null;
  name: string;
}) {
  if (imageUrl) {
    return (
      <span
        aria-label={`${name} 프로필 이미지`}
        className="inline-block size-9 shrink-0 rounded-full bg-cover bg-center"
        role="img"
        style={{ backgroundImage: `url(${imageUrl})` }}
      />
    );
  }

  return (
    <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-flare-500 text-sm font-black text-cream-50">
      {getInitial(name)}
    </div>
  );
}

function getProviderLoginLabel(provider: string) {
  const providerLabels: Record<string, string> = {
    google: "구글로 로그인됨",
    kakao: "카카오로 로그인됨",
    naver: "네이버로 로그인됨",
    local: "이메일로 로그인됨",
  };

  return providerLabels[provider.toLowerCase()] ?? "로그인됨";
}
