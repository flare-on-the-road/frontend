"use client";

import {
  Camera,
  KeyRound,
  Mail,
  ShieldCheck,
  UserCircle,
  X,
} from "lucide-react";
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
  Textarea,
} from "@/components/atoms";
import { normalizeProfileImageUrl } from "@/lib/profile-image";
import {
  AdminApiRequestError,
  createAdminAccessRequest,
  fetchMyAdminAccessRequest,
} from "@/services/adminApi";
import { useAuthStore } from "@/stores/authStore";
import type { AdminAccessRequest } from "@/types/admin";

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
  const [adminAccessRequest, setAdminAccessRequest] =
    React.useState<AdminAccessRequest | null>(null);
  const [adminAccessReason, setAdminAccessReason] = React.useState("");
  const [adminAccessError, setAdminAccessError] = React.useState("");
  const [adminAccessNotice, setAdminAccessNotice] = React.useState("");
  const [isAdminAccessLoading, setIsAdminAccessLoading] =
    React.useState(false);
  const [isAdminAccessModalOpen, setIsAdminAccessModalOpen] =
    React.useState(false);
  const profileImageInputRef = React.useRef<HTMLInputElement>(null);
  const [isPending, startTransition] = React.useTransition();
  const canOpenAdminBoard =
    user?.role === "admin" || user?.role === "admin_viewer";

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
    if (!accessToken || !user || canOpenAdminBoard) return;

    void Promise.resolve().then(async () => {
      setIsAdminAccessLoading(true);
      setAdminAccessError("");
      try {
        const result = await fetchMyAdminAccessRequest(accessToken);
        setAdminAccessRequest(result.request);
      } catch (err) {
        setAdminAccessError(toAdminAccessErrorMessage(err));
      } finally {
        setIsAdminAccessLoading(false);
      }
    });
  }, [accessToken, canOpenAdminBoard, user]);

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

  async function handleAdminAccessRequest(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();
    if (!accessToken || canOpenAdminBoard) return;

    setIsAdminAccessLoading(true);
    setAdminAccessError("");
    setAdminAccessNotice("");

    try {
      const request = await createAdminAccessRequest(
        accessToken,
        adminAccessReason,
      );
      setAdminAccessRequest(request);
      setAdminAccessNotice("관리자 보드 열람 권한 요청을 보냈습니다.");
      setAdminAccessReason("");
      setIsAdminAccessModalOpen(false);
    } catch (err) {
      setAdminAccessError(toAdminAccessErrorMessage(err));
    } finally {
      setIsAdminAccessLoading(false);
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
                  defaultValue={formatPhoneNumber(user.phone ?? "")}
                  inputMode="numeric"
                  maxLength={13}
                  onChange={handlePhoneNumberChange}
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

        <Card className="mt-5 rounded-xl border-warm-200 bg-warm-50 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <CardHeader className="p-7 pb-3">
            <CardTitle className="flex items-center gap-3 text-2xl font-black text-slate-900 dark:text-cream-50">
              <ShieldCheck className="size-7 text-flare-600" />
              관리자 보드 권한
            </CardTitle>
          </CardHeader>
          <CardContent className="p-7 pt-3">
            {canOpenAdminBoard ? (
              <div className="rounded-lg border border-process-resolved/30 bg-process-resolved/10 px-4 py-3 text-sm font-bold text-process-resolved">
                관리자 보드 열람 권한이 있습니다.
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-sm font-semibold text-slate-500 dark:text-warm-300">
                  승인되면 회원 정보와 수정 기능을 제외한 관리자 보드를 읽기 전용으로 볼 수 있습니다.
                </p>
                {adminAccessRequest ? (
                  <div className="rounded-lg border border-warm-200 bg-cream-50 px-4 py-3 text-sm font-bold text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-warm-200">
                    요청 상태: {adminAccessStatusLabel(adminAccessRequest.status)}
                  </div>
                ) : null}
                {adminAccessNotice ? (
                  <p className="rounded-lg bg-process-resolved/10 px-4 py-3 text-sm font-bold text-process-resolved">
                    {adminAccessNotice}
                  </p>
                ) : null}
                {adminAccessError ? (
                  <p className="rounded-lg bg-danger-critical/10 px-4 py-3 text-sm font-bold text-danger-critical">
                    {adminAccessError}
                  </p>
                ) : null}
                <div className="flex justify-end">
                  <Button
                    type="button"
                    disabled={
                      isAdminAccessLoading ||
                      adminAccessRequest?.status === "pending"
                    }
                    onClick={() => {
                      setAdminAccessError("");
                      setAdminAccessNotice("");
                      setIsAdminAccessModalOpen(true);
                    }}
                    className="h-12 rounded-lg bg-flare-500 px-7 text-base font-black hover:bg-flare-600"
                  >
                    <ShieldCheck className="size-4" aria-hidden="true" />
                    {adminAccessRequest?.status === "pending"
                      ? "승인 대기 중"
                      : "권한 요청"}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        {isAdminAccessModalOpen ? (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-5 py-8"
            role="dialog"
            aria-modal="true"
            aria-labelledby="adminAccessRequestTitle"
          >
            <form
              className="w-full max-w-lg rounded-lg border border-warm-200 bg-cream-50 p-5 shadow-xl dark:border-slate-700 dark:bg-slate-900"
              onSubmit={handleAdminAccessRequest}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-black uppercase text-flare-600 dark:text-flare-400">
                    Admin Access
                  </p>
                  <h2
                    id="adminAccessRequestTitle"
                    className="mt-2 text-2xl font-black text-slate-900 dark:text-cream-50"
                  >
                    관리자 보드 권한 요청
                  </h2>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-9 rounded-full"
                  aria-label="닫기"
                  onClick={() => setIsAdminAccessModalOpen(false)}
                >
                  <X className="size-5" aria-hidden="true" />
                </Button>
              </div>
              <p className="mt-4 text-sm font-semibold text-slate-500 dark:text-warm-300">
                관리자에게 전달할 요청 사유를 입력하세요.
              </p>
              {adminAccessError ? (
                <p className="mt-4 rounded-lg bg-danger-critical/10 px-4 py-3 text-sm font-bold text-danger-critical">
                  {adminAccessError}
                </p>
              ) : null}
              <Textarea
                value={adminAccessReason}
                onChange={(event) => setAdminAccessReason(event.target.value)}
                placeholder="요청 사유를 입력하세요"
                className="mt-4 min-h-32 rounded-lg border-warm-300 bg-cream-50 px-5 py-4 text-base font-semibold dark:border-slate-700 dark:bg-slate-950"
                disabled={isAdminAccessLoading}
                autoFocus
              />
              <div className="mt-5 flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  disabled={isAdminAccessLoading}
                  onClick={() => setIsAdminAccessModalOpen(false)}
                >
                  취소
                </Button>
                <Button
                  type="submit"
                  disabled={isAdminAccessLoading}
                  className="bg-flare-500 font-black hover:bg-flare-600"
                >
                  <ShieldCheck className="size-4" aria-hidden="true" />
                  요청 보내기
                </Button>
              </div>
            </form>
          </div>
        ) : null}
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
  inputMode,
  maxLength,
  onChange,
}: {
  id: string;
  label: string;
  defaultValue?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  inputMode?: React.InputHTMLAttributes<HTMLInputElement>["inputMode"];
  maxLength?: number;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
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
        inputMode={inputMode}
        maxLength={maxLength}
        onChange={onChange}
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
  const normalizedImageUrl = normalizeProfileImageUrl(imageUrl);

  if (normalizedImageUrl) {
    return (
      <span
        aria-label={`${name} 프로필 이미지`}
        className={`${sizeClassName} inline-block shrink-0 rounded-full bg-cover bg-center`}
        role="img"
        style={{ backgroundImage: `url(${normalizedImageUrl})` }}
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

function handlePhoneNumberChange(event: React.ChangeEvent<HTMLInputElement>) {
  event.currentTarget.value = formatPhoneNumber(event.currentTarget.value);
}

function formatPhoneNumber(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 11);

  if (digits.length <= 3) {
    return digits;
  }

  if (digits.length <= 7) {
    return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  }

  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
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

function adminAccessStatusLabel(status: AdminAccessRequest["status"]) {
  if (status === "approved") return "승인";
  if (status === "rejected") return "거절";
  return "대기";
}

function toAdminAccessErrorMessage(error: unknown) {
  if (error instanceof AdminApiRequestError) return error.message;
  if (error instanceof Error) return error.message;
  return "권한 요청 처리 중 오류가 발생했습니다.";
}
