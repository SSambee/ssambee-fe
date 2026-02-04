import { useQuery } from "@tanstack/react-query";

import { lectureKeys } from "@/constants/query-keys";
import {
  fetchLecturesAPI,
  LecturesListQuery,
  mapLectureApiToView,
} from "@/services/lectures/lectures.service";

export const useLecturesList = (query: LecturesListQuery) => {
  return useQuery({
    queryKey: lectureKeys.list(query),
    queryFn: () => fetchLecturesAPI(query),
    select: (data) => ({
      ...data,
      lectures: data.lectures.map(mapLectureApiToView),
    }),
    staleTime: 1000 * 30,
    refetchOnWindowFocus: false,
  });
};
