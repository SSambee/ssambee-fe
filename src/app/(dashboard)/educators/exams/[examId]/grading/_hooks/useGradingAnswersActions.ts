"use client";

import type { GradingStudent } from "@/types/grading";
import type { SubmitGradingPayload } from "@/types/grades";

import { resolveAnswers, saveDraft } from "./gradingAnswers.utils";
import type { GradingAnswersResources } from "./useGradingAnswersResources";
import type { GradingAnswersState } from "./useGradingAnswersState";
import type { AnswerState, QuestionMeta } from "./types";

export const useGradingAnswersActions = ({
  examId,
  activeStudentId,
  questionMetaMap,
  baseAnswersByStudent,
  defaultAnswers,
  state,
  resources,
}: {
  examId: string;
  activeStudentId: string;
  questionMetaMap: Map<number, QuestionMeta>;
  baseAnswersByStudent: Record<string, AnswerState[]>;
  defaultAnswers: AnswerState[];
  state: Pick<
    GradingAnswersState,
    | "selectedAnswers"
    | "currentScore"
    | "correctCount"
    | "setAnswerOverridesByStudent"
    | "setEditingByStudent"
    | "setStudentOverrides"
  >;
  resources: GradingAnswersResources;
}) => {
  const updateAnswersForStudent = (
    studentId: string,
    updater: (current: AnswerState[]) => AnswerState[]
  ) => {
    state.setAnswerOverridesByStudent((prev) => {
      const current = resolveAnswers(
        studentId,
        prev,
        baseAnswersByStudent,
        defaultAnswers
      );
      const next = updater(current);
      return { ...prev, [studentId]: next };
    });
  };

  const handleSelectObjectiveAnswer = (
    questionNumber: number,
    answer: number
  ) => {
    if (!activeStudentId) return;
    const question = questionMetaMap.get(questionNumber);
    const correctAnswer = question?.correctAnswer ?? "";
    const submittedAnswer = String(answer);
    const isCorrect = submittedAnswer === String(correctAnswer);

    updateAnswersForStudent(activeStudentId, (current) =>
      current.map((item) =>
        item.questionNumber === questionNumber
          ? { ...item, submittedAnswer, isCorrect }
          : item
      )
    );
  };

  const handleEssayAnswerChange = (questionNumber: number, value: string) => {
    if (!activeStudentId) return;
    updateAnswersForStudent(activeStudentId, (current) =>
      current.map((item) =>
        item.questionNumber === questionNumber
          ? {
              ...item,
              submittedAnswer: value,
              isCorrect: value.trim().length === 0 ? false : item.isCorrect,
            }
          : item
      )
    );
  };

  const handleEssayCorrectChange = (
    questionNumber: number,
    isCorrect: boolean
  ) => {
    if (!activeStudentId) return;
    updateAnswersForStudent(activeStudentId, (current) =>
      current.map((item) =>
        item.questionNumber === questionNumber ? { ...item, isCorrect } : item
      )
    );
  };

  const triggerSave = () => {
    if (!activeStudentId || state.selectedAnswers.length === 0) return;
    const answersPayload = state.selectedAnswers.map((answer) => ({
      questionNumber: answer.questionNumber,
      submittedAnswer: answer.submittedAnswer,
      isCorrect: answer.isCorrect,
    }));

    const payload: SubmitGradingPayload = {
      lectureEnrollmentId: activeStudentId,
      answers: answersPayload,
      totalScore: state.currentScore,
      correctCount: state.correctCount,
    };

    resources.submitGradingMutation.mutate({ examId, payload });
  };

  const triggerTempSave = () => {
    if (!activeStudentId) return;
    saveDraft(examId, activeStudentId, state.selectedAnswers);
    state.setEditingByStudent((prev) => ({
      ...prev,
      [activeStudentId]: true,
    }));
    state.setStudentOverrides((prev) => ({
      ...prev,
      [activeStudentId]: {
        ...(prev[activeStudentId] ?? ({} as Partial<GradingStudent>)),
        hasDraft: true,
        score: state.currentScore,
      },
    }));
  };

  const triggerEdit = () => {
    if (!activeStudentId) return;
    state.setEditingByStudent((prev) => ({
      ...prev,
      [activeStudentId]: true,
    }));
  };

  const triggerComplete = () => {
    resources.completeGradingMutation.mutate({ examId, payload: {} });
  };

  return {
    handleSelectObjectiveAnswer,
    handleEssayAnswerChange,
    handleEssayCorrectChange,
    triggerSave,
    triggerTempSave,
    triggerEdit,
    triggerComplete,
  };
};
