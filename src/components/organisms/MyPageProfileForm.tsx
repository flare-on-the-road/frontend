"use client";

import { Camera, KeyRound, Mail, ShieldCheck, UserCircle } from "lucide-react";
import Link from "next/link";
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
  const updateProfileImage = useAuthStore((state) => state.updateProfileImage);
  const profileImagePreviewUrl = useAuthStore(
    (state) => state.profileImagePreviewUrl,
  );
  const setProfileImagePreviewUrl = useAuthStore(
    (state) => state.setProfileImagePreviewUrl,
  );
  const [error, setError] = React.useState("");
  const [successMessage, setSuccessMessage] = React.useState("");
  const activePreviewUrlRef = React.useRef<string | null>(null);
  const [isImagePending, setIsImagePending] = React.useState(false);
  const profileImageInputRef = React.useRef<HTMLInputElement>(null);
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

  React.useEffect(() => {
    return () => {
      if (activePreviewUrlRef.current) {
        URL.revokeObjectURL(activePreviewUrlRef.current);
      }
    };
  }, []);

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
        await updateProfile({
          name,
          department,
          phone,
        });
        setSuccessMessage("프로필 정보가 저장되었습니다.");
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "프로필 저장에 실패했습니다.",
        );
      }
    });
  }

  async function handleProfileImageChange(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    const file = event.target.files?.[0];

    if (activePreviewUrlRef.current) {
      URL.revokeObjectURL(activePreviewUrlRef.current);
      activePreviewUrlRef.current = null;
    }

    if (!file) {
      setProfileImagePreviewUrl(null);
      return;
    }

    const nextPreviewUrl = URL.createObjectURL(file);
    activePreviewUrlRef.current = nextPreviewUrl;
    setProfileImagePreviewUrl(nextPreviewUrl);
    setError("");
    setSuccessMessage("");
    setIsImagePending(true);

    try {
      await updateProfileImage(file);
      setSuccessMessage("프로필 이미지가 변경되었습니다.");
      URL.revokeObjectURL(nextPreviewUrl);
      activePreviewUrlRef.current = null;
    } catch (err) {
      URL.revokeObjectURL(nextPreviewUrl);
      activePreviewUrlRef.current = null;
      setProfileImagePreviewUrl(null);
      setError(
        err instanceof Error
          ? err.message
          : "프로필 이미지 변경에 실패했습니다.",
      );
    } finally {
      setIsImagePending(false);
      if (profileImageInputRef.current) {
        profileImageInputRef.current.value = "";
      }
    }
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
              <label
                className="group/avatar relative inline-flex cursor-pointer rounded-full outline-none focus-within:ring-[3px] focus-within:ring-flare-400/40"
                htmlFor="profileImage"
                aria-label={isImagePending ? "프로필 이미지 변경 중" : "프로필 이미지 변경"}
                title={isImagePending ? "프로필 이미지 변경 중" : "프로필 이미지 변경"}
              >
                <ProfileAvatar
                  imageUrl={profileImagePreviewUrl ?? user.profileImageUrl}
                  name={user.name}
                  sizeClassName="size-16 text-2xl"
                />
                <span className="absolute inset-0 flex items-center justify-center rounded-full bg-slate-900/0 text-cream-50 opacity-0 transition group-hover/avatar:bg-slate-900/45 group-hover/avatar:opacity-100 group-focus-within/avatar:bg-slate-900/45 group-focus-within/avatar:opacity-100">
                  {isImagePending ? (
                    <span className="text-xs font-black">저장중</span>
                  ) : (
                    <Camera className="size-5" aria-hidden="true" />
                  )}
                </span>
              </label>
              <input
                ref={profileImageInputRef}
                id="profileImage"
                type="file"
                accept="image/png,image/jpeg,image/webp,image/gif"
                disabled={isImagePending}
                className="sr-only"
                onChange={handleProfileImageChange}
              />
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
              {user.provider.toLowerCase() === "local" ? (
                <Button
                  asChild
                  className="mt-6 h-11 w-full rounded-lg border border-warm-300 bg-cream-50 text-sm font-black text-slate-700 hover:bg-warm-100 dark:border-slate-700 dark:bg-slate-900 dark:text-cream-50 dark:hover:bg-slate-700"
                  variant="outline"
                >
                  <Link href="/my-page/change-password">
                    <KeyRound className="size-4" aria-hidden="true" />
                    비밀번호 변경
                  </Link>
                </Button>
              ) : null}
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

function ProfileAvatar({
  imageUrl,
  name,
  sizeClassName,
}: {
  imageUrl?: string | null;
  name: string;
  sizeClassName: string;
}) {
  if (imageUrl) {
    return (
      <span
        aria-label={`${name} 프로필 이미지`}
        className={`${sizeClassName} inline-block shrink-0 rounded-full bg-cover bg-center`}
        role="img"
        style={{ backgroundImage: `url(${imageUrl})` }}
      />
    );
  }

  return (
    <div
      className={`${sizeClassName} flex shrink-0 items-center justify-center rounded-full bg-flare-500 font-black text-cream-50`}
    >
      {getInitial(name)}
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
