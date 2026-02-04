import { CalendarDays } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { DashboardScheduleItem } from "@/types/dashboard";

type DashboardTodayScheduleCardProps = {
  dateLabel: string;
  items: DashboardScheduleItem[];
};

export function DashboardTodayScheduleCard({
  dateLabel,
  items,
}: DashboardTodayScheduleCardProps) {
  return (
    <Card className="shadow-sm">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100">
              <CalendarDays className="h-4 w-4 text-indigo-600" />
            </span>
            <div>
              <p className="text-sm font-semibold">조교 담당 당일 수업</p>
              <p className="text-xs text-muted-foreground">{dateLabel}</p>
            </div>
          </div>
          <span className="text-xs text-muted-foreground">오늘</span>
        </div>

        <div className="mt-4 space-y-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-start gap-4 rounded-lg border border-muted/60 bg-muted/20 px-4 py-3"
            >
              <div className="text-xs font-semibold text-muted-foreground">
                <div>{item.startTime}</div>
                <div>{item.endTime}</div>
              </div>
              <div>
                <p className="text-sm font-semibold">{item.title}</p>
                {item.subtitle ? (
                  <p className="text-xs text-muted-foreground">
                    {item.subtitle}
                  </p>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
