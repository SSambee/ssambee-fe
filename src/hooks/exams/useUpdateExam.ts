import { useMutation, useQueryClient } from "@tanstack/react-query";

import { examKeys } from "@/constants/query-keys";
import { updateExamAPI } from "@/services/exams/exams.service";
import type { UpdateExamPayload } from "@/types/exams";

type UpdateExamParams = {
  examId: string;
  payload: UpdateExamPayload;
  lectureId?: string;
};

type UseUpdateExamOptions = {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
};

export const useUpdateExam = (options?: UseUpdateExamOptions) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ examId, payload }: UpdateExamParams) =>
      updateExamAPI(examId, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: examKeys.detail(variables.examId),
      });
      if (variables.lectureId) {
        queryClient.invalidateQueries({
          queryKey: examKeys.listByLecture(variables.lectureId),
        });
      }
      options?.onSuccess?.();
    },
    onError: (error) => {
      const normalizedError =
        error instanceof Error ? error : new Error(String(error));
      console.error("시험 수정 실패:", normalizedError.message);
      options?.onError?.(normalizedError);
    },
  });
};
