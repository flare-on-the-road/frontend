import { Header, LiveCctvDashboard } from "@/components/organisms";

export default function CctvPage() {
  return (
    <main className="min-h-screen bg-cream-50 text-slate-900 dark:bg-slate-900 dark:text-cream-50">
      <Header />
      <LiveCctvDashboard />
    </main>
  );
}
