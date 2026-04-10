import { Metadata } from "next";

import { TermsContent } from "@/features/landing/terms/ui/TermsContent";

export const metadata: Metadata = {
  title: "이용약관 | 쌤비",
  description: "쌤비(SSam B) 서비스 이용약관",
};

export default function TermsPage() {
  return (
    <section className="mx-auto max-w-3xl px-4 pb-20 pt-40">
      <h1 className="mb-8 text-3xl font-extrabold text-gray-900">이용약관</h1>
      <TermsContent />
    </section>
  );
}
