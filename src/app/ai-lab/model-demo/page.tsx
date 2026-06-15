import { ModelDemoPage } from "@/components/organisms/ai-lab";
import { Header } from "@/components/organisms";

export default function AiLabModelDemoPage() {
  return (
    <main className="min-h-screen bg-cream-50 text-slate-900 dark:bg-slate-900 dark:text-cream-50">
      <Header />
      <ModelDemoPage />
    </main>
  );
}
