"use client";

import { useMemo } from "react";

import { Card, CardContent } from "@/components/ui/card";
import { useReportStore } from "@/stores/report.store";

import { SimpleReportTemplate } from "./SimpleReportTemplate";
import { PremiumReportTemplate } from "./PremiumReportTemplate";

export function ReportPreview() {
  const {
    selectedExamId,
    selectedStudentId,
    selectedTemplate,
    exams,
    students,
  } = useReportStore();

  // 선택된 학생 데이터 계산 (수업 → 시험 → 학생 순서)
  const selectedData = useMemo(() => {
    if (!selectedExamId || !selectedStudentId) return null;
    const exam = exams.find((e) => e.id === selectedExamId);
    const student = students.find((s) => s.id === selectedStudentId);
    if (!exam || !student) return null;
    return {
      id: student.id,
      examId: exam.id,
      studentId: student.id,
      examName: exam.examName,
      examDate: exam.examDate,
      score: student.score,
      rank: student.rank,
      totalStudents: student.totalStudents,
      averageScore: student.averageScore,
      attendance: student.attendance,
      nextClass: student.nextClass,
      memo: student.memo,
      questionResults: student.questionResults ?? [],
      studentName: student.name,
      className: student.className,
      phone: student.phone,
      parentPhone: student.parentPhone,
    };
  }, [selectedExamId, selectedStudentId, exams, students]);

  // 학생 미선택 시 빈 상태
  if (!selectedStudentId || !selectedData) {
    return (
      <Card className="h-full min-h-[300px]">
        <CardContent className="flex h-full flex-col items-center justify-center gap-2 py-6">
          <p className="font-medium text-muted-foreground">성적표 미리보기</p>
          <p className="text-sm text-muted-foreground">
            수업 → 시험 → 학생 순서로 선택해주세요.
          </p>
        </CardContent>
      </Card>
    );
  }

  // 템플릿에 따라 렌더링
  if (selectedTemplate === "simple") {
    return <SimpleReportTemplate examData={selectedData} />;
  }

  // 프리미엄 리포트
  return <PremiumReportTemplate examData={selectedData} />;
}
