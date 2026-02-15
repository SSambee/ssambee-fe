"use client";

import { useMemo, useState } from "react";

import type { GradingQuestion, GradingStudent } from "@/types/grading";

import {
  buildAnswerMap,
  buildGradingQuestions,
  computeScoreAndCorrectCount,
  resolveAnswers,
} from "./gradingAnswers.utils";
import type { AnswerState, QuestionMeta } from "./types";

export type UseGradingAnswersStateParams = {
  activeStudentId: string;
  questions: GradingQuestion[];
  questionMetaMap: Map<number, QuestionMeta>;
  baseAnswersByStudent: Record<string, AnswerState[]>;
  defaultAnswers: AnswerState[];
};

export const useGradingAnswersState = ({
  activeStudentId,
  questions,
  questionMetaMap,
  baseAnswersByStudent,
  defaultAnswers,
}: UseGradingAnswersStateParams) => {
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

  return {
    answerOverridesByStudent,
    setAnswerOverridesByStudent,
    studentOverrides,
    setStudentOverrides,
    editingByStudent,
    setEditingByStudent,
    selectedAnswers,
    selectedAnswerMap,
    gradingQuestions,
    currentScore,
    correctCount,
  };
};

export type GradingAnswersState = ReturnType<typeof useGradingAnswersState>;
