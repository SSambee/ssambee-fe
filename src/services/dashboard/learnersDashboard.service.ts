import { ApiResponse } from "@/types/api";
import { LearnersDashboardResponse } from "@/types/dashboard/learnersDashboard";

import { axiosClientSVC } from "../axiosClient";

export const getLearnersDashboardAPI = async () => {
  const { data } =
    await axiosClientSVC.get<ApiResponse<LearnersDashboardResponse>>(
      "/dashboard"
    );
  return data.data;
};
