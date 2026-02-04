import { ClipboardList } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { DashboardTask } from "@/types/dashboard";

type DashboardTaskListProps = {
  tasks: DashboardTask[];
};

const statusBadgeClasses = {
  "진행 중": "bg-amber-100 text-amber-700",
  대기: "bg-slate-100 text-slate-700",
  완료: "bg-emerald-100 text-emerald-700",
} as const;

export function DashboardTaskList({ tasks }: DashboardTaskListProps) {
  return (
    <Card className="shadow-sm">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-100">
              <ClipboardList className="h-4 w-4 text-violet-600" />
            </span>
            <div>
              <p className="text-sm font-semibold">강사 업무 지시 내역</p>
              <p className="text-xs text-muted-foreground">
                조교 업무 진행률을 확인하세요
              </p>
            </div>
          </div>
          <Button variant="outline" className="h-8 px-3 text-xs" disabled>
            업무내역
          </Button>
        </div>

        <div className="mt-5 space-y-4">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="rounded-lg border border-muted/60 bg-muted/20 p-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-semibold">{task.title}</p>
                  <p className="text-xs text-muted-foreground">{task.note}</p>
                </div>
                <span
                  className={cn(
                    "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
                    statusBadgeClasses[task.status]
                  )}
                >
                  {task.status}
                </span>
              </div>
              <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                <span>대상 조교: {task.target}</span>
                <span>{task.progress}%</span>
              </div>
              <div className="mt-2 h-2 w-full rounded-full bg-muted">
                <div
                  className={cn(
                    "h-2 rounded-full",
                    task.status === "완료" ? "bg-emerald-500" : "bg-violet-500"
                  )}
                  style={{ width: `${task.progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
