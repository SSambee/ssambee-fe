"use client";

import { LecturesHeader } from "@/app/(dashboard)/educators/lectures/_components/LecturesHeader";
import { LecturesStats } from "@/app/(dashboard)/educators/lectures/_components/LecturesStats";
import { LecturesList } from "@/app/(dashboard)/educators/lectures/_components/LecturesList";
import { TodayScheduleCard } from "@/app/(dashboard)/educators/lectures/_components/TodayScheduleCard";
import { SearchBarWithAction } from "@/components/common/SearchBarWithAction";
import { useLecturesPage } from "@/app/(dashboard)/educators/lectures/_hooks/useLecturesPage";

export default function LecturesPage() {
  const { state, list, today, flags, actions } = useLecturesPage();

  if (flags.isError) {
    return <div className="container mx-auto space-y-8 p-6">조회 실패</div>;
  }

  return (
    <div className="container mx-auto space-y-8 p-6">
      <LecturesHeader />
      <div className="grid gap-6 xl:grid-cols-[1fr_440px] xl:items-start">
        <div className="space-y-6">
          <LecturesStats
            lectures={list.lectures}
            totalCount={state.totalCount}
            todayCount={today.count}
          />

          <section className="space-y-5 rounded-[24px] border border-[#eaecf2] bg-white p-5 sm:p-6">
            <SearchBarWithAction
              searchValue={state.searchInput}
              onSearchChangeAction={actions.setSearchInput}
              placeholder="수업, 강사, 과목으로 검색해보세요"
              actionLabel="수업 개설하기"
              onAction={actions.openCreateLecture}
            />
            <LecturesList
              lectures={list.lectures}
              totalCount={state.totalCount}
              limit={state.limit}
              isLoading={flags.isPending}
              onLoadMore={actions.loadMore}
              onReset={actions.resetList}
            />
          </section>
        </div>

        <div className="flex xl:justify-end">
          <TodayScheduleCard
            dateLabel={state.todayLabel}
            items={today.schedules}
            onMoreClick={actions.openSchedules}
          />
        </div>
      </div>
    </div>
  );
}
