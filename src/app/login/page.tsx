import { Suspense } from "react";

import { AuthShell, LoginForm } from "@/components/organisms";

export default function LoginPage() {
  return (
    <AuthShell title="로그인" description="고속도로 안전 관제 시스템 로그인">
      <Suspense>
        <LoginForm />
      </Suspense>
    </AuthShell>
  );
}
