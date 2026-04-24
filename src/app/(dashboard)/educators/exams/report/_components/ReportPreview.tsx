"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";

import type { ReportTemplateExamData } from "@/types/report";

import { useReportPage } from "../_hooks/useReportPage";

function ReportTemplateLoading() {
  return (
    <div className="flex min-h-[560px] items-center justify-center rounded-[24px] border border-[#eaecf2] bg-white">
      <p className="text-[14px] font-medium text-[#8b90a3]">
        리포트를 불러오는 중입니다...
      </p>
    </div>
  );
}

const SimpleReportTemplate = dynamic<{ examData: ReportTemplateExamData }>(
  () =>
    import("./SimpleReportTemplate").then(
      (module) => module.SimpleReportTemplate
    ),
  {
    ssr: false,
    loading: () => <ReportTemplateLoading />,
  }
);

const PremiumReportTemplate = dynamic<{ examData: ReportTemplateExamData }>(
  () =>
    import("./PremiumReportTemplate").then(
      (module) => module.PremiumReportTemplate
    ),
  {
    ssr: false,
    loading: () => <ReportTemplateLoading />,
  }
);

export function ReportPreview() {
  const {
    selectedClassId,
    selectedExamId,
    selectedStudentId,
    selectedTemplate,
    classes,
    exams,
    students,
  } = useReportPage();

  // 선택된 학생 데이터 계산 (수업 → 시험 → 학생 순서)
  const selectedData = useMemo(() => {
    if (!selectedExamId || !selectedStudentId) return null;
    const exam = exams.find((e) => e.id === selectedExamId);
    const student = students.find((s) => s.id === selectedStudentId);
    const selectedClass = classes.find((cls) => cls.id === selectedClassId);
    if (!exam || !student) return null;
    return {
      id: student.id,
      examId: exam.id,
      gradeId: student.gradeId,
      studentId: student.id,
      examName: exam.examName,
      examDate: exam.examDate,
      examType: exam.examType,
      score: student.score,
      rank: student.rank,
      totalStudents: student.totalStudents,
      averageScore: student.averageScore,
      attendance: student.attendance,
      nextClass: student.nextClass,
      memo: student.memo,
      questionResults: student.questionResults ?? [],
      assignmentResults: student.assignmentResults ?? [],
      studentName: student.name,
      className: student.className,
      schoolName: student.academyName ?? student.school,
      instructorName: selectedClass?.instructorName ?? null,
      phone: student.phone,
      parentPhone: student.parentPhone,
    };
  }, [
    selectedClassId,
    selectedExamId,
    selectedStudentId,
    classes,
    exams,
    students,
  ]);

  // 학생 미선택 시 빈 상태
  if (!selectedStudentId || !selectedData) {
    return (
      <div className="flex min-h-[560px] flex-col items-center justify-center rounded-[24px] border border-dashed border-[#d6d9e0] bg-white p-10 text-center">
        <h3 className="text-[22px] font-bold tracking-[-0.22px] text-[#4a4d5c]">
          리포트 미리보기
        </h3>
        <p className="mt-2 max-w-[280px] text-[14px] font-medium leading-6 text-[#8b90a3]">
          좌측에서 수업, 시험, 학생을 선택하면
          <br />
          성적표 미리보기가 표시됩니다.
        </p>
      </div>
    );
  }

  // 템플릿에 따라 렌더링
  if (selectedTemplate === "simple") {
    return <SimpleReportTemplate examData={selectedData} />;
  }

  // 프리미엄 리포트
  return <PremiumReportTemplate examData={selectedData} />;
}
