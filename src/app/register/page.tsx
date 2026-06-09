import { AuthShell, RegisterForm } from "@/components/organisms";

export default function RegisterPage() {
  return (
    <AuthShell title="회원가입" description="관제 시스템 계정을 생성하세요">
      <RegisterForm />
    </AuthShell>
  );
}
