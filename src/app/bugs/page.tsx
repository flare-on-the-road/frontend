import { BugBoardList } from "@/components/organisms/bugs";
import { Header } from "@/components/organisms";

export default function BugsPage() {
  return (
    <main className="min-h-screen bg-cream-50 text-slate-900 dark:bg-slate-900 dark:text-cream-50">
      <Header />
      <BugBoardList />
    </main>
  );
}
