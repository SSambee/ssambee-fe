"use client";

import LearnersAchievementCard from "@/app/(dashboard)/learners/_components/dashboard/LearnersAchievementCard";
import LearnersDashboardHeader from "@/app/(dashboard)/learners/_components/dashboard/LearnersDashboardHeader";
import LearnersNoticesCard from "@/app/(dashboard)/learners/_components/dashboard/LearnersNoticesCard";
import LearnersRecentExamResultsCard from "@/app/(dashboard)/learners/_components/dashboard/LearnersRecentExamResultsCard";
import LearnersStatCards from "@/app/(dashboard)/learners/_components/dashboard/LearnersStatCards";
import LearnersUpcomingLessonsCard from "@/app/(dashboard)/learners/_components/dashboard/LearnersUpcomingLessonsCard";
import {
  learnersAchievementPoints,
  learnersMetricCards,
  learnersNotices,
  learnersRecentExamResults,
  learnersUpcomingLessons,
} from "@/data/learners-dashboard.mock";
import { useSetBreadcrumb } from "@/hooks/useBreadcrumb";

export default function LearnersDashboardPage() {
  useSetBreadcrumb([{ label: "대시보드" }]);

  return (
    <div className="container mx-auto space-y-8 p-6">
      <LearnersDashboardHeader learnerName="김지우" />

      <LearnersStatCards cards={learnersMetricCards} />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px] 2xl:grid-cols-[minmax(0,1fr)_380px] xl:items-start">
        <div className="space-y-6">
          <LearnersAchievementCard points={learnersAchievementPoints} />
          <LearnersRecentExamResultsCard results={learnersRecentExamResults} />
        </div>

        <div className="space-y-6">
          <LearnersNoticesCard notices={learnersNotices} />
          <LearnersUpcomingLessonsCard lessons={learnersUpcomingLessons} />
        </div>
      </div>
    </div>
  );
}
