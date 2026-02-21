import { axiosClient } from "@/services/axiosClient";
import type { ApiResponse } from "@/types/api";

export type AssignmentResultBulkItem = {
  assignmentId: string;
  lectureEnrollmentId: string;
  resultIndex: number | null;
};

export type UpsertAssignmentResultsPayload = {
  options?: {
    strict?: boolean;
  };
  items: AssignmentResultBulkItem[];
};

export const upsertAssignmentResultsAPI = async (
  payload: UpsertAssignmentResultsPayload
): Promise<unknown> => {
  const response = await axiosClient.put<ApiResponse<unknown>>(
    "/assignment-results",
    payload
  );

  return response.data.data;
};
