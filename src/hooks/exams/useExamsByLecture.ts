import { useQuery } from "@tanstack/react-query";

import { examKeys } from "@/constants/query-keys";
import { fetchExamsByLectureAPI } from "@/services/exams/exams.service";

export const useExamsByLecture = (lectureId?: string) => {
  return useQuery({
    queryKey: examKeys.listByLecture(lectureId ?? "__none__"),
    queryFn: () => fetchExamsByLectureAPI(lectureId ?? ""),
    enabled: Boolean(lectureId),
    staleTime: 1000 * 30,
    refetchOnWindowFocus: false,
  });
};
