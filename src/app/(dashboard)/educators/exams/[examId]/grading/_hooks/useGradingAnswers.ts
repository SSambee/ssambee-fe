"use client";

import { useMemo, useState } from "react";

import { useCompleteGrading } from "@/hooks/clinics/useCompleteGrading";
import { useSubmitGrading } from "@/hooks/grades/useSubmitGrading";
import type { GradingQuestion, GradingStudent } from "@/types/grading";
import type { SubmitGradingPayload } from "@/types/grades";

import type { AnswerState } from "./types";

type UseGradingAnswersParams = {
  examId: string;
  activeStudentId: string;
  questions: GradingQuestion[];
  questionMetaMap: Map<
    number,
    { score: number; correctAnswer?: string | number }
  >;
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
    return (
      answerOverridesByStudent[activeStudentId] ??
      baseAnswersByStudent[activeStudentId] ??
      defaultAnswers
    );
  }, [
    activeStudentId,
    answerOverridesByStudent,
    baseAnswersByStudent,
    defaultAnswers,
  ]);

  const selectedAnswerMap = useMemo(() => {
    return new Map(
      selectedAnswers.map((answer) => [answer.questionNumber, answer])
    );
  }, [selectedAnswers]);

  const gradingQuestions: GradingQuestion[] = useMemo(() => {
    return questions.map((question) => {
      const answer = selectedAnswerMap.get(question.number);
      const submittedAnswer = answer?.submittedAnswer ?? "";
      const hasAnswer = submittedAnswer.trim().length > 0;
      const status = !hasAnswer
        ? "미입력"
        : answer?.isCorrect
          ? "정답"
          : "오답";

      return {
        ...question,
        studentAnswer:
          question.type === "객관식"
            ? submittedAnswer
              ? Number(submittedAnswer)
              : undefined
            : submittedAnswer || undefined,
        status,
      };
    });
  }, [questions, selectedAnswerMap]);

  const { currentScore, correctCount } = useMemo(() => {
    let score = 0;
    let correct = 0;
    for (const answer of selectedAnswers) {
      if (!answer.isCorrect) continue;
      const question = questionMetaMap.get(answer.questionNumber);
      if (!question) continue;
      score += question.score;
      correct += 1;
    }
    return { currentScore: score, correctCount: correct };
  }, [questionMetaMap, selectedAnswers]);

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
    onSuccess: () => {
      onCompleteSuccess();
    },
    onError: (error) => {
      alert(error.message);
    },
  });

  const handleSelectObjectiveAnswer = (
    questionNumber: number,
    answer: number
  ) => {
    if (!activeStudentId) return;
    const question = questionMetaMap.get(questionNumber);
    const correctAnswer = question?.correctAnswer ?? "";
    const submittedAnswer = String(answer);
    const isCorrect = submittedAnswer === String(correctAnswer);

    setAnswerOverridesByStudent((prev) => {
      const current =
        prev[activeStudentId] ??
        baseAnswersByStudent[activeStudentId] ??
        defaultAnswers;
      const next = current.map((item) =>
        item.questionNumber === questionNumber
          ? { ...item, submittedAnswer, isCorrect }
          : item
      );
      return { ...prev, [activeStudentId]: next };
    });
  };

  const handleEssayAnswerChange = (questionNumber: number, value: string) => {
    if (!activeStudentId) return;
    setAnswerOverridesByStudent((prev) => {
      const current =
        prev[activeStudentId] ??
        baseAnswersByStudent[activeStudentId] ??
        defaultAnswers;
      const next = current.map((item) =>
        item.questionNumber === questionNumber
          ? {
              ...item,
              submittedAnswer: value,
              isCorrect: value.trim().length === 0 ? false : item.isCorrect,
            }
          : item
      );
      return { ...prev, [activeStudentId]: next };
    });
  };

  const handleEssayCorrectChange = (
    questionNumber: number,
    isCorrect: boolean
  ) => {
    if (!activeStudentId) return;
    setAnswerOverridesByStudent((prev) => {
      const current =
        prev[activeStudentId] ??
        baseAnswersByStudent[activeStudentId] ??
        defaultAnswers;
      const next = current.map((item) =>
        item.questionNumber === questionNumber ? { ...item, isCorrect } : item
      );
      return { ...prev, [activeStudentId]: next };
    });
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
    const confirmed = confirm(
      "채점을 완료하고 클리닉을 생성할까요? 이 작업은 되돌릴 수 없습니다."
    );
    if (!confirmed) return;
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

const buildDraftKey = (examId: string, studentId: string) =>
  `grading-draft:${examId}:${studentId}`;

const saveDraft = (
  examId: string,
  studentId: string,
  answers: AnswerState[]
) => {
  if (typeof window === "undefined") return;
  const key = buildDraftKey(examId, studentId);
  window.localStorage.setItem(key, JSON.stringify(answers));
};

const clearDraft = (examId: string, studentId: string) => {
  if (typeof window === "undefined") return;
  const key = buildDraftKey(examId, studentId);
  window.localStorage.removeItem(key);
};
