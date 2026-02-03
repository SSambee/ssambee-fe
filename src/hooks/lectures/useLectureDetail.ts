import { useQuery } from "@tanstack/react-query";

import { lectureKeys } from "@/constants/query-keys";
import {
  fetchLectureDetailAPI,
  mapLectureDetailApiToView,
} from "@/services/lectures/lectures.service";

export const useLectureDetail = (lectureId: string, enabled = true) => {
  return useQuery({
    queryKey: lectureKeys.detail(lectureId),
    queryFn: () => fetchLectureDetailAPI(lectureId),
    select: (data) => mapLectureDetailApiToView(data),
    enabled: enabled && Boolean(lectureId),
    staleTime: 1000 * 30,
    refetchOnWindowFocus: false,
  });
};
