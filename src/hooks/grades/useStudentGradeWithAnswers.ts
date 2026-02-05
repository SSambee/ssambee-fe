import { useQuery } from "@tanstack/react-query";

import { examKeys } from "@/constants/query-keys";
import { fetchStudentGradeWithAnswersAPI } from "@/services/exams/grades.service";

export const useStudentGradeWithAnswers = (
  examId: string,
  lectureEnrollmentId: string,
  enabled = true
) => {
  return useQuery({
    queryKey: examKeys.gradeDetail(examId, lectureEnrollmentId),
    queryFn: () => fetchStudentGradeWithAnswersAPI(examId, lectureEnrollmentId),
    enabled: Boolean(examId) && Boolean(lectureEnrollmentId) && enabled,
    staleTime: 1000 * 30,
    refetchOnWindowFocus: false,
  });
};
