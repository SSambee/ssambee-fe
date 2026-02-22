import { ChevronRight } from "lucide-react";

import { StudentProfileAvatar } from "@/components/common/avatar/StudentProfileAvatar";
import { cn } from "@/lib/utils";
import { DashboardTask, DashboardTaskStatus } from "@/types/dashboard";

type DashboardTaskListProps = {
  tasks: DashboardTask[];
};

const STATUS_BADGE_STYLE: Record<DashboardTaskStatus, string> = {
  완료: "bg-[#dcfce7] text-[#16a34a]",
  "진행 중": "bg-[#dbeafe] text-[#2563eb]",
  대기: "bg-[#fef3c7] text-[#d97706]",
};

export function DashboardTaskList({ tasks }: DashboardTaskListProps) {
  return (
    <section className="space-y-5 rounded-[24px] border border-[#eaecf2] bg-white p-5 sm:p-6">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-bold tracking-tight text-[#4a4d5c] xl:text-2xl">
            강사 업무 지시 내역
          </h2>
          <p className="text-base font-medium tracking-tight text-[#16161b]/28 xl:text-lg">
            조교 업무 진행률을 확인하세요
          </p>
        </div>
        <button
          type="button"
          disabled
          aria-disabled="true"
          title="준비 중"
          className="inline-flex h-auto items-center gap-1 cursor-not-allowed rounded-full px-2 py-1 text-[13px] font-medium leading-5 text-[#b0b4c2] opacity-60 transition-colors hover:bg-transparent"
        >
          더보기
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="overflow-hidden rounded-[20px] border border-[#eaecf2]"
          >
            <div className="bg-white px-6 pb-4 pt-6">
              <div className="flex items-start justify-between mb-6">
                <div className="flex flex-col gap-1">
                  <p className="text-xl font-semibold text-[#040405]">
                    {task.title}
                  </p>
                  {task.note ? (
                    <p className="text-base text-[#16161b]/40">{task.note}</p>
                  ) : null}
                </div>
                <span
                  className={cn(
                    "inline-flex h-9 w-[72px] items-center justify-center rounded-lg text-sm font-semibold",
                    STATUS_BADGE_STYLE[task.status]
                  )}
                >
                  {task.status}
                </span>
              </div>
            </div>
            <div className="border-t border-[#eaecf2] bg-white px-6 py-4">
              <div className="flex items-center gap-3.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-full border-[1.5px] border-[#eaecf2] bg-white">
                  <StudentProfileAvatar
                    size={32}
                    seedKey={task.target}
                    label={`${task.target} 프로필 이미지`}
                  />
                </div>
                <div className="flex items-center gap-1.5 text-lg font-medium text-[#8b90a3]">
                  <span>담당 조교</span>
                  <span>{task.target}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
