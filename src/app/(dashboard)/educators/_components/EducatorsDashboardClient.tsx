"use client";

import { useEducatorsDashboardPage } from "../_hooks/useEducatorsDashboardPage";

import { DashboardHeader } from "./dashboard/DashboardHeader";
import { DashboardClinicCard } from "./dashboard/DashboardClinicCard";
import { DashboardInquiryTable } from "./dashboard/DashboardInquiryTable";
import { DashboardStatCards } from "./dashboard/DashboardStatCards";
import { DashboardTaskList } from "./dashboard/DashboardTaskList";
import { DashboardTodayTimeline } from "./dashboard/DashboardTodayTimeline";

const FAILED_SECTION_LABEL: Record<
  "dashboard" | "inquiries" | "tasks",
  string
> = {
  dashboard: "대시보드 요약",
  inquiries: "문의 목록",
  tasks: "업무 지시",
};

const getTodayLabel = () => {
  const text = new Date().toLocaleDateString("sv-SE", {
    timeZone: "Asia/Seoul",
  });
  const [year, month, day] = text.split("-");

  return `${year}. ${month}. ${day}`;
};

export function EducatorsDashboardClient() {
  const { data, isPending, isError, error } = useEducatorsDashboardPage();

  const partialErrorMessage = data?.hasPartialError
    ? `${data.failedSections.map((section) => FAILED_SECTION_LABEL[section]).join(", ")} 데이터를 불러오지 못했습니다.`
    : null;

  return (
    <div className="container mx-auto space-y-8 p-6">
      <DashboardHeader />

      {isPending ? (
        <p className="text-sm text-[#8b90a3]">
          대시보드 데이터를 불러오는 중입니다.
        </p>
      ) : null}

      {isError ? (
        <p className="text-sm text-[#d97706]">
          {error instanceof Error
            ? error.message
            : "대시보드 데이터를 불러오지 못했습니다."}
        </p>
      ) : null}

      {partialErrorMessage ? (
        <p className="text-sm text-[#8b90a3]">{partialErrorMessage}</p>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[1fr_440px] xl:items-start">
        <div className="space-y-6">
          <DashboardStatCards stats={data?.stats ?? []} />
          <DashboardInquiryTable inquiries={data?.inquiries ?? []} />
          <DashboardTaskList tasks={data?.tasks ?? []} />
        </div>

        <div className="space-y-6 xl:justify-self-end">
          <DashboardTodayTimeline
            dateLabel={data?.timelineDateLabel ?? getTodayLabel()}
            items={data?.timelineItems ?? []}
          />
          <DashboardClinicCard clinics={data?.clinics ?? []} />
        </div>
      </div>
    </div>
  );
}
