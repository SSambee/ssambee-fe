"use client";

import { useMemo } from "react";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";

import type { GradingStudent } from "@/types/grading";

import { useGradingData } from "./useGradingData";
import { useGradingAnswers } from "./useGradingAnswers";
import { useGradingSummary } from "./useGradingSummary";

export const useGradingPage = () => {
  const params = useParams<{ examId: string }>();
  const examId = params?.examId ?? "";
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const modal = searchParams.get("modal");
  const isResultModalOpen = modal === "result";

  const openResultModal = () => {
    const nextParams = new URLSearchParams(searchParams.toString());
    nextParams.set("modal", "result");
    const query = nextParams.toString();
    router.replace(query ? `${pathname}?${query}` : pathname);
  };

  const closeResultModal = () => {
    const nextParams = new URLSearchParams(searchParams.toString());
    nextParams.delete("modal");
    const query = nextParams.toString();
    router.replace(query ? `${pathname}?${query}` : pathname);
  };

  const {
    examDetail,
    isPending,
    isError,
    examName,
    lectureName,
    examSubtitle,
    questions,
    defaultAnswers,
    questionMetaMap,
    baseStudents,
    baseAnswersByStudent,
    activeStudentId,
    setSelectedStudentId,
  } = useGradingData(examId);

  const answers = useGradingAnswers({
    examId,
    activeStudentId,
    questions,
    questionMetaMap,
    baseAnswersByStudent,
    defaultAnswers,
    onCompleteSuccess: openResultModal,
  });

  const students = useMemo<GradingStudent[]>(() => {
    if (baseStudents.length === 0) return [];
    return baseStudents.map((student) => {
      const override = answers.studentOverrides[student.id];
      return override ? { ...student, ...override } : student;
    });
  }, [baseStudents, answers.studentOverrides]);

  const isCompleted = examDetail?.gradingStatus === "COMPLETED";
  const isAllFinalSaved =
    students.length > 0 && students.every((student) => student.isFinalSaved);
  const canComplete =
    isAllFinalSaved &&
    !isCompleted &&
    !answers.completePending &&
    !answers.submitPending;
  const canViewResult = Boolean(isCompleted);

  const selectedStudent = students.find(
    (student) => student.id === activeStudentId
  );
  const defaultEditing =
    !(selectedStudent?.isFinalSaved ?? false) ||
    Boolean(selectedStudent?.hasDraft);
  const isEditing = answers.editingByStudent[activeStudentId] ?? defaultEditing;
  const isInputDisabled = answers.submitPending || !isEditing;

  const { summary } = useGradingSummary({
    students,
    activeStudentId,
    lectureName,
    questions,
    currentScore: answers.currentScore,
    correctCount: answers.correctCount,
    cutoffScore: examDetail?.cutoffScore ?? 0,
  });

  const canSave =
    Boolean(activeStudentId) && answers.selectedAnswers.length > 0;
  const canTempSave = Boolean(activeStudentId);

  const handleSave = () => {
    if (!canSave) return;
    answers.triggerSave();
  };

  const handleTempSave = () => {
    if (!canTempSave) return;
    answers.triggerTempSave();
  };

  const handleEdit = () => {
    if (isCompleted) {
      const confirmed = confirm("채점 완료된 시험입니다. 수정을 진행할까요?");
      if (!confirmed) return;
    }
    answers.triggerEdit();
  };

  const handleComplete = () => {
    if (!canComplete) return;
    answers.triggerComplete();
  };

  return {
    examDetail,
    isPending,
    isError,
    examName,
    lectureName,
    examSubtitle,
    students,
    selectedStudentId: activeStudentId,
    onSelectStudent: setSelectedStudentId,
    summary,
    gradingQuestions: answers.gradingQuestions,
    handleSelectObjectiveAnswer: answers.handleSelectObjectiveAnswer,
    handleEssayAnswerChange: answers.handleEssayAnswerChange,
    handleEssayCorrectChange: answers.handleEssayCorrectChange,
    handleSave,
    handleTempSave,
    handleEdit,
    handleComplete,
    canSave,
    canTempSave,
    canComplete,
    canViewResult,
    isCompleted,
    isInputDisabled,
    isEditing,
    isResultModalOpen,
    openResultModal,
    closeResultModal,
    isSubmitting: answers.submitPending,
  };
};
