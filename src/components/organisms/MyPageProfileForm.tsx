"use client";

import { Mail, ShieldCheck, UserCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import * as React from "react";

import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
} from "@/components/atoms";
import { useAuthStore } from "@/stores/authStore";

export function MyPageProfileForm() {
  const router = useRouter();
  const accessToken = useAuthStore((state) => state.accessToken);
  const user = useAuthStore((state) => state.user);
  const isHydrated = useAuthStore((state) => state.isHydrated);
  const fetchCurrentUser = useAuthStore((state) => state.fetchCurrentUser);
  const updateProfile = useAuthStore((state) => state.updateProfile);
  const [error, setError] = React.useState("");
  const [successMessage, setSuccessMessage] = React.useState("");
  const [isPending, startTransition] = React.useTransition();

  React.useEffect(() => {
    if (!isHydrated) {
      return;
    }

    if (!accessToken) {
      router.replace("/login");
      return;
    }

    if (!user) {
      fetchCurrentUser().catch(() => {
        router.replace("/login");
      });
    }
  }, [accessToken, fetchCurrentUser, isHydrated, router, user]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccessMessage("");

    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") ?? "");
    const department = String(formData.get("department") ?? "");
    const phone = String(formData.get("phone") ?? "");

    startTransition(async () => {
      try {
        await updateProfile({ name, department, phone });
        setSuccessMessage("프로필 정보가 저장되었습니다.");
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "프로필 저장에 실패했습니다.",
        );
      }
    });
  }

  if (!isHydrated || !user) {
    return (
      <section className="px-5 py-20 sm:px-8">
        <div className="mx-auto max-w-3xl text-center text-lg font-bold text-slate-500 dark:text-warm-300">
          사용자 정보를 불러오는 중입니다.
        </div>
      </section>
    );
  }

  return (
    <section className="px-5 py-16 sm:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl font-black text-slate-900 dark:text-cream-50">
            마이페이지
          </h1>
          <p className="mt-3 text-lg font-semibold text-slate-500 dark:text-warm-300">
            로그인 계정과 관제 프로필 정보를 관리합니다.
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-[280px_1fr]">
          <Card className="h-fit rounded-xl border-warm-200 bg-warm-50 shadow-sm dark:border-slate-700 dark:bg-slate-800">
            <CardContent className="p-6">
              <div className="flex size-16 items-center justify-center rounded-full bg-flare-500 text-2xl font-black text-cream-50">
                {getInitial(user.name)}
              </div>
              <h2 className="mt-5 truncate text-2xl font-black text-slate-900 dark:text-cream-50">
                {user.name}
              </h2>
              <div className="mt-4 space-y-3 text-sm font-bold text-slate-600 dark:text-warm-300">
                <p className="flex items-center gap-2">
                  <Mail className="size-4 text-flare-600" aria-hidden="true" />
                  <span className="truncate">{user.email}</span>
                </p>
                <p className="flex items-center gap-2">
                  <ShieldCheck
                    className="size-4 text-process-resolved"
                    aria-hidden="true"
                  />
                  {getProviderLabel(user.provider)}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-xl border-warm-200 bg-warm-50 shadow-sm dark:border-slate-700 dark:bg-slate-800">
            <CardHeader className="p-7 pb-3">
              <CardTitle className="flex items-center gap-3 text-2xl font-black text-slate-900 dark:text-cream-50">
                <UserCircle className="size-7 text-flare-600" />
                프로필 수정
              </CardTitle>
            </CardHeader>
            <CardContent className="p-7 pt-3">
              <form className="space-y-6" onSubmit={handleSubmit}>
                {successMessage ? (
                  <p className="rounded-lg bg-process-resolved/10 px-4 py-3 text-sm font-bold text-process-resolved">
                    {successMessage}
                  </p>
                ) : null}
                {error ? (
                  <p className="rounded-lg bg-danger-critical/10 px-4 py-3 text-sm font-bold text-danger-critical">
                    {error}
                  </p>
                ) : null}

                <ProfileField
                  id="email"
                  label="이메일"
                  defaultValue={user.email}
                  disabled
                />
                <ProfileField
                  id="name"
                  label="이름"
                  defaultValue={user.name}
                  required
                />
                <ProfileField
                  id="department"
                  label="부서"
                  defaultValue={user.department ?? ""}
                  placeholder="관제팀"
                />
                <ProfileField
                  id="phone"
                  label="전화번호"
                  defaultValue={user.phone ?? ""}
                  placeholder="010-1234-5678"
                />

                <div className="flex justify-end">
                  <Button
                    type="submit"
                    disabled={isPending}
                    className="h-12 rounded-lg bg-flare-500 px-7 text-base font-black hover:bg-flare-600"
                  >
                    {isPending ? "저장 중..." : "저장"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

function ProfileField({
  id,
  label,
  defaultValue,
  placeholder,
  required,
  disabled,
}: {
  id: string;
  label: string;
  defaultValue?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
}) {
  return (
    <div className="space-y-3">
      <label
        className="block text-base font-black text-slate-900 dark:text-cream-50"
        htmlFor={id}
      >
        {label}
      </label>
      <Input
        id={id}
        name={id}
        defaultValue={defaultValue}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className="h-14 rounded-lg border-warm-300 bg-cream-50 px-5 text-base font-semibold dark:border-slate-700 dark:bg-slate-900"
      />
    </div>
  );
}

function getInitial(name: string) {
  return name.trim().charAt(0).toUpperCase() || "U";
}

function getProviderLabel(provider: string) {
  const providerLabels: Record<string, string> = {
    google: "구글 로그인 계정",
    kakao: "카카오 로그인 계정",
    naver: "네이버 로그인 계정",
    local: "이메일 로그인 계정",
  };

  return providerLabels[provider.toLowerCase()] ?? "로그인 계정";
}
