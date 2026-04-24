import { axiosClient } from "@/services/axiosClient";
import type { ApiResponse } from "@/types/api";

export type AssignmentListItem = {
  id: string;
  title: string;
  lectureId: string;
  categoryId: string;
  category?: {
    id: string;
    name: string;
    resultPresets?: string[];
  };
};

export type CreateAssignmentPayload = {
  title: string;
  categoryId: string;
};

export const createAssignmentAPI = async (
  lectureId: string,
  payload: CreateAssignmentPayload
): Promise<AssignmentListItem> => {
  const response = await axiosClient.post<ApiResponse<AssignmentListItem>>(
    `/lectures/${lectureId}/assignments`,
    payload
  );

  if (!response.data.data) {
    throw new Error("과제 생성 응답 데이터가 없습니다.");
  }

  return response.data.data;
};

export const fetchAssignmentsAPI = async (
  lectureId?: string
): Promise<AssignmentListItem[]> => {
  const response = await axiosClient.get<ApiResponse<AssignmentListItem[]>>(
    "/assignments",
    {
      params: lectureId ? { lectureId } : undefined,
    }
  );

  return response.data.data ?? [];
};

export const deleteAssignmentAPI = async (
  assignmentId: string
): Promise<void> => {
  await axiosClient.delete<ApiResponse<unknown>>(
    `/assignments/${assignmentId}`
  );
};
