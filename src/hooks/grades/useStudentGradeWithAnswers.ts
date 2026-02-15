import { useQuery } from "@tanstack/react-query";

import { examKeys } from "@/constants/query-keys";
import { fetchStudentGradeWithAnswersAPI } from "@/services/exams/grades.service";

export const useStudentGradeWithAnswers = (gradeId: string, enabled = true) => {
  return useQuery({
    queryKey: examKeys.gradeDetail(gradeId),
    queryFn: () => fetchStudentGradeWithAnswersAPI(gradeId),
    enabled: Boolean(gradeId) && enabled,
    staleTime: 1000 * 30,
    refetchOnWindowFocus: false,
  });
};
