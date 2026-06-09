import { Header, ProjectOverview } from "@/components/organisms";

export default function OverviewPage() {
  return (
    <main className="min-h-screen bg-cream-50 text-slate-900 dark:bg-slate-900 dark:text-cream-50">
      <Header />
      <ProjectOverview />
    </main>
  );
}
