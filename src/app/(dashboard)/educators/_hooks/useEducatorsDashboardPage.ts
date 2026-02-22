import { useQuery } from "@tanstack/react-query";

import { dashboardKeys } from "@/constants/query-keys";
import { useAuthContext } from "@/providers/AuthProvider";
import {
  mapMgmtAssistantOrdersToTasks,
  mapMgmtDashboardToClinics,
  mapMgmtDashboardToStats,
  mapMgmtDashboardToTimeline,
  mapMgmtStudentPostsToInquiries,
} from "@/services/dashboard/dashboard.mapper";
import {
  fetchMgmtAssistantOrdersAPI,
  fetchMgmtDashboardAPI,
  fetchMgmtStudentPostsAPI,
} from "@/services/dashboard/dashboard.service";
import {
  DashboardClinicItem,
  DashboardInquiry,
  DashboardScheduleItem,
  DashboardStat,
  DashboardTask,
} from "@/types/dashboard";

type FailedSection = "dashboard" | "inquiries" | "tasks";

export type EducatorsDashboardData = {
  stats: DashboardStat[];
  inquiries: DashboardInquiry[];
  tasks: DashboardTask[];
  timelineItems: DashboardScheduleItem[];
  timelineDateLabel: string;
  clinics: DashboardClinicItem[];
  hasPartialError: boolean;
  failedSections: FailedSection[];
};

const INQUIRIES_PAGE = 1;
const INQUIRIES_LIMIT = 5;
const TASKS_PAGE = 1;
const TASKS_LIMIT = 4;

const getTodayLabel = () => {
  const text = new Date().toLocaleDateString("sv-SE", {
    timeZone: "Asia/Seoul",
  });
  const [year, month, day] = text.split("-");

  return `${year}. ${month}. ${day}`;
};

export const useEducatorsDashboardPage = () => {
  const { user } = useAuthContext();

  return useQuery<EducatorsDashboardData>({
    queryKey: dashboardKeys.educatorsHomeWithQuery({
      inquiryPage: INQUIRIES_PAGE,
      inquiryLimit: INQUIRIES_LIMIT,
      inquiryOrderBy: "latest",
      taskPage: TASKS_PAGE,
      taskLimit: TASKS_LIMIT,
    }),
    queryFn: async () => {
      const [dashboardResult, inquiriesResult, tasksResult] =
        await Promise.allSettled([
          fetchMgmtDashboardAPI(),
          fetchMgmtStudentPostsAPI({
            page: INQUIRIES_PAGE,
            limit: INQUIRIES_LIMIT,
            orderBy: "latest",
          }),
          fetchMgmtAssistantOrdersAPI({
            page: TASKS_PAGE,
            limit: TASKS_LIMIT,
          }),
        ]);

      const failedSections: FailedSection[] = [];

      if (dashboardResult.status === "rejected") {
        failedSections.push("dashboard");
      }
      if (inquiriesResult.status === "rejected") {
        failedSections.push("inquiries");
      }
      if (tasksResult.status === "rejected") {
        failedSections.push("tasks");
      }

      if (failedSections.length === 3) {
        throw new Error("대시보드 데이터를 불러오지 못했습니다.");
      }

      const dashboardData =
        dashboardResult.status === "fulfilled" ? dashboardResult.value : null;

      const timeline = dashboardData
        ? mapMgmtDashboardToTimeline(dashboardData)
        : {
            items: [] as DashboardScheduleItem[],
            dateLabel: getTodayLabel(),
          };

      return {
        stats: dashboardData ? mapMgmtDashboardToStats(dashboardData) : [],
        inquiries:
          inquiriesResult.status === "fulfilled"
            ? mapMgmtStudentPostsToInquiries(inquiriesResult.value).slice(
                0,
                INQUIRIES_LIMIT
              )
            : [],
        tasks:
          tasksResult.status === "fulfilled"
            ? mapMgmtAssistantOrdersToTasks(
                tasksResult.value,
                user?.name
              ).slice(0, TASKS_LIMIT)
            : [],
        timelineItems: timeline.items,
        timelineDateLabel: timeline.dateLabel,
        clinics: dashboardData ? mapMgmtDashboardToClinics(dashboardData) : [],
        hasPartialError: failedSections.length > 0,
        failedSections,
      };
    },
    staleTime: 1000 * 30,
    refetchOnWindowFocus: false,
  });
};
