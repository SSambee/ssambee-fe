"use client";

import { useMemo, useState } from "react";

import type {
  ReportAssignmentResult,
  ReportTemplateExamData,
  ScoreHistory,
} from "@/types/report";

export type IncludedCategoryRow = {
  id: string;
  name: string;
  value: string;
};

export const mapIncludedCategoryRowsFromAssignmentResults = (
  assignmentResults?: ReportAssignmentResult[]
): IncludedCategoryRow[] => {
  return (assignmentResults ?? []).map((assignment) => ({
    id: assignment.id,
    name: `${assignment.categoryName} - ${assignment.title}`,
    value: assignment.value,
  }));
};

export const usePremiumReportTemplateState = ({
  examData,
  isCommonSaved,
}: {
  examData: ReportTemplateExamData;
  isCommonSaved: boolean;
}) => {
  const [scoreHistory, setScoreHistory] = useState<ScoreHistory[]>([]);
  const [isScoreHistoryLoading, setIsScoreHistoryLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [reviewTest, setReviewTest] = useState("");
  const [personalMessage, setPersonalMessage] = useState("");
  const [homeworkWord, setHomeworkWord] = useState("");
  const [homeworkTask, setHomeworkTask] = useState("");
  const [homeworkExtra, setHomeworkExtra] = useState("");
  const [isStudentSaved, setIsStudentSaved] = useState(false);
  const [isStudentSaving, setIsStudentSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const attendanceRate = examData.attendance || "-";
  const questionResults = examData.questionResults ?? [];
  const canSendOrDownload = isStudentSaved && isCommonSaved;

  const includedCategoryRows = useMemo(() => {
    return mapIncludedCategoryRowsFromAssignmentResults(
      examData.assignmentResults
    );
  }, [examData.assignmentResults]);

  const includedCategoryNames = includedCategoryRows.map((row) => row.name);
  const missingCategoryCount = includedCategoryRows.filter(
    (row) => row.value === "-" || row.value.trim().length === 0
  ).length;
  const schoolName = examData.schoolName?.trim() || "-";
  const instructorName = examData.instructorName?.trim() || "담당 강사";
  const examType = examData.examType?.trim() || "-";
  const singlePointOnly = scoreHistory.length === 1;
  const totalPages = 2;

  return {
    scoreHistory,
    setScoreHistory,
    isScoreHistoryLoading,
    setIsScoreHistoryLoading,
    currentPage,
    setCurrentPage,
    reviewTest,
    setReviewTest,
    personalMessage,
    setPersonalMessage,
    homeworkWord,
    setHomeworkWord,
    homeworkTask,
    setHomeworkTask,
    homeworkExtra,
    setHomeworkExtra,
    isStudentSaved,
    setIsStudentSaved,
    isStudentSaving,
    setIsStudentSaving,
    isEditing,
    setIsEditing,
    isModalOpen,
    setIsModalOpen,
    isGeneratingPdf,
    setIsGeneratingPdf,
    attendanceRate,
    questionResults,
    canSendOrDownload,
    includedCategoryRows,
    includedCategoryNames,
    missingCategoryCount,
    schoolName,
    instructorName,
    examType,
    singlePointOnly,
    totalPages,
  };
};

export type PremiumReportTemplateState = ReturnType<
  typeof usePremiumReportTemplateState
>;
