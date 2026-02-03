"use client";

import { useWatch, type UseFormReturn } from "react-hook-form";

import { createDefaultQuestion } from "@/constants/exams.constants";
import type { ExamFormInput } from "@/validation/exam.validation";

type UseExamQuestionsParams = {
  form: UseFormReturn<ExamFormInput>;
  replaceQuestions: (value: ExamFormInput["questions"]) => void;
};

export const useExamQuestions = ({
  form,
  replaceQuestions,
}: UseExamQuestionsParams) => {
  const { control, formState } = form;
  const questions = useWatch({ control, name: "questions" }) || [];
  const autoScore = useWatch({ control, name: "autoScore" }) ?? true;
  const totalQuestions = questions.length;
  const totalScore = questions.reduce(
    (sum, question) => sum + (question?.score ?? 0),
    0
  );
  const questionsErrorMessage =
    typeof formState.errors.questions?.message === "string"
      ? formState.errors.questions?.message
      : undefined;

  const rebalanceScores = (
    items: ExamFormInput["questions"]
  ): ExamFormInput["questions"] => {
    const count = items.length;
    if (count === 0) return items;
    const base = Math.floor(100 / count);
    const remainder = 100 - base * count;

    return items.map((question, index) => ({
      ...question,
      score: base + (index < remainder ? 1 : 0),
    }));
  };

  const handleAddQuestion = () => {
    const current = form.getValues("questions") ?? [];
    const next = [...current, createDefaultQuestion()];
    replaceQuestions(autoScore ? rebalanceScores(next) : next);
  };

  const handleRemoveQuestion = (index: number) => {
    const current = form.getValues("questions") ?? [];
    const next = current.filter((_, idx) => idx !== index);
    replaceQuestions(autoScore ? rebalanceScores(next) : next);
  };

  const handleAutoScoreChange = (value: boolean) => {
    form.setValue("autoScore", value);
    if (value) {
      const current = form.getValues("questions") ?? [];
      replaceQuestions(rebalanceScores(current));
    }
  };

  const handleManualScoreChange = () => {
    if (form.getValues("autoScore")) {
      form.setValue("autoScore", false);
    }
  };

  return {
    questions,
    autoScore,
    totalQuestions,
    totalScore,
    questionsErrorMessage,
    handleAddQuestion,
    handleRemoveQuestion,
    handleAutoScoreChange,
    handleManualScoreChange,
  };
};
