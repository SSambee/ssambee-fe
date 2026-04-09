"use client";

import Title from "@/components/common/header/Title";
import { useAuthContext } from "@/app/providers/AuthProvider";
import { useLearnersDashboardSVC } from "@/hooks/SVC/useLearnersDashboardSVC";

import { DashboardInquiryTable } from "./dashboard/DashboardInquiryTable";
import { DashboardStatCards } from "./dashboard/DashboardStatCards";
import { DashboardTodayTimeline } from "./dashboard/DashboardTodayTimeline";

const getTodayLabel = () => {
  const text = new Date().toLocaleDateString("sv-SE", {
    timeZone: "Asia/Seoul",
  });
  const [year, month, day] = text.split("-");

  return `${year}. ${month}. ${day}`;
};

export function LearnersDashboardClient() {
  const { user } = useAuthContext();
  const displayName = user ? `${user.name}` : "";
  const { data, isPending, isError } = useLearnersDashboardSVC();

  return (
    <div className="container mx-auto space-y-8 p-6">
      <Title
        title={`안녕하세요, ${displayName}님!`}
        description="학습 대시보드에 오신 것을 환영합니다. 오늘의 학습 상황을 한눈에 확인하세요."
      />

      {isPending ? (
        <p className="text-sm text-neutral-400">
          대시보드 데이터를 불러오는 중입니다.
        </p>
      ) : null}

      {isError ? (
        <p className="text-sm text-status-warning-normal">
          대시보드 데이터를 불러오지 못했습니다.
        </p>
      ) : null}

      {data ? (
        <div className="grid gap-6 xl:grid-cols-[1fr_440px] xl:items-start">
          <div className="space-y-6">
            <DashboardStatCards data={data} />
            <DashboardInquiryTable announcements={data.announcements ?? []} />
          </div>

          <div className="space-y-6 xl:justify-self-end">
            <DashboardTodayTimeline
              dateLabel={data.today ?? getTodayLabel()}
              items={data.todaySchedule ?? []}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}
