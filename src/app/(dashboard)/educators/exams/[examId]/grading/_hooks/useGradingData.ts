"use client";

import { useMemo, useState } from "react";

import { useExamDetail } from "@/hooks/exams/useExamDetail";
import type { GradingQuestion, GradingStudent } from "@/types/grading";

import type { AnswerState } from "./types";

type UseGradingDataResult = {
  examDetail: ReturnType<typeof useExamDetail>["data"];
  isPending: boolean;
  isError: boolean;
  examName: string;
  lectureName: string;
  examSubtitle: string;
  questions: GradingQuestion[];
  defaultAnswers: AnswerState[];
  questionMetaMap: Map<
    number,
    { score: number; correctAnswer?: string | number }
  >;
  baseStudents: GradingStudent[];
  baseAnswersByStudent: Record<string, AnswerState[]>;
  selectedStudentId: string;
  activeStudentId: string;
  setSelectedStudentId: (id: string) => void;
};

export const useGradingData = (examId: string): UseGradingDataResult => {
  const {
    data: examDetail,
    isPending,
    isError,
  } = useExamDetail(examId, Boolean(examId));

  const lectureName = examDetail?.lecture?.title ?? "수업 미지정";
  const examName = examDetail?.title ?? "시험";
  const examSubtitle = examDetail?.source ?? "출처 미지정";

  const [selectedStudentId, setSelectedStudentId] = useState("");

  const questions = useMemo<GradingQuestion[]>(() => {
    return (
      examDetail?.questions?.map((question) => ({
        id: question.id,
        number: question.questionNumber,
        title: question.content,
        type: question.type === "MULTIPLE" ? "객관식" : "주관식",
        score: question.score,
        correctAnswer:
          question.type === "MULTIPLE"
            ? Number(question.correctAnswer)
            : question.correctAnswer,
      })) ?? []
    );
  }, [examDetail]);

  const defaultAnswers = useMemo<AnswerState[]>(() => {
    return questions.map((question) => ({
      questionNumber: question.number,
      submittedAnswer: "",
      isCorrect: false,
    }));
  }, [questions]);

  const questionMetaMap = useMemo(() => {
    return new Map(
      examDetail?.questions?.map((question) => [
        question.questionNumber,
        question,
      ]) ?? []
    );
  }, [examDetail]);

  const baseStudents = useMemo<GradingStudent[]>(() => {
    return (
      examDetail?.enrollments?.map((enrollment) => {
        const draft = loadDraft(examId, enrollment.lectureEnrollmentId);
        const hasDraft = Boolean(draft && draft.length > 0);
        return {
          id: enrollment.lectureEnrollmentId,
          name: enrollment.studentName,
          lectureName,
          isFinalSaved: Boolean(enrollment.hasGrade),
          hasDraft: !enrollment.hasGrade && hasDraft,
          score: enrollment.score ?? undefined,
        };
      }) ?? []
    );
  }, [examDetail, examId, lectureName]);

  const baseAnswersByStudent = useMemo<Record<string, AnswerState[]>>(() => {
    if (!examDetail) return {};
    const questionNumbers =
      examDetail.questions?.map((question) => question.questionNumber) ?? [];
    const baseAnswers = questionNumbers.map((number) => ({
      questionNumber: number,
      submittedAnswer: "",
      isCorrect: false,
    }));

    const next: Record<string, AnswerState[]> = {};
    for (const enrollment of examDetail.enrollments ?? []) {
      const studentId = enrollment.lectureEnrollmentId;
      const draft = loadDraft(examId, studentId);
      if (draft && draft.length > 0) {
        const merged = new Map(
          baseAnswers.map((answer) => [answer.questionNumber, answer])
        );
        for (const item of draft) {
          if (!merged.has(item.questionNumber)) continue;
          merged.set(item.questionNumber, {
            questionNumber: item.questionNumber,
            submittedAnswer: item.submittedAnswer ?? "",
            isCorrect: Boolean(item.isCorrect),
          });
        }
        next[studentId] = Array.from(merged.values()).sort(
          (a, b) => a.questionNumber - b.questionNumber
        );
      } else {
        next[studentId] = baseAnswers;
      }
    }
    return next;
  }, [examDetail, examId]);

  const activeStudentId =
    selectedStudentId &&
    baseStudents.some((student) => student.id === selectedStudentId)
      ? selectedStudentId
      : (baseStudents[0]?.id ?? "");

  return {
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
    selectedStudentId,
    activeStudentId,
    setSelectedStudentId,
  };
};

const buildDraftKey = (examId: string, studentId: string) =>
  `grading-draft:${examId}:${studentId}`;

const loadDraft = (examId: string, studentId: string): AnswerState[] | null => {
  if (typeof window === "undefined") return null;
  const key = buildDraftKey(examId, studentId);
  const raw = window.localStorage.getItem(key);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return null;
    return parsed as AnswerState[];
  } catch {
    return null;
  }
};
