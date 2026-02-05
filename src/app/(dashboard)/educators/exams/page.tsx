"use client";

import { ExamsHeader } from "@/app/(dashboard)/educators/exams/_components/ExamsHeader";
import { ExamsStats } from "@/app/(dashboard)/educators/exams/_components/ExamsStats";
import { ExamsList } from "@/app/(dashboard)/educators/exams/_components/ExamsList";
import { useExamsPage } from "@/app/(dashboard)/educators/exams/_hooks/useExamsPage";
import { useSetBreadcrumb } from "@/hooks/useBreadcrumb";

export default function ExamsPage() {
  useSetBreadcrumb([{ label: "시험 관리" }]);
  const { lectures, exams, activeLectureId, setSelectedLectureId, isLoading } =
    useExamsPage();

  return (
    <div className="container mx-auto space-y-8 p-6">
      <ExamsHeader />
      <ExamsStats exams={exams} isLoading={isLoading} />
      <ExamsList
        exams={exams}
        lectures={lectures}
        selectedLectureId={activeLectureId}
        onLectureChange={setSelectedLectureId}
        isLoading={isLoading}
      />
    </div>
  );
}
