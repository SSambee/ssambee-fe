import { axiosClient } from "@/services/axiosClient";
import { ApiResponse } from "@/types/api";
import type {
  CreateExamPayload,
  ExamApi,
  ExamDetailApi,
  UpdateExamPayload,
} from "@/types/exams";

export const fetchExamsByLectureAPI = async (
  lectureId: string
): Promise<ExamApi[]> => {
  const { data } = await axiosClient.get<ApiResponse<ExamApi[]>>(
    `/lectures/${lectureId}/exams`
  );

  return data.data ?? [];
};

export const fetchExamDetailAPI = async (
  examId: string
): Promise<ExamDetailApi> => {
  const { data } = await axiosClient.get<ApiResponse<ExamDetailApi>>(
    `/exams/${examId}`
  );

  return data.data;
};

export const createExamAPI = async (
  lectureId: string,
  payload: CreateExamPayload
): Promise<ExamDetailApi> => {
  const { data } = await axiosClient.post<ApiResponse<ExamDetailApi>>(
    `/lectures/${lectureId}/exams`,
    payload
  );

  return data.data;
};

export const updateExamAPI = async (
  examId: string,
  payload: UpdateExamPayload
): Promise<ExamDetailApi> => {
  const { data } = await axiosClient.patch<ApiResponse<ExamDetailApi>>(
    `/exams/${examId}`,
    payload
  );

  return data.data;
};
