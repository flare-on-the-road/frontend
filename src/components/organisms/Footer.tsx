import { ExternalLink, Flame, Mail, MapPin, ShieldCheck } from "lucide-react";
import Link from "next/link";

const footerSections = [
  {
    title: "서비스",
    links: [
      { label: "프로젝트 개요", href: "/overview" },
      { label: "개발 정보", href: "/development" },
      { label: "전국 CCTV 보기", href: "/cctv" },
    ],
  },
  {
    title: "게시판",
    links: [
      { label: "공지사항", href: "/notices" },
      { label: "1:1 문의", href: "/inquiries" },
      { label: "버그 게시판", href: "/bugs" },
    ],
  },
  {
    title: "계정",
    links: [
      { label: "로그인", href: "/login" },
      { label: "회원가입", href: "/register" },
      { label: "아이디 찾기", href: "/find-id" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="shrink-0 border-t border-warm-200 bg-warm-50 text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-warm-200">
      <div className="mx-auto max-w-[1440px] px-5 py-12 sm:px-8 lg:px-12">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_2fr]">
          <div className="max-w-md">
            <Link
              href="/"
              className="inline-flex items-center gap-3 rounded-full outline-none focus-visible:ring-[3px] focus-visible:ring-flare-400/40"
              aria-label="메인페이지로 이동"
            >
              <span className="flex size-11 items-center justify-center rounded-full bg-flare-500 text-cream-50 shadow-sm shadow-flare-500/30">
                <Flame className="size-6 fill-current" aria-hidden="true" />
              </span>
              <span className="text-2xl font-black leading-none text-slate-900 dark:text-cream-50">
                Flare
              </span>
            </Link>
            <p className="mt-5 text-sm font-semibold leading-7 text-slate-500 dark:text-warm-300">
              CCTV와 AI를 결합해 고속도로 위험 상황을 빠르게 탐지하고,
              운영자가 현황을 확인할 수 있도록 돕는 안전 관제 플랫폼입니다.
            </p>
            <div className="mt-6 grid gap-3 text-sm font-bold">
              <div className="flex items-center gap-3">
                <ShieldCheck className="size-4 text-flare-600 dark:text-flare-400" aria-hidden="true" />
                AI 기반 실시간 도로 안전 모니터링
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="size-4 text-flare-600 dark:text-flare-400" aria-hidden="true" />
                Republic of Korea
              </div>
              <a
                href="mailto:support@flare-road.local"
                className="flex items-center gap-3 transition-colors hover:text-flare-600 dark:hover:text-flare-400"
              >
                <Mail className="size-4 text-flare-600 dark:text-flare-400" aria-hidden="true" />
                support@flare-road.local
              </a>
            </div>
          </div>

          <div className="grid gap-8 sm:grid-cols-3">
            {footerSections.map((section) => (
              <div key={section.title}>
                <h2 className="text-sm font-black text-slate-950 dark:text-cream-50">
                  {section.title}
                </h2>
                <nav className="mt-4 grid gap-3" aria-label={`${section.title} footer navigation`}>
                  {section.links.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="text-sm font-semibold text-slate-500 transition-colors hover:text-flare-600 dark:text-warm-300 dark:hover:text-flare-400"
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-warm-200 pt-6 text-xs font-bold text-slate-500 dark:border-slate-800 dark:text-warm-300 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Flare on the road. All rights reserved.</p>
          <div className="flex flex-wrap gap-4">
            <Link href="/development" className="transition-colors hover:text-flare-600 dark:hover:text-flare-400">
              기술 정보
            </Link>
            <Link href="/inquiries" className="transition-colors hover:text-flare-600 dark:hover:text-flare-400">
              문의하기
            </Link>
            <a
              href="https://github.com"
              className="inline-flex items-center gap-1 transition-colors hover:text-flare-600 dark:hover:text-flare-400"
              target="_blank"
              rel="noreferrer"
            >
              <ExternalLink className="size-3.5" aria-hidden="true" />
              GitHub
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
