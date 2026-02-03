import { useMutation, useQueryClient } from "@tanstack/react-query";

import { examKeys } from "@/constants/query-keys";
import { completeGradingAPI } from "@/services/exams/clinics.service";
import type {
  CompleteGradingPayload,
  CompleteGradingResponse,
} from "@/types/clinics";

type CompleteGradingParams = {
  examId: string;
  payload?: CompleteGradingPayload;
};

type UseCompleteGradingOptions = {
  onSuccess?: (result: CompleteGradingResponse) => void;
  onError?: (error: Error) => void;
};

export const useCompleteGrading = (options?: UseCompleteGradingOptions) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ examId, payload }: CompleteGradingParams) =>
      completeGradingAPI(examId, payload),
    onSuccess: (result, variables) => {
      queryClient.invalidateQueries({
        queryKey: examKeys.detail(variables.examId),
      });
      options?.onSuccess?.(result);
    },
    onError: (error) => {
      const normalizedError =
        error instanceof Error ? error : new Error(String(error));
      console.error("채점 완료 실패:", normalizedError.message);
      options?.onError?.(normalizedError);
    },
  });
};
