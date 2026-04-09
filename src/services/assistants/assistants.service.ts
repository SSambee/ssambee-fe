import { axiosClient } from "@/shared/common/api/axiosClient";
import type { ApiResponse } from "@/types/api";
import type {
  AssistantApi,
  AssistantSignAction,
  AssistantsListApi,
  AssistantsQueryStatus,
  AssistantUpdatePayload,
} from "@/types/assistants";

export const fetchAssistantsAPI = async (
  status?: AssistantsQueryStatus
): Promise<AssistantApi[]> => {
  const { data } = await axiosClient.get<ApiResponse<AssistantsListApi>>(
    "/assistants",
    {
      params: status ? { status } : undefined,
    }
  );

  return data.data?.assistants ?? [];
};

export const updateAssistantAPI = async (
  assistantId: string,
  payload: AssistantUpdatePayload
): Promise<AssistantApi> => {
  const { data } = await axiosClient.patch<
    ApiResponse<{ assistant: AssistantApi }>
  >(`/assistants/${assistantId}`, payload);

  if (!data?.data?.assistant) {
    throw new Error("조교 정보 수정 결과가 비어 있습니다.");
  }

  return data.data.assistant;
};

export const signAssistantAPI = async (
  assistantId: string,
  sign: AssistantSignAction
): Promise<AssistantApi> => {
  const { data } = await axiosClient.patch<
    ApiResponse<{ assistant: AssistantApi }>
  >(
    `/assistants/${assistantId}`,
    {},
    {
      params: { sign },
    }
  );

  if (!data?.data?.assistant) {
    throw new Error("조교 상태 처리 결과가 비어 있습니다.");
  }

  return data.data.assistant;
};
