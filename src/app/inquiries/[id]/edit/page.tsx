"use client";

import { useParams } from "next/navigation";

import { InquiryPostForm } from "@/components/organisms/inquiries";
import { Header } from "@/components/organisms";

export default function EditInquiryPostPage() {
  const params = useParams<{ id: string }>();
  const postId = Number(params.id);

  return (
    <main className="min-h-screen bg-cream-50 text-slate-900 dark:bg-slate-900 dark:text-cream-50">
      <Header />
      <InquiryPostForm mode="edit" postId={postId} />
    </main>
  );
}
