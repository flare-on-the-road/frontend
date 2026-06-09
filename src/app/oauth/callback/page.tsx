import { Suspense } from "react";

import { AuthShell, OAuthCallback } from "@/components/organisms";

export default function OAuthCallbackPage() {
  return (
    <AuthShell title="소셜 로그인" description="인증 정보를 확인하고 있습니다">
      <Suspense>
        <OAuthCallback />
      </Suspense>
    </AuthShell>
  );
}
