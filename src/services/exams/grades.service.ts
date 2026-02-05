import { axiosClient } from "@/services/axiosClient";
import { ApiResponse } from "@/types/api";
import type {
  StudentGradeWithAnswersApi,
  SubmitGradingPayload,
} from "@/types/grades";

export const submitGradingAPI = async (
  examId: string,
  payload: SubmitGradingPayload
) => {
  const { data } = await axiosClient.post<ApiResponse<unknown>>(
    `/exams/${examId}/grades`,
    payload
  );

  return data.data;
};

export const fetchStudentGradeWithAnswersAPI = async (
  examId: string,
  lectureEnrollmentId: string
): Promise<StudentGradeWithAnswersApi> => {
  const { data } = await axiosClient.get<
    ApiResponse<StudentGradeWithAnswersApi>
  >(`/exams/${examId}/grades/lectureEnrollments/${lectureEnrollmentId}`);

  if (!data?.data) {
    throw new Error("학생 답안 정보를 찾을 수 없습니다.");
  }

  return data.data;
};
