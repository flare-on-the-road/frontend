"use client";

import { useParams } from "next/navigation";

import { BugPostForm } from "@/components/organisms/bugs";
import { Header } from "@/components/organisms";

export default function EditBugPostPage() {
  const params = useParams<{ id: string }>();
  const postId = Number(params.id);

  return (
    <main className="min-h-screen bg-cream-50 text-slate-900 dark:bg-slate-900 dark:text-cream-50">
      <Header />
      <BugPostForm mode="edit" postId={postId} />
    </main>
  );
}
