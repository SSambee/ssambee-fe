"use client";

import { useMemo, useState, useSyncExternalStore } from "react";

import {
  defaultReportCategoryStorageConfig,
  readReportCategoryStorageConfig,
  subscribeReportCategoryStorageConfig,
} from "@/services/exams/report-category-persistence.service";
import type { ScoreHistory } from "@/types/report";

import type { ReportTemplateExamData } from "../_types/report-template";

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

  const categoryStorage = useSyncExternalStore(
    subscribeReportCategoryStorageConfig,
    readReportCategoryStorageConfig,
    () => defaultReportCategoryStorageConfig
  );

  const attendanceRate = examData.attendance || "-";
  const questionResults = examData.questionResults ?? [];
  const canSendOrDownload = isStudentSaved && isCommonSaved;

  const includedCategoryRows = useMemo(() => {
    if (examData.assignmentResults && examData.assignmentResults.length > 0) {
      return examData.assignmentResults.map((assignment) => ({
        id: assignment.id,
        name: `${assignment.categoryName} - ${assignment.title}`,
        value: assignment.value,
      }));
    }

    const includedIds = categoryStorage.examCategoryMap[examData.examId] ?? [];
    const studentValues =
      categoryStorage.studentSelections[examData.examId]?.[
        examData.studentId
      ] ?? {};

    return categoryStorage.categories
      .filter((category) => includedIds.includes(category.id))
      .map((category) => ({
        id: category.id,
        name: category.name,
        value: studentValues[category.id] ?? "-",
      }));
  }, [
    categoryStorage,
    examData.assignmentResults,
    examData.examId,
    examData.studentId,
  ]);

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
