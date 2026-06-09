import { AuthShell, FindIdForm } from "@/components/organisms";

export default function FindIdPage() {
  return (
    <AuthShell title="아이디 찾기" description="가입 정보로 아이디를 확인하세요">
      <FindIdForm />
    </AuthShell>
  );
}
