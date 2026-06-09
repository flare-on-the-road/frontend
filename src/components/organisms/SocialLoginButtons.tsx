import { getOAuthLoginUrl } from "@/services/authApi";

const providers = [
  {
    id: "kakao",
    label: "카카오 로그인",
    text: "●",
    className: "bg-[#FEE500] text-[#181600]",
  },
  {
    id: "naver",
    label: "네이버 로그인",
    text: "N",
    className: "bg-[#03C75A] text-white",
  },
  {
    id: "google",
    label: "구글 로그인",
    text: "G",
    className: "bg-white text-[#4285F4]",
  },
] as const;

export function SocialLoginButtons() {
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-4 text-sm font-bold text-slate-500 dark:text-warm-300">
        <span className="h-px flex-1 bg-warm-200 dark:bg-slate-700" />
        또는
        <span className="h-px flex-1 bg-warm-200 dark:bg-slate-700" />
      </div>
      <div className="flex justify-center gap-7">
        {providers.map((provider) => (
          <a
            key={provider.id}
            aria-label={provider.label}
            href={getOAuthLoginUrl(provider.id)}
            className={`flex size-16 items-center justify-center rounded-full text-3xl font-black shadow-md transition-transform hover:scale-105 ${provider.className}`}
          >
            {provider.text}
          </a>
        ))}
      </div>
    </div>
  );
}
