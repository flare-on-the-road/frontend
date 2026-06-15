import type { Metadata } from "next";

import { Footer } from "@/components/organisms";

import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Flare on the road",
    template: "%s | Flare on the road",
  },
  description: "AI 기반 실시간 고속도로 안전 관제 플랫폼",
  icons: {
    icon: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        {children}
        <Footer />
      </body>
    </html>
  );
}
