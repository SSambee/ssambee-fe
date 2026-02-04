import { useMutation, useQueryClient } from "@tanstack/react-query";

import { lectureKeys } from "@/constants/query-keys";
import {
  createLectureAPI,
  LectureCreatePayload,
} from "@/services/lectures/lectures.service";

type UseCreateLectureOptions = {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
};

export const useCreateLecture = (options?: UseCreateLectureOptions) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: LectureCreatePayload) => createLectureAPI(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: lectureKeys.lists() });
      queryClient.invalidateQueries({ queryKey: lectureKeys.todays() });
      queryClient.invalidateQueries({ queryKey: lectureKeys.all });
      options?.onSuccess?.();
    },
    onError: (error) => {
      const normalizedError =
        error instanceof Error ? error : new Error(String(error));
      console.error("강의 생성 실패:", normalizedError.message);
      options?.onError?.(normalizedError);
    },
  });
};
