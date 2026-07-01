import { Suspense } from "react";

import { Header } from "@/components/organisms";
import { EventList } from "@/components/organisms/EventList";

export default function EventsPage() {
  return (
    <main className="min-h-screen bg-cream-50 text-slate-900 dark:bg-slate-900 dark:text-cream-50">
      <Header />
      <Suspense>
        <EventList />
      </Suspense>
    </main>
  );
}
