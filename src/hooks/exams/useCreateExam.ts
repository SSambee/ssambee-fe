import { useMutation, useQueryClient } from "@tanstack/react-query";

import { examKeys } from "@/constants/query-keys";
import { createExamAPI } from "@/services/exams/exams.service";
import type { CreateExamPayload } from "@/types/exams";

type CreateExamParams = {
  lectureId: string;
  payload: CreateExamPayload;
};

type UseCreateExamOptions = {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
};

export const useCreateExam = (options?: UseCreateExamOptions) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ lectureId, payload }: CreateExamParams) =>
      createExamAPI(lectureId, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: examKeys.listByLecture(variables.lectureId),
      });
      queryClient.invalidateQueries({
        queryKey: examKeys.listAll(),
      });
      options?.onSuccess?.();
    },
    onError: (error) => {
      const normalizedError =
        error instanceof Error ? error : new Error(String(error));
      console.error("시험 생성 실패:", normalizedError.message);
      options?.onError?.(normalizedError);
    },
  });
};
