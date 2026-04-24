import { useQuery } from "@tanstack/react-query";

import { examKeys } from "@/constants/query-keys";
import { fetchStudentGradeWithAnswersAPI } from "@/services/exams/grades.service";

const STUDENT_GRADE_STALE_TIME = 1000 * 60 * 5;
const STUDENT_GRADE_GC_TIME = 1000 * 60 * 30;

export const useStudentGradeWithAnswers = (gradeId: string, enabled = true) => {
  return useQuery({
    queryKey: examKeys.gradeDetail(gradeId),
    queryFn: () => fetchStudentGradeWithAnswersAPI(gradeId),
    enabled: Boolean(gradeId) && enabled,
    staleTime: STUDENT_GRADE_STALE_TIME,
    gcTime: STUDENT_GRADE_GC_TIME,
    refetchOnWindowFocus: false,
  });
};
