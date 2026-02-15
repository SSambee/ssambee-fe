"use client";

import { useDialogAlert } from "@/hooks/useDialogAlert";
import type { GradingQuestion } from "@/types/grading";

import { useGradingAnswersActions } from "./useGradingAnswersActions";
import { useGradingAnswersResources } from "./useGradingAnswersResources";
import { useGradingAnswersState } from "./useGradingAnswersState";
import type { AnswerState, QuestionMeta } from "./types";

type UseGradingAnswersParams = {
  examId: string;
  activeStudentId: string;
  questions: GradingQuestion[];
  questionMetaMap: Map<number, QuestionMeta>;
  baseAnswersByStudent: Record<string, AnswerState[]>;
  defaultAnswers: AnswerState[];
  onCompleteSuccess: () => void;
};

export const useGradingAnswers = ({
  examId,
  activeStudentId,
  questions,
  questionMetaMap,
  baseAnswersByStudent,
  defaultAnswers,
  onCompleteSuccess,
}: UseGradingAnswersParams) => {
  const { showAlert } = useDialogAlert();

  const state = useGradingAnswersState({
    activeStudentId,
    questions,
    questionMetaMap,
    baseAnswersByStudent,
    defaultAnswers,
  });

  const resources = useGradingAnswersResources({
    examId,
    showAlert,
    onCompleteSuccess,
    state,
  });

  const actions = useGradingAnswersActions({
    examId,
    activeStudentId,
    questionMetaMap,
    baseAnswersByStudent,
    defaultAnswers,
    state,
    resources,
  });

  return {
    selectedAnswers: state.selectedAnswers,
    gradingQuestions: state.gradingQuestions,
    currentScore: state.currentScore,
    correctCount: state.correctCount,
    studentOverrides: state.studentOverrides,
    editingByStudent: state.editingByStudent,
    handleSelectObjectiveAnswer: actions.handleSelectObjectiveAnswer,
    handleEssayAnswerChange: actions.handleEssayAnswerChange,
    handleEssayCorrectChange: actions.handleEssayCorrectChange,
    triggerSave: actions.triggerSave,
    triggerTempSave: actions.triggerTempSave,
    triggerEdit: actions.triggerEdit,
    triggerComplete: actions.triggerComplete,
    submitPending: resources.submitGradingMutation.isPending,
    completePending: resources.completeGradingMutation.isPending,
  };
};
