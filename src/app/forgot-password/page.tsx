import { AuthShell, ForgotPasswordForm } from "@/components/organisms";

export default function ForgotPasswordPage() {
  return (
    <AuthShell title="비밀번호 찾기" description="가입 정보 확인 후 임시 비밀번호를 발급합니다">
      <ForgotPasswordForm />
    </AuthShell>
  );
}
