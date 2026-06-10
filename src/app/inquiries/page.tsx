import { InquiryBoardList } from "@/components/organisms/inquiries";
import { Header } from "@/components/organisms";

export default function InquiriesPage() {
  return (
    <main className="min-h-screen bg-cream-50 text-slate-900 dark:bg-slate-900 dark:text-cream-50">
      <Header />
      <InquiryBoardList />
    </main>
  );
}
