import { axiosClient } from "@/shared/common/api/axiosClient";
import type { ApiResponse } from "@/types/api";

export type ExamReportAssignment = {
  assignmentId: string;
  [key: string]: unknown;
  assignment: {
    id: string;
    title: string;
    categoryId: string;
    [key: string]: unknown;
    category: {
      id: string;
      name: string;
      resultPresets?: string[];
      [key: string]: unknown;
    };
  };
};

export type UpdateExamReportAssignmentsPayload = {
  assignments: string[];
};

export const getExamReportAssignmentsAPI = async (
  examId: string
): Promise<ExamReportAssignment[]> => {
  const response = await axiosClient.get<ApiResponse<ExamReportAssignment[]>>(
    `/exams/${examId}/report/assignments`
  );

  return response.data.data ?? [];
};

export const updateExamReportAssignmentsAPI = async (
  examId: string,
  payload: UpdateExamReportAssignmentsPayload
): Promise<ExamReportAssignment[]> => {
  const response = await axiosClient.put<ApiResponse<ExamReportAssignment[]>>(
    `/exams/${examId}/report/assignments`,
    payload
  );

  return response.data.data ?? [];
};
