import {
  mockDashboardClinics,
  mockDashboardInquiries,
  mockDashboardStats,
  mockDashboardTasks,
  mockDashboardTimeline,
  mockDashboardTimelineDateLabel,
} from "@/data/dashboard.mock";

import { DashboardClinicCard } from "./_components/dashboard/DashboardClinicCard";
import { DashboardHeader } from "./_components/dashboard/DashboardHeader";
import { DashboardInquiryTable } from "./_components/dashboard/DashboardInquiryTable";
import { DashboardStatCards } from "./_components/dashboard/DashboardStatCards";
import { DashboardTaskList } from "./_components/dashboard/DashboardTaskList";
import { DashboardTodayTimeline } from "./_components/dashboard/DashboardTodayTimeline";

export default function EducatorsDashboardPage() {
  return (
    <div className="container mx-auto space-y-8 p-6">
      <DashboardHeader />

      <div className="grid gap-6 xl:grid-cols-[1fr_440px] xl:items-start">
        <div className="space-y-6">
          <DashboardStatCards stats={mockDashboardStats} />
          <DashboardInquiryTable inquiries={mockDashboardInquiries} />
          <DashboardTaskList tasks={mockDashboardTasks} />
        </div>

        <div className="space-y-6 xl:justify-self-end">
          <DashboardTodayTimeline
            dateLabel={mockDashboardTimelineDateLabel}
            items={mockDashboardTimeline}
          />
          <DashboardClinicCard clinics={mockDashboardClinics} />
        </div>
      </div>
    </div>
  );
}
