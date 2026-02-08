import { axiosClient } from "@/services/axiosClient";
import { ApiResponse } from "@/types/api";
import type {
  ExamGradeReportApi,
  ExamGradeApi,
  StudentGradeWithAnswersApi,
  SubmitGradingPayload,
} from "@/types/grades";

export const fetchExamGradesAPI = async (
  examId: string
): Promise<ExamGradeApi[]> => {
  const { data } = await axiosClient.get<ApiResponse<ExamGradeApi[]>>(
    `/exams/${examId}/grades`
  );

  return data.data ?? [];
};

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

export const fetchExamGradeReportAPI = async (
  examId: string,
  lectureEnrollmentId: string
): Promise<ExamGradeReportApi> => {
  const { data } = await axiosClient.get<ApiResponse<ExamGradeReportApi>>(
    `/exams/${examId}/grades/lectureEnrollments/${lectureEnrollmentId}/report`
  );

  if (!data?.data) {
    throw new Error("성적표 리포트 정보를 찾을 수 없습니다.");
  }

  return data.data;
};
