import { axiosClient } from "@/services/axiosClient";
import { ApiResponse } from "@/types/api";
import type { SubmitGradingPayload } from "@/types/grades";

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
