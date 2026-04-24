"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";

import { useSetBreadcrumb } from "@/hooks/useBreadcrumb";
import { useLectureSearchDebounce } from "@/hooks/lectures/useLectureSearchDebounce";
import { useLecturesList } from "@/hooks/lectures/useLecturesList";
import { useLecturesToday } from "@/hooks/lectures/useLecturesToday";
import { useLecturesUiStore } from "@/stores/lectures";

const LOAD_MORE_STEP = 2;

const createTodayInfo = () => {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return {
    label: `${now.getFullYear()}.${month}.${day}`,
    dayIndex: now.getDay(),
  };
};

export const useLecturesPage = () => {
  const router = useRouter();
  const todayInfo = useMemo(() => createTodayInfo(), []);

  useSetBreadcrumb([{ label: "수업 관리" }]);

  const limit = useLecturesUiStore((state) => state.limit);
  const searchInput = useLecturesUiStore((state) => state.searchInput);
  const searchValue = useLecturesUiStore((state) => state.searchValue);
  const setSearchInput = useLecturesUiStore((state) => state.setSearchInput);
  const setSearchValue = useLecturesUiStore((state) => state.setSearchValue);
  const setLimit = useLecturesUiStore((state) => state.setLimit);
  const resetLimit = useLecturesUiStore((state) => state.resetLimit);

  useLectureSearchDebounce({
    searchInput,
    onDebounced: (value) => {
      setSearchValue(value);
      resetLimit();
    },
  });

  const lecturesQuery = useLecturesList({
    page: 1,
    limit,
    search: searchValue || undefined,
  });

  const lectures = lecturesQuery.data?.lectures ?? [];
  const totalCount =
    lecturesQuery.data?.pagination?.totalCount ?? lectures.length;

  const todayQuery = useLecturesToday(todayInfo.dayIndex);
  const todaySchedules = todayQuery.data?.schedules ?? [];

  return {
    state: {
      limit,
      searchInput,
      totalCount,
      todayLabel: todayInfo.label,
    },
    list: {
      lectures,
    },
    today: {
      schedules: todaySchedules,
      count: todaySchedules.length,
    },
    flags: {
      isPending: lecturesQuery.isPending,
      isError: lecturesQuery.isError,
    },
    actions: {
      setSearchInput,
      openCreateLecture: () => router.push("/educators/lectures/create"),
      openSchedules: () => router.push("/educators/schedules"),
      loadMore: () => setLimit(limit + LOAD_MORE_STEP),
      resetList: () => resetLimit(),
    },
  };
};
