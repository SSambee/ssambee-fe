"use client";

import { useSetBreadcrumb } from "@/hooks/useBreadcrumb";

import { ReportHeader } from "./_components/ReportHeader";
import { ReportSearchSection } from "./_components/ReportSearchSection";
import { ReportTemplateSelect } from "./_components/ReportTemplateSelect";
import { ReportPreview } from "./_components/ReportPreview";

export default function ReportPage() {
  useSetBreadcrumb([
    { label: "시험 관리", href: "/educators/exams" },
    { label: "성적표 발송" },
  ]);
  return (
    <div className="container mx-auto space-y-8 p-6">
      <ReportHeader />

      <div className="grid gap-6 lg:grid-cols-[400px_1fr]">
        {/* 좌측: 검색 + 학생 목록 + 템플릿 */}
        <div className="space-y-6">
          <ReportSearchSection />
          <ReportTemplateSelect />
        </div>

        {/* 우측: 미리보기 */}
        <ReportPreview />
      </div>
    </div>
  );
}
