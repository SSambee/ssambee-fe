import { axiosClient } from "@/shared/common/api/axiosClient";
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

export const fetchExamsAllAPI = async (): Promise<ExamApi[]> => {
  const { data } = await axiosClient.get<ApiResponse<ExamApi[]>>(`/exams`);

  return data.data ?? [];
};

export const fetchExamDetailAPI = async (
  examId: string
): Promise<ExamDetailApi> => {
  const { data } = await axiosClient.get<ApiResponse<ExamDetailApi>>(
    `/exams/${examId}`
  );

  if (!data?.data) {
    throw new Error(`시험 정보를 찾을 수 없습니다. (ID: ${examId})`);
  }

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

  if (!data?.data) {
    throw new Error("시험 생성 결과가 비어 있습니다.");
  }

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

  if (!data?.data) {
    throw new Error(`시험 수정 결과가 비어 있습니다. (ID: ${examId})`);
  }

  return data.data;
};

export const deleteExamAPI = async (examId: string): Promise<void> => {
  await axiosClient.delete(`/exams/${examId}`);
};
