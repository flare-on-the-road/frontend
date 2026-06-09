import { Card, CardContent } from "@/components/atoms";
import { Header } from "@/components/organisms/Header";

type AuthShellProps = {
  title: string;
  description: string;
  children: React.ReactNode;
};

export function AuthShell({ title, description, children }: AuthShellProps) {
  return (
    <main className="min-h-screen bg-cream-50 text-slate-900 dark:bg-slate-900 dark:text-cream-50">
      <Header />
      <section className="flex min-h-[calc(100vh-76px)] items-start justify-center px-5 py-8 sm:px-8">
        <Card className="w-full max-w-xl rounded-xl border-warm-200 bg-warm-50 shadow-2xl shadow-slate-900/20 dark:border-slate-700 dark:bg-slate-800">
          <CardContent className="p-8 sm:p-14">
            <div className="mb-10 text-center">
              <h1 className="text-4xl font-black text-slate-900 dark:text-cream-50">
                <span className="text-flare-500">Flare</span> on the road
              </h1>
              <p className="mt-5 text-lg font-semibold text-slate-500 dark:text-warm-300">
                {description}
              </p>
              <h2 className="mt-8 text-2xl font-black text-slate-900 dark:text-cream-50">
                {title}
              </h2>
            </div>
            {children}
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
