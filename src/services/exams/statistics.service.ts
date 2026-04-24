import { axiosClient } from "@/services/axiosClient";
import { ApiResponse } from "@/types/api";
import type { ExamStatisticsApi } from "@/types/exams";

export const fetchExamStatisticsAPI = async (
  examId: string
): Promise<ExamStatisticsApi> => {
  const { data } = await axiosClient.get<ApiResponse<ExamStatisticsApi>>(
    `/exams/${examId}/statistics`
  );

  if (!data?.data) {
    throw new Error("시험 통계 정보를 찾을 수 없습니다.");
  }

  return data.data;
};

export const calculateExamStatisticsAPI = async (
  examId: string
): Promise<ExamStatisticsApi | null> => {
  const { data } = await axiosClient.post<ApiResponse<ExamStatisticsApi | []>>(
    `/exams/${examId}/statistics`
  );

  const payload = data?.data;
  if (!payload || Array.isArray(payload)) {
    return null;
  }
  return payload;
};
