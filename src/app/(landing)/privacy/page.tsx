import { Metadata } from "next";

import { PrivacyContent } from "@/features/landing/privacy/ui/PrivacyContent";

export const metadata: Metadata = {
  title: "개인정보 처리방침 | 쌤비",
  description: "쌤비(SSam B) 개인정보 처리방침",
};

export default function PrivacyPage() {
  return (
    <section className="mx-auto max-w-3xl px-4 pb-20 pt-40">
      <h1 className="mb-8 text-3xl font-extrabold text-gray-900">
        개인정보 처리방침
      </h1>
      <PrivacyContent />
    </section>
  );
}
