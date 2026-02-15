"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";

import { examKeys } from "@/constants/query-keys";
import { useExamDetail } from "@/hooks/exams/useExamDetail";
import { useStudentGradeWithAnswers } from "@/hooks/grades/useStudentGradeWithAnswers";
import { fetchExamGradesAPI } from "@/services/exams/grades.service";

export const useGradingPrimaryResources = (examId: string) => {
  const {
    data: examDetail,
    isPending,
    isError,
  } = useExamDetail(examId, Boolean(examId));

  const { data: examGrades = [] } = useQuery({
    queryKey: examKeys.grades(examId),
    queryFn: () => fetchExamGradesAPI(examId),
    enabled: Boolean(examId),
    staleTime: 1000 * 30,
    refetchOnWindowFocus: false,
  });

  const gradeIdByEnrollment = useMemo(() => {
    const entries = examGrades.map(
      (grade) => [grade.lectureEnrollmentId, grade.id] as const
    );

    return new Map<string, string>(entries);
  }, [examGrades]);

  return {
    examDetail,
    isPending,
    isError,
    gradeIdByEnrollment,
  };
};

export const useGradingStudentAnswerResource = ({
  activeStudentId,
  activeStudentHasGrade,
  gradeIdByEnrollment,
}: {
  activeStudentId: string;
  activeStudentHasGrade: boolean;
  gradeIdByEnrollment: Map<string, string>;
}) => {
  const activeGradeId = activeStudentId
    ? (gradeIdByEnrollment.get(activeStudentId) ?? "")
    : "";

  const { data: studentGradeDetail } = useStudentGradeWithAnswers(
    activeGradeId,
    Boolean(activeStudentHasGrade && activeGradeId)
  );

  return {
    activeGradeId,
    studentGradeDetail,
  };
};
