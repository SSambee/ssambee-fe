"use client";

import { useSetBreadcrumb } from "@/hooks/useBreadcrumb";

import { ExamsHeader } from "./_components/ExamsHeader";
import { ExamsNavigationTabs } from "./_components/ExamsNavigationTabs";
import { ExamsStats } from "./_components/ExamsStats";
import { ExamsList } from "./_components/ExamsList";
import { useExamsPage } from "./_hooks/useExamsPage";

export default function ExamsPage() {
  useSetBreadcrumb([{ label: "시험 관리" }]);
  const { lectures, exams, activeLectureId, setSelectedLectureId, isLoading } =
    useExamsPage();

  return (
    <div className="container mx-auto space-y-8 p-6">
      <ExamsHeader exams={exams} />
      <ExamsNavigationTabs />
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
