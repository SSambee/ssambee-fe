"use client";

import { useMemo, useState } from "react";

import type {
  AnswerState,
  GradingQuestion,
  GradingStudent,
  QuestionMeta,
} from "@/types/grading";
import { loadDraft } from "@/utils/grading-answers";

import {
  useGradingPrimaryResources,
  useGradingStudentAnswerResource,
} from "./useGradingDataResources";

type UseGradingDataResult = {
  examDetail: ReturnType<typeof useGradingPrimaryResources>["examDetail"];
  isPending: boolean;
  isError: boolean;
  examName: string;
  lectureName: string;
  examSubtitle: string;
  questions: GradingQuestion[];
  defaultAnswers: AnswerState[];
  questionMetaMap: Map<number, QuestionMeta>;
  baseStudents: GradingStudent[];
  baseAnswersByStudent: Record<string, AnswerState[]>;
  selectedStudentId: string;
  activeStudentId: string;
  setSelectedStudentId: (id: string) => void;
};

export const useGradingData = (examId: string): UseGradingDataResult => {
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const { examDetail, isPending, isError, gradeIdByEnrollment } =
    useGradingPrimaryResources(examId);

  const lectureName = examDetail?.lecture?.title ?? "수업 미지정";
  const examName = examDetail?.title ?? "시험";
  const examSubtitle = examDetail?.source ?? "출처 미지정";

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
        {
          score: question.score,
          correctAnswer: question.correctAnswer,
        },
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
      if (!enrollment.hasGrade && draft && draft.length > 0) {
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
        continue;
      }

      next[studentId] = baseAnswers.map((a) => ({ ...a }));
    }
    return next;
  }, [examDetail, examId]);

  const activeStudentId =
    selectedStudentId &&
    baseStudents.some((student) => student.id === selectedStudentId)
      ? selectedStudentId
      : (baseStudents[0]?.id ?? "");

  const activeEnrollment = examDetail?.enrollments?.find(
    (enrollment) => enrollment.lectureEnrollmentId === activeStudentId
  );

  const { studentGradeDetail } = useGradingStudentAnswerResource({
    activeStudentId,
    activeStudentHasGrade: Boolean(activeEnrollment?.hasGrade),
    gradeIdByEnrollment,
  });

  const fetchedAnswersByStudent = useMemo(() => {
    if (!studentGradeDetail || !examDetail) return null;
    const base = (examDetail.questions ?? []).map((question) => ({
      questionNumber: question.questionNumber,
      submittedAnswer: "",
      isCorrect: false,
    }));
    const answerMap = new Map(
      studentGradeDetail.questions.map((question) => [
        question.questionNumber,
        {
          questionNumber: question.questionNumber,
          submittedAnswer: question.submittedAnswer ?? "",
          isCorrect: Boolean(question.isCorrect),
        },
      ])
    );

    return base.map((answer) => answerMap.get(answer.questionNumber) ?? answer);
  }, [examDetail, studentGradeDetail]);

  const mergedAnswersByStudent = useMemo(() => {
    if (!fetchedAnswersByStudent || !activeStudentId) return null;
    return { [activeStudentId]: fetchedAnswersByStudent };
  }, [activeStudentId, fetchedAnswersByStudent]);

  const finalAnswersByStudent = useMemo(() => {
    if (!mergedAnswersByStudent) return baseAnswersByStudent;
    return {
      ...baseAnswersByStudent,
      ...mergedAnswersByStudent,
    };
  }, [baseAnswersByStudent, mergedAnswersByStudent]);

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
    baseAnswersByStudent: finalAnswersByStudent,
    selectedStudentId,
    activeStudentId,
    setSelectedStudentId,
  };
};
