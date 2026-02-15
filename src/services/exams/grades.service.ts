import { axiosClient } from "@/services/axiosClient";
import { ApiResponse } from "@/types/api";
import type {
  ExamGradeReportApi,
  ExamGradeApi,
  StudentGradeWithAnswersApi,
  SubmitGradingPayload,
} from "@/types/grades";

type StudentGradeDetailApi = {
  grade: StudentGradeWithAnswersApi;
};

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
  gradeId: string
): Promise<StudentGradeWithAnswersApi> => {
  const { data } = await axiosClient.get<ApiResponse<StudentGradeDetailApi>>(
    `/grades/${gradeId}`
  );

  const grade = data?.data?.grade;

  if (!grade) {
    throw new Error("학생 답안 정보를 찾을 수 없습니다.");
  }

  return grade;
};

export const fetchExamGradeReportAPI = async (
  gradeId: string
): Promise<ExamGradeReportApi> => {
  try {
    const { data } = await axiosClient.get<ApiResponse<ExamGradeReportApi>>(
      `/grades/${gradeId}/report`
    );

    if (!data?.data) {
      return {};
    }

    return data.data;
  } catch (error) {
    console.warn("[grades][report-load] failed", { gradeId, error });
    return {};
  }
};
