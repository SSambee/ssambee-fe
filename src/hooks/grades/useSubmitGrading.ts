import { useMutation } from "@tanstack/react-query";

import { submitGradingAPI } from "@/services/exams/grades.service";
import type { SubmitGradingPayload } from "@/types/grades";

type SubmitGradingParams = {
  examId: string;
  payload: SubmitGradingPayload;
};

type UseSubmitGradingOptions = {
  onSuccess?: (variables: SubmitGradingParams) => void;
  onError?: (error: Error) => void;
};

export const useSubmitGrading = (options?: UseSubmitGradingOptions) => {
  return useMutation({
    mutationFn: ({ examId, payload }: SubmitGradingParams) =>
      submitGradingAPI(examId, payload),
    onSuccess: (_result, variables) => {
      options?.onSuccess?.(variables);
    },
    onError: (error) => {
      const normalizedError =
        error instanceof Error ? error : new Error(String(error));
      console.error("채점 저장 실패:", normalizedError.message);
      options?.onError?.(normalizedError);
    },
  });
};
