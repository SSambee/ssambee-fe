"use client";

import { useCompleteGrading } from "@/hooks/clinics/useCompleteGrading";
import { useSubmitGrading } from "@/hooks/grades/useSubmitGrading";
import { calculateExamStatisticsAPI } from "@/services/exams/statistics.service";
import { clearDraft } from "@/utils/grading-answers";

import type { GradingAnswersState } from "./useGradingAnswersState";

type AlertFn = (payload: {
  title: string;
  description: string;
}) => Promise<void> | void;

export const useGradingAnswersResources = ({
  examId,
  showAlert,
  onCompleteSuccess,
  state,
}: {
  examId: string;
  showAlert: AlertFn;
  onCompleteSuccess: () => void;
  state: Pick<
    GradingAnswersState,
    "setEditingByStudent" | "setStudentOverrides"
  >;
}) => {
  const submitGradingMutation = useSubmitGrading({
    onSuccess: (variables) => {
      const targetId = variables.payload.lectureEnrollmentId;
      const savedScore = variables.payload.totalScore;
      clearDraft(examId, targetId);
      state.setEditingByStudent((prev) => ({
        ...prev,
        [targetId]: false,
      }));
      state.setStudentOverrides((prev) => ({
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
      void showAlert({
        title: "채점 저장 실패",
        description: error.message,
      });
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
      void showAlert({
        title: "채점 완료 실패",
        description: error.message,
      });
    },
  });

  return {
    submitGradingMutation,
    completeGradingMutation,
  };
};

export type GradingAnswersResources = ReturnType<
  typeof useGradingAnswersResources
>;
