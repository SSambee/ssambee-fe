"use client";

import { useCallback } from "react";

import type { GradingStudent } from "@/types/grading";
import type { SubmitGradingPayload } from "@/types/grades";
import { resolveAnswers, saveDraft } from "@/utils/grading-answers";
import type { AnswerState, QuestionMeta } from "@/types/grading";

import type { GradingAnswersResources } from "./useGradingAnswersResources";
import type { GradingAnswersState } from "./useGradingAnswersState";

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
  const {
    selectedAnswers,
    currentScore,
    correctCount,
    setAnswerOverridesByStudent,
    setEditingByStudent,
    setStudentOverrides,
  } = state;
  const { submitGradingMutation, completeGradingMutation } = resources;

  const updateAnswersForStudent = useCallback(
    (studentId: string, updater: (current: AnswerState[]) => AnswerState[]) => {
      setAnswerOverridesByStudent((prev) => {
        const current = resolveAnswers(
          studentId,
          prev,
          baseAnswersByStudent,
          defaultAnswers
        );
        const next = updater(current);
        return { ...prev, [studentId]: next };
      });
    },
    [baseAnswersByStudent, defaultAnswers, setAnswerOverridesByStudent]
  );

  const handleSelectObjectiveAnswer = useCallback(
    (questionNumber: number, answer: number) => {
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
    },
    [activeStudentId, questionMetaMap, updateAnswersForStudent]
  );

  const handleEssayAnswerChange = useCallback(
    (questionNumber: number, value: string) => {
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
    },
    [activeStudentId, updateAnswersForStudent]
  );

  const handleEssayCorrectChange = useCallback(
    (questionNumber: number, isCorrect: boolean) => {
      if (!activeStudentId) return;
      updateAnswersForStudent(activeStudentId, (current) =>
        current.map((item) =>
          item.questionNumber === questionNumber ? { ...item, isCorrect } : item
        )
      );
    },
    [activeStudentId, updateAnswersForStudent]
  );

  const triggerSave = useCallback(
    (onSuccess?: () => void) => {
      if (!activeStudentId || selectedAnswers.length === 0) return;
      const answersPayload = selectedAnswers.map((answer) => ({
        questionNumber: answer.questionNumber,
        submittedAnswer: answer.submittedAnswer,
        isCorrect: answer.isCorrect,
      }));

      const payload: SubmitGradingPayload = {
        lectureEnrollmentId: activeStudentId,
        answers: answersPayload,
        totalScore: currentScore,
        correctCount,
      };

      submitGradingMutation.mutate(
        { examId, payload },
        {
          onSuccess: () => {
            onSuccess?.();
          },
        }
      );
    },
    [
      activeStudentId,
      correctCount,
      currentScore,
      examId,
      selectedAnswers,
      submitGradingMutation,
    ]
  );

  const triggerTempSave = useCallback(() => {
    if (!activeStudentId) return;
    saveDraft(examId, activeStudentId, selectedAnswers);
    setEditingByStudent((prev) => ({
      ...prev,
      [activeStudentId]: true,
    }));
    setStudentOverrides((prev) => ({
      ...prev,
      [activeStudentId]: {
        ...(prev[activeStudentId] ?? ({} as Partial<GradingStudent>)),
        hasDraft: true,
        score: currentScore,
      },
    }));
  }, [
    activeStudentId,
    currentScore,
    examId,
    selectedAnswers,
    setEditingByStudent,
    setStudentOverrides,
  ]);

  const triggerEdit = useCallback(() => {
    if (!activeStudentId) return;
    setEditingByStudent((prev) => ({
      ...prev,
      [activeStudentId]: true,
    }));
  }, [activeStudentId, setEditingByStudent]);

  const triggerComplete = useCallback(() => {
    completeGradingMutation.mutate({ examId, payload: {} });
  }, [completeGradingMutation, examId]);

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
