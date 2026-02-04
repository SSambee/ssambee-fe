import { axiosClient } from "@/services/axiosClient";
import { ApiResponse } from "@/types/api";
import type {
  CompleteGradingPayload,
  CompleteGradingResponse,
} from "@/types/clinics";

export const completeGradingAPI = async (
  examId: string,
  payload: CompleteGradingPayload = {}
): Promise<CompleteGradingResponse> => {
  const { data } = await axiosClient.post<ApiResponse<CompleteGradingResponse>>(
    `/exams/${examId}/grades/complete`,
    payload
  );

  return data.data;
};
