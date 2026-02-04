"use client";

import { useRouter } from "next/navigation";

import { LecturesHeader } from "@/app/(dashboard)/educators/lectures/_components/LecturesHeader";
import { LecturesStats } from "@/app/(dashboard)/educators/lectures/_components/LecturesStats";
import { LecturesList } from "@/app/(dashboard)/educators/lectures/_components/LecturesList";
import { TodayScheduleCard } from "@/app/(dashboard)/educators/lectures/_components/TodayScheduleCard";
import { useLecturesUiStore } from "@/stores/lectures";
import { useLecturesList } from "@/hooks/lectures/useLecturesList";
import { useLecturesToday } from "@/hooks/lectures/useLecturesToday";
import { SearchBarWithAction } from "@/components/common/SearchBarWithAction";
import { useLectureSearchDebounce } from "@/hooks/lectures/useLectureSearchDebounce";
import { useSetBreadcrumb } from "@/hooks/useBreadcrumb";

const LOAD_MORE_STEP = 2;

export default function LecturesPage() {
  const router = useRouter();

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

  const { data, isPending, isError } = useLecturesList({
    page: 1,
    limit,
    search: searchValue || undefined,
  });

  const lectures = data?.lectures ?? [];
  const pagination = data?.pagination;
  const totalCount = pagination?.totalCount ?? lectures.length;

  const getTodayLabel = () => {
    const now = new Date();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return `${now.getFullYear()}.${month}.${day}`;
  };

  const todayDayIndex = new Date().getDay();
  const { data: todayData } = useLecturesToday(todayDayIndex);
  const todaySchedules = todayData?.schedules ?? [];

  const handleLoadMore = () => {
    setLimit(limit + LOAD_MORE_STEP);
  };

  const handleReset = () => {
    resetLimit();
  };

  if (isError) {
    return <div className="container mx-auto space-y-8 p-6">조회 실패</div>;
  }

  return (
    <div className="container mx-auto space-y-8 p-6">
      <LecturesHeader />
      <div className="grid gap-6 xl:grid-cols-[1fr_360px] xl:items-start">
        <div className="space-y-6">
          <LecturesStats
            lectures={lectures}
            totalCount={totalCount}
            todayCount={todaySchedules.length}
          />
          <SearchBarWithAction
            searchValue={searchInput}
            onSearchChange={setSearchInput}
            placeholder="수업, 강사, 과목으로 검색해보세요"
            actionLabel="수업 개설하기"
            onAction={() => router.push("/educators/lectures/create")}
          />
          <LecturesList
            lectures={lectures}
            totalCount={totalCount}
            limit={limit}
            isLoading={isPending}
            onLoadMore={handleLoadMore}
            onReset={handleReset}
          />
        </div>
        <div className="flex xl:justify-end">
          <TodayScheduleCard
            dateLabel={getTodayLabel()}
            items={todaySchedules}
            onMoreClick={() => router.push("/educators/schedules")}
          />
        </div>
      </div>
    </div>
  );
}
