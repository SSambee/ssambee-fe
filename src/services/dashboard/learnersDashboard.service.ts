import { ApiResponse } from "@/types/api";
import { LearnersDashboardResponse } from "@/types/dashboard/learnersDashboard";

import { axiosClientSVC } from "../../shared/common/api/axiosClient";

export const getLearnersDashboardAPI = async () => {
  const { data } =
    await axiosClientSVC.get<ApiResponse<LearnersDashboardResponse>>(
      "/dashboard"
    );
  return data.data;
};
