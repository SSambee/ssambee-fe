import { useMutation, useQueryClient } from "@tanstack/react-query";

import { lectureKeys } from "@/constants/query-keys";
import { deleteLectureAPI } from "@/services/lectures/lectures.service";

type UseDeleteLectureOptions = {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
};

export const useDeleteLecture = (options?: UseDeleteLectureOptions) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (lectureId: string) => deleteLectureAPI(lectureId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: lectureKeys.lists() });
      queryClient.invalidateQueries({ queryKey: lectureKeys.todays() });
      queryClient.invalidateQueries({ queryKey: lectureKeys.all });
      options?.onSuccess?.();
    },
    onError: (error) => {
      const normalizedError =
        error instanceof Error ? error : new Error(String(error));
      console.error("강의 삭제 실패:", normalizedError.message);
      options?.onError?.(normalizedError);
    },
  });
};
