import { Header } from "@/components/organisms";
import { AdminConsole } from "@/components/organisms/admin";

export default function AdminPage() {
  return (
    <main className="min-h-screen bg-cream-50 text-slate-900 dark:bg-slate-900 dark:text-cream-50">
      <Header />
      <AdminConsole />
    </main>
  );
}
