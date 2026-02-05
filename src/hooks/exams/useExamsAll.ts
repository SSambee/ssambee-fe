import { useQuery } from "@tanstack/react-query";

import { examKeys } from "@/constants/query-keys";
import { fetchExamsAllAPI } from "@/services/exams/exams.service";

export const useExamsAll = (enabled = true) => {
  return useQuery({
    queryKey: examKeys.listAll(),
    queryFn: fetchExamsAllAPI,
    enabled,
    staleTime: 1000 * 30,
    refetchOnWindowFocus: false,
  });
};
