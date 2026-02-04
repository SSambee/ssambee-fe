import { useQuery } from "@tanstack/react-query";

import { lectureKeys } from "@/constants/query-keys";
import {
  fetchLecturesAPI,
  mapLectureApiToView,
} from "@/services/lectures/lectures.service";

export type TodayScheduleItem = {
  id: string;
  time: string;
  title: string;
  isActive: boolean;
};

export const useLecturesToday = (dayIndex: number) => {
  return useQuery({
    queryKey: lectureKeys.today(dayIndex),
    queryFn: () =>
      fetchLecturesAPI({
        page: 1,
        limit: 50,
        day: dayIndex,
      }),
    select: (data) => {
      const lectures = data.lectures.map(mapLectureApiToView);
      // TODO: 현재는 첫 번째 강의만 활성화 표시. 추후 시간 기반 로직으로 개선 필요
      const schedules: TodayScheduleItem[] = lectures.map((lecture, index) => ({
        id: lecture.id,
        time: lecture.schedule.time,
        title: lecture.name,
        isActive: index === 0,
      }));
      return { ...data, lectures, schedules };
    },
    staleTime: 1000 * 30,
    refetchOnWindowFocus: false,
  });
};
