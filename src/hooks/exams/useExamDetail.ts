import { useQuery } from "@tanstack/react-query";

import { examKeys } from "@/constants/query-keys";
import { fetchExamDetailAPI } from "@/services/exams/exams.service";

export const useExamDetail = (examId: string, enabled = true) => {
  return useQuery({
    queryKey: examKeys.detail(examId),
    queryFn: () => fetchExamDetailAPI(examId),
    enabled: enabled && Boolean(examId),
    staleTime: 1000 * 30,
    refetchOnWindowFocus: false,
  });
};
