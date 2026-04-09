import { axiosClient } from "@/shared/common/api/axiosClient";
import { ApiResponse } from "@/types/api";
import {
  MgmtAssistantOrdersApi,
  MgmtAssistantOrdersQuery,
  MgmtDashboardApi,
  MgmtStudentPostsApi,
  MgmtStudentPostsQuery,
} from "@/types/dashboard.api";

export const fetchMgmtDashboardAPI = async (): Promise<MgmtDashboardApi> => {
  const { data } =
    await axiosClient.get<ApiResponse<MgmtDashboardApi>>("/dashboard");

  return data.data;
};

export const fetchMgmtStudentPostsAPI = async (
  query: MgmtStudentPostsQuery
): Promise<MgmtStudentPostsApi> => {
  const { data } = await axiosClient.get<ApiResponse<MgmtStudentPostsApi>>(
    "/student-posts",
    {
      params: query,
    }
  );

  return data.data;
};

export const fetchMgmtAssistantOrdersAPI = async (
  query: MgmtAssistantOrdersQuery
): Promise<MgmtAssistantOrdersApi> => {
  const { data } = await axiosClient.get<ApiResponse<MgmtAssistantOrdersApi>>(
    "/assistant-order",
    {
      params: query,
    }
  );

  return data.data;
};
