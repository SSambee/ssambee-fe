import { useQuery } from "@tanstack/react-query";

import { fetchMyEnrollmentsSVC } from "@/services/SVC/enrollments.service";

export const useMyEnrollmentsSVC = () => {
  return useQuery({
    queryKey: ["svc", "enrollments", "me"],
    queryFn: fetchMyEnrollmentsSVC,
    staleTime: 1000 * 60,
  });
};
