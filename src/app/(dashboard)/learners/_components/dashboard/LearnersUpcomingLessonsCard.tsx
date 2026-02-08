import ScheduleListItem from "@/app/(dashboard)/learners/_components/dashboard/ScheduleListItem";
import { type LearnersUpcomingLesson } from "@/types/learners-dashboard";
import { Card, CardContent } from "@/components/ui/card";

type LearnersUpcomingLessonsCardProps = {
  lessons: LearnersUpcomingLesson[];
};

export default function LearnersUpcomingLessonsCard({
  lessons,
}: LearnersUpcomingLessonsCardProps) {
  return (
    <Card className="shadow-sm">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <p className="text-2xl font-semibold tracking-tight">다가오는 수업</p>
          <p className="text-xs font-semibold text-muted-foreground">
            전체 시간표
          </p>
        </div>

        <div className="mt-6 space-y-3">
          {lessons.map((lesson) => (
            <ScheduleListItem key={lesson.id} lesson={lesson} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
