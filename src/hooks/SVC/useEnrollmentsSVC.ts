import { useQuery } from "@tanstack/react-query";

import {
  fetchMyChildEnrollmentsSVC,
  fetchMyEnrollmentsSVC,
} from "@/services/SVC/enrollments.service";
import type { LearnerRole } from "@/types/auth.type";

type UseMyEnrollmentsSVCParams = {
  userType?: LearnerRole;
  childId?: string;
  enabled?: boolean;
};

export const useMyEnrollmentsSVC = ({
  userType,
  childId,
  enabled = true,
}: UseMyEnrollmentsSVCParams = {}) => {
  const isParent = userType === "PARENT";
  const shouldFetch =
    enabled && !!userType && (!isParent || (isParent && !!childId));

  return useQuery({
    queryKey: [
      "svc",
      "enrollments",
      "me",
      userType ?? "UNKNOWN",
      childId ?? "",
    ],
    queryFn: () => {
      if (isParent) {
        return fetchMyChildEnrollmentsSVC(childId!);
      }

      return fetchMyEnrollmentsSVC();
    },
    enabled: shouldFetch,
    staleTime: 1000 * 60,
  });
};
