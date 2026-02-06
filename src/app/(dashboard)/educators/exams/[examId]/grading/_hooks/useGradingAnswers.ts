"use client";

import { useMemo, useState } from "react";

import { useCompleteGrading } from "@/hooks/clinics/useCompleteGrading";
import { calculateExamStatisticsAPI } from "@/services/exams/statistics.service";
import { useSubmitGrading } from "@/hooks/grades/useSubmitGrading";
import type { GradingQuestion, GradingStudent } from "@/types/grading";
import type { SubmitGradingPayload } from "@/types/grades";

import {
  buildAnswerMap,
  buildGradingQuestions,
  clearDraft,
  computeScoreAndCorrectCount,
  resolveAnswers,
  saveDraft,
} from "./gradingAnswers.utils";
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
  const [answerOverridesByStudent, setAnswerOverridesByStudent] = useState<
    Record<string, AnswerState[]>
  >({});
  const [studentOverrides, setStudentOverrides] = useState<
    Record<string, Partial<GradingStudent>>
  >({});
  const [editingByStudent, setEditingByStudent] = useState<
    Record<string, boolean>
  >({});

  const selectedAnswers = useMemo(() => {
    if (!activeStudentId) return defaultAnswers;
    return resolveAnswers(
      activeStudentId,
      answerOverridesByStudent,
      baseAnswersByStudent,
      defaultAnswers
    );
  }, [
    activeStudentId,
    answerOverridesByStudent,
    baseAnswersByStudent,
    defaultAnswers,
  ]);

  const selectedAnswerMap = useMemo(() => {
    return buildAnswerMap(selectedAnswers);
  }, [selectedAnswers]);

  const gradingQuestions: GradingQuestion[] = useMemo(() => {
    return buildGradingQuestions(questions, selectedAnswerMap);
  }, [questions, selectedAnswerMap]);

  const { currentScore, correctCount } = useMemo(() => {
    return computeScoreAndCorrectCount(selectedAnswers, questionMetaMap);
  }, [selectedAnswers, questionMetaMap]);

  const submitGradingMutation = useSubmitGrading({
    onSuccess: (variables) => {
      const targetId = variables.payload.lectureEnrollmentId;
      const savedScore = variables.payload.totalScore;
      clearDraft(examId, targetId);
      setEditingByStudent((prev) => ({
        ...prev,
        [targetId]: false,
      }));
      setStudentOverrides((prev) => ({
        ...prev,
        [targetId]: {
          ...(prev[targetId] ?? {}),
          isFinalSaved: true,
          hasDraft: false,
          score: savedScore,
        },
      }));
    },
    onError: (error) => {
      alert(error.message);
    },
  });

  const completeGradingMutation = useCompleteGrading({
    onSuccess: async () => {
      try {
        await calculateExamStatisticsAPI(examId);
      } catch (err) {
        console.error("통계 갱신 실패:", err);
      } finally {
        onCompleteSuccess();
      }
    },
    onError: (error) => {
      alert(error.message);
    },
  });

  const updateAnswersForStudent = (
    studentId: string,
    updater: (current: AnswerState[]) => AnswerState[]
  ) => {
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

    submitGradingMutation.mutate({ examId, payload });
  };

  const triggerTempSave = () => {
    if (!activeStudentId) return;
    saveDraft(examId, activeStudentId, selectedAnswers);
    setEditingByStudent((prev) => ({
      ...prev,
      [activeStudentId]: true,
    }));
    setStudentOverrides((prev) => ({
      ...prev,
      [activeStudentId]: {
        ...(prev[activeStudentId] ?? {}),
        hasDraft: true,
        score: currentScore,
      },
    }));
  };

  const triggerEdit = () => {
    if (!activeStudentId) return;
    setEditingByStudent((prev) => ({
      ...prev,
      [activeStudentId]: true,
    }));
  };

  const triggerComplete = () => {
    completeGradingMutation.mutate({ examId, payload: {} });
  };

  return {
    selectedAnswers,
    gradingQuestions,
    currentScore,
    correctCount,
    studentOverrides,
    editingByStudent,
    handleSelectObjectiveAnswer,
    handleEssayAnswerChange,
    handleEssayCorrectChange,
    triggerSave,
    triggerTempSave,
    triggerEdit,
    triggerComplete,
    submitPending: submitGradingMutation.isPending,
    completePending: completeGradingMutation.isPending,
  };
};
