"use client";

import { useCallback, useMemo, useState } from "react";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";

import { CheckModal } from "@/components/common/modals/CheckModal";
import { useModal } from "@/providers/ModalProvider";
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
  const [requiresRecomplete, setRequiresRecomplete] = useState(false);
  const { openModal } = useModal();

  const updateResultModal = (nextOpen: boolean) => {
    const nextParams = new URLSearchParams(searchParams.toString());
    if (nextOpen) {
      nextParams.set("modal", "result");
    } else {
      nextParams.delete("modal");
    }
    const query = nextParams.toString();
    router.replace(query ? `${pathname}?${query}` : pathname);
  };

  const openResultModal = () => updateResultModal(true);
  const closeResultModal = () => updateResultModal(false);

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
    onCompleteSuccess: () => {
      setRequiresRecomplete(false);
    },
  });
  const { triggerSave, triggerTempSave, triggerEdit, triggerComplete } =
    answers;

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
    (!isCompleted || requiresRecomplete) &&
    !answers.completePending &&
    !answers.submitPending;
  const canViewResult = Boolean(isCompleted && !requiresRecomplete);

  const selectedStudent = students.find(
    (student) => student.id === activeStudentId
  );
  const activeStudentIndex = students.findIndex(
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
  const canSaveAndNext = canSave && isEditing;

  const handleSave = () => {
    if (!canSave) return;
    triggerSave();
  };

  const handleSaveAndSelectNext = useCallback(() => {
    if (!canSave || !activeStudentId) return;

    const currentIndex = students.findIndex(
      (student) => student.id === activeStudentId
    );
    const nextStudentId =
      currentIndex >= 0 && currentIndex < students.length - 1
        ? students[currentIndex + 1].id
        : null;

    triggerSave(() => {
      if (!nextStudentId) return;
      setSelectedStudentId(nextStudentId);
    });
  }, [activeStudentId, canSave, setSelectedStudentId, students, triggerSave]);

  const handleTempSave = () => {
    if (!canTempSave) return;
    triggerTempSave();
  };

  const handleEdit = () => {
    if (isCompleted) {
      openModal(
        <CheckModal
          title="채점 완료된 시험입니다."
          description="수정을 진행할까요?"
          confirmText="수정하기"
          cancelText="취소"
          onConfirm={() => {
            setRequiresRecomplete(true);
            triggerEdit();
          }}
        />
      );
      return;
    }
    triggerEdit();
  };

  const handleComplete = () => {
    if (!canComplete) return;
    openModal(
      <CheckModal
        title="채점을 완료할까요?"
        description="클리닉 생성이 함께 진행되며, 완료 후에는 결과 확인만 가능합니다."
        confirmText="전체 완료"
        cancelText="취소"
        onConfirm={() => {
          triggerComplete();
        }}
      />
    );
  };

  const handleSelectPrevStudent = useCallback(() => {
    if (activeStudentIndex <= 0) return;
    setSelectedStudentId(students[activeStudentIndex - 1].id);
  }, [activeStudentIndex, setSelectedStudentId, students]);

  const handleSelectNextStudent = useCallback(() => {
    if (activeStudentIndex < 0 || activeStudentIndex >= students.length - 1)
      return;
    setSelectedStudentId(students[activeStudentIndex + 1].id);
  }, [activeStudentIndex, setSelectedStudentId, students]);

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
    onSelectPrevStudent: handleSelectPrevStudent,
    onSelectNextStudent: handleSelectNextStudent,
    summary,
    gradingQuestions: answers.gradingQuestions,
    handleSelectObjectiveAnswer: answers.handleSelectObjectiveAnswer,
    handleEssayAnswerChange: answers.handleEssayAnswerChange,
    handleEssayCorrectChange: answers.handleEssayCorrectChange,
    handleSave,
    handleSaveAndSelectNext,
    handleTempSave,
    handleEdit,
    handleComplete,
    canSave,
    canSaveAndNext,
    canTempSave,
    canComplete,
    canViewResult,
    requiresRecomplete,
    isCompleted,
    isInputDisabled,
    isEditing,
    isResultModalOpen,
    openResultModal,
    closeResultModal,
    isSubmitting: answers.submitPending,
  };
};
