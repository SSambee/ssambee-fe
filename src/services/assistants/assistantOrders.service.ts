import { axiosClient } from "@/services/axiosClient";
import type { ApiResponse } from "@/types/api";
import type {
  AssistantOrderApi,
  CreateAssistantOrderPayload,
  AssistantOrdersListApi,
  AssistantOrdersListQuery,
  AssistantOrdersStatsApi,
  AssistantOrdersStatsPeriod,
} from "@/types/assistantOrders";

export const fetchAssistantOrdersStatsAPI = async (
  period: AssistantOrdersStatsPeriod = "week"
): Promise<AssistantOrdersStatsApi> => {
  const { data } = await axiosClient.get<ApiResponse<AssistantOrdersStatsApi>>(
    "/assistant-order/stats",
    {
      params: { period },
    }
  );

  if (!data?.data) {
    throw new Error("업무 지시 통계 응답이 비어 있습니다.");
  }

  return data.data;
};

export const fetchAssistantOrdersAPI = async (
  query: AssistantOrdersListQuery = {}
): Promise<AssistantOrdersListApi> => {
  const { data } = await axiosClient.get<ApiResponse<AssistantOrdersListApi>>(
    "/assistant-order",
    {
      params: query,
    }
  );

  return data.data ?? { items: [], orders: [] };
};

export const createAssistantOrderAPI = async (
  payload: CreateAssistantOrderPayload
): Promise<AssistantOrderApi> => {
  const { data } = await axiosClient.post<
    ApiResponse<{ order: AssistantOrderApi }>
  >("/assistant-order", payload);

  if (!data?.data?.order) {
    throw new Error("업무 지시 생성 결과가 비어 있습니다.");
  }

  return data.data.order;
};
