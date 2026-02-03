"use client";

import type {
  GradingQuestion,
  GradingSummary,
  GradingStudent,
} from "@/types/grading";

type UseGradingSummaryParams = {
  students: GradingStudent[];
  activeStudentId: string;
  lectureName: string;
  questions: GradingQuestion[];
  currentScore: number;
  correctCount: number;
  cutoffScore: number;
};

export const useGradingSummary = ({
  students,
  activeStudentId,
  lectureName,
  questions,
  currentScore,
  correctCount,
  cutoffScore,
}: UseGradingSummaryParams) => {
  const totalScore = questions.reduce(
    (sum, question) => sum + question.score,
    0
  );

  const summary: GradingSummary = {
    selectedStudentName:
      students.find((student) => student.id === activeStudentId)?.name ?? "-",
    selectedStudentLecture: lectureName,
    currentScore,
    totalScore,
    passingScore: cutoffScore,
    correctCount,
    totalQuestions: questions.length,
    correctRate:
      questions.length > 0
        ? Math.round((correctCount / questions.length) * 100)
        : 0,
    isPassed: currentScore >= cutoffScore,
  };

  return {
    totalScore,
    summary,
  };
};
