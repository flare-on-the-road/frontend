import { getOAuthLoginUrl } from "@/services/authApi";

const providers = [
  {
    id: "kakao",
    label: "카카오 로그인",
    icon: <KakaoIcon />,
    className: "bg-[#FEE500] text-[#181600]",
  },
  {
    id: "naver",
    label: "네이버 로그인",
    icon: <NaverIcon />,
    className: "bg-[#03C75A] text-white",
  },
  {
    id: "google",
    label: "구글 로그인",
    icon: <GoogleIcon />,
    className: "border border-slate-200 bg-white",
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
            className={`flex size-16 items-center justify-center rounded-full shadow-md transition-transform hover:scale-105 ${provider.className}`}
          >
            {provider.icon}
          </a>
        ))}
      </div>
    </div>
  );
}

function KakaoIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-8 w-8"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill="currentColor"
        d="M20 7.5C11.72 7.5 5 12.81 5 19.36c0 4.21 2.78 7.91 6.96 10l-1.43 5.25c-.13.47.41.84.81.56l6.27-4.15c.78.1 1.58.15 2.39.15 8.28 0 15-5.31 15-11.81S28.28 7.5 20 7.5Z"
      />
    </svg>
  );
}

function NaverIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-7 w-7"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill="currentColor"
        d="M23.56 20.67 16.1 10H9.91v20h6.53V19.33L23.9 30h6.19V10h-6.53v10.67Z"
      />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-8 w-8"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill="#4285F4"
        d="M23.49 12.27c0-.82-.07-1.42-.22-2.04H12.24v4h6.48c-.13.99-.84 2.49-2.4 3.49l-.02.13 3.49 2.47.24.02c2.24-1.89 3.46-4.67 3.46-8.07Z"
      />
      <path
        fill="#34A853"
        d="M12.24 22.8c3.2 0 5.89-.96 7.85-2.63l-3.74-2.72c-1 .64-2.34 1.09-4.11 1.09-3.13 0-5.78-1.89-6.73-4.5l-.14.01-3.63 2.57-.05.12c1.95 3.54 5.91 6.06 10.55 6.06Z"
      />
      <path
        fill="#FBBC05"
        d="M5.51 14.04a6.2 6.2 0 0 1-.35-2.04c0-.71.13-1.4.34-2.04l-.01-.14-3.68-2.62-.12.05A10.08 10.08 0 0 0 .51 12c0 1.71.45 3.33 1.23 4.75l3.77-2.71Z"
      />
      <path
        fill="#EA4335"
        d="M12.24 5.46c2.23 0 3.73.88 4.59 1.61l3.35-2.99C18.13 2.34 15.44 1.2 12.24 1.2 7.6 1.2 3.64 3.72 1.69 7.25l3.76 2.71c.96-2.61 3.66-4.5 6.79-4.5Z"
      />
    </svg>
  );
}
