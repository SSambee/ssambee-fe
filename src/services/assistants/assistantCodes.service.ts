import { axiosClient } from "@/shared/common/api/axiosClient";
import type { ApiResponse } from "@/types/api";
import type { AssistantCodeApi } from "@/types/assistants";

export const createAssistantCodeAPI = async (): Promise<AssistantCodeApi> => {
  const { data } = await axiosClient.post<ApiResponse<AssistantCodeApi>>(
    "/assistant-codes",
    {}
  );

  if (!data?.data) {
    throw new Error("조교 인증 코드 생성 결과가 비어 있습니다.");
  }

  return data.data;
};

export const fetchAssistantCodesAPI = async (): Promise<AssistantCodeApi[]> => {
  const { data } =
    await axiosClient.get<ApiResponse<AssistantCodeApi[]>>("/assistant-codes");

  return data.data ?? [];
};
