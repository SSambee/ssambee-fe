import {
  mockDashboardClinics,
  mockDashboardInquiries,
  mockDashboardSchedule,
  mockDashboardStats,
  mockDashboardTasks,
} from "@/data/dashboard.mock";

import { DashboardClinicCard } from "./_components/dashboard/DashboardClinicCard";
import { DashboardHeader } from "./_components/dashboard/DashboardHeader";
import { DashboardInquiryTable } from "./_components/dashboard/DashboardInquiryTable";
import { DashboardStatCards } from "./_components/dashboard/DashboardStatCards";
import { DashboardTaskList } from "./_components/dashboard/DashboardTaskList";
import { DashboardTodayScheduleCard } from "./_components/dashboard/DashboardTodayScheduleCard";

export default function EducatorsDashboardPage() {
  return (
    <div className="container mx-auto space-y-8 p-6">
      <DashboardHeader />
      <DashboardStatCards stats={mockDashboardStats} />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px] 2xl:grid-cols-[minmax(0,1fr)_360px] xl:items-start">
        <div className="space-y-6">
          <DashboardInquiryTable inquiries={mockDashboardInquiries} />
          <DashboardTaskList tasks={mockDashboardTasks} />
        </div>
        <div className="space-y-6">
          <DashboardClinicCard clinics={mockDashboardClinics} />
          <DashboardTodayScheduleCard
            dateLabel="10월 25일"
            items={mockDashboardSchedule}
          />
        </div>
      </div>
    </div>
  );
}
