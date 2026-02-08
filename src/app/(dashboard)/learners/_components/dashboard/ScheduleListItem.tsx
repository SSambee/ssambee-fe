import { ChevronRight } from "lucide-react";

import { type LearnersUpcomingLesson } from "@/types/learners-dashboard";

type ScheduleListItemProps = {
  lesson: LearnersUpcomingLesson;
};

export default function ScheduleListItem({ lesson }: ScheduleListItemProps) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-muted/70 bg-muted/10 px-4 py-3">
      <div className="min-w-[58px] rounded-lg border border-muted bg-white px-2 py-1 text-center">
        <p className="text-[10px] font-semibold text-muted-foreground">
          {lesson.monthLabel}
        </p>
        <p className="text-2xl font-bold leading-none text-foreground">
          {lesson.dayLabel}
        </p>
      </div>

      <div className="flex-1">
        <p className="text-base font-semibold text-foreground">
          {lesson.title}
        </p>
        <p className="text-sm text-muted-foreground">
          {lesson.timeRange} · {lesson.location}
        </p>
      </div>

      <ChevronRight className="h-5 w-5 text-muted-foreground" />
    </div>
  );
}
