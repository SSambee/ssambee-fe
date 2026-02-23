import { useQuery } from "@tanstack/react-query";

import { getLearnersDashboardAPI } from "@/services/dashboard/learnersDashboard.service";

export const useLearnersDashboardSVC = () => {
  return useQuery({
    queryKey: ["learnersDashboard"],
    queryFn: getLearnersDashboardAPI,
  });
};
