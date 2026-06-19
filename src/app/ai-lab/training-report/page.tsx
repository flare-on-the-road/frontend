import { TrainingReportPage, TrainingReportToc } from "@/components/organisms/ai-lab";
import { Header } from "@/components/organisms";

export default function AiLabTrainingReportPage() {
  return (
    <main className="min-h-screen bg-cream-50 text-slate-900 dark:bg-slate-900 dark:text-cream-50">
      <Header />
      <TrainingReportPage />
      <TrainingReportToc />
    </main>
  );
}
