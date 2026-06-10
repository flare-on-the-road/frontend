import { NoticePostForm } from "@/components/organisms/notices";
import { Header } from "@/components/organisms";

export default function NewNoticePostPage() {
  return (
    <main className="min-h-screen bg-cream-50 text-slate-900 dark:bg-slate-900 dark:text-cream-50">
      <Header />
      <NoticePostForm mode="create" />
    </main>
  );
}
