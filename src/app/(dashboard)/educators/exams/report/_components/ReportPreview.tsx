"use client";

import { useMemo } from "react";

import { useReportPage } from "../_hooks/useReportPage";

import { SimpleReportTemplate } from "./SimpleReportTemplate";
import { PremiumReportTemplate } from "./PremiumReportTemplate";

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
      <div className="flex h-full min-h-[500px] flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-200 bg-zinc-50/50 p-10 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-zinc-100">
          <span className="text-2xl">👋</span>
        </div>
        <h3 className="text-lg font-bold text-zinc-900">리포트 미리보기</h3>
        <p className="mt-2 text-sm text-zinc-500 max-w-[240px] leading-relaxed">
          좌측 목록에서{" "}
          <span className="font-semibold text-indigo-600">
            수업 → 시험 → 학생
          </span>{" "}
          순서로 선택하면 리포트가 생성됩니다.
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
