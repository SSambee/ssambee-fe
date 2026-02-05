import { useMutation, useQueryClient } from "@tanstack/react-query";

import { examKeys } from "@/constants/query-keys";
import { deleteExamAPI } from "@/services/exams/exams.service";

type DeleteExamParams = {
  examId: string;
  lectureId?: string;
};

type UseDeleteExamOptions = {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
};

export const useDeleteExam = (options?: UseDeleteExamOptions) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ examId }: DeleteExamParams) => deleteExamAPI(examId),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: examKeys.detail(variables.examId),
      });
      queryClient.invalidateQueries({
        queryKey: examKeys.listAll(),
      });
      if (variables.lectureId) {
        queryClient.invalidateQueries({
          queryKey: examKeys.listByLecture(variables.lectureId),
        });
      } else {
        queryClient.invalidateQueries({ queryKey: examKeys.lists() });
      }
      options?.onSuccess?.();
    },
    onError: (error) => {
      const normalizedError =
        error instanceof Error ? error : new Error(String(error));
      console.error("시험 삭제 실패:", normalizedError.message);
      options?.onError?.(normalizedError);
    },
  });
};
