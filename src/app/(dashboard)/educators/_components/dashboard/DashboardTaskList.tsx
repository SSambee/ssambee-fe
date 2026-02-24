"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { StudentProfileAvatar } from "@/components/common/avatar/StudentProfileAvatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuthContext } from "@/providers/AuthProvider";
import { DashboardTask } from "@/types/dashboard";

type DashboardTaskListProps = {
  tasks: DashboardTask[];
};

const statusBadgeClasses: Record<DashboardTask["status"], string> = {
  "진행 중": "bg-[#fef3c7] text-[#d97706]",
  대기: "bg-[#f1f5f9] text-[#64748b]",
  완료: "bg-[#dcfce7] text-[#16a34a]",
};

export function DashboardTaskList({ tasks }: DashboardTaskListProps) {
  const { user, isLoading } = useAuthContext();
  const isInstructor = user?.userType === "INSTRUCTOR";
  const isAssistant = user?.userType === "ASSISTANT";
  const moreHref = isInstructor
    ? "/educators/assistants/history"
    : "/educators/communication";
  const title = isAssistant ? "내 업무 지시 내역" : "강사 업무 지시 내역";
  const description = isAssistant
    ? "강사가 배정한 업무 진행률을 확인하세요"
    : "조교 업무 진행률을 확인하세요";
  const targetLabel = isAssistant ? "지시 강사" : "담당 조교";

  return (
    <section className="space-y-5 rounded-[24px] border border-[#eaecf2] bg-white p-5 sm:p-6">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-bold tracking-tight text-[#4a4d5c] xl:text-2xl">
            {title}
          </h2>
          <p className="text-base font-medium tracking-tight text-[#16161b]/28 xl:text-lg">
            {description}
          </p>
        </div>
        {isLoading ? (
          <Button
            variant={null}
            disabled
            aria-label="더보기"
            className="h-auto rounded-full px-2 py-1 text-[13px] font-medium leading-5 text-[#b0b4c2] shadow-none transition-colors hover:bg-transparent hover:text-[#8b90a3] disabled:opacity-100"
          >
            더보기
            <ChevronRight className="h-3.5 w-3.5" />
          </Button>
        ) : (
          <Button
            variant={null}
            asChild
            aria-label={
              isInstructor
                ? "업무 지시 내역 페이지로 이동"
                : "소통 관리 페이지로 이동"
            }
            className="h-auto rounded-full px-2 py-1 text-[13px] font-medium leading-5 text-[#8b90a3] shadow-none transition-colors hover:bg-transparent hover:text-[#4a4d5c]"
          >
            <Link href={moreHref}>
              더보기
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {tasks.map((task) => {
          const cardContent = (
            <>
              <div className="bg-white px-6 pb-4 pt-6">
                <div className="mb-6 flex items-start justify-between">
                  <div className="min-w-0 flex flex-col gap-1">
                    <p className="truncate text-xl font-semibold text-[#040405]">
                      {task.title}
                    </p>
                    {task.note ? (
                      <p className="truncate text-base text-[#16161b]/40">
                        {task.note}
                      </p>
                    ) : null}
                  </div>
                  <span
                    className={cn(
                      "inline-flex h-9 w-[72px] shrink-0 items-center justify-center rounded-lg text-sm font-semibold",
                      statusBadgeClasses[task.status]
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
                    <span>{targetLabel}</span>
                    <span>{task.target}</span>
                  </div>
                </div>
              </div>
            </>
          );

          if (isInstructor) {
            return (
              <Link
                key={task.id}
                href="/educators/assistants/history"
                className="overflow-hidden rounded-[20px] border border-[#eaecf2] transition-colors hover:bg-[#f8f9fc] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4b72f7] focus-visible:ring-inset"
              >
                {cardContent}
              </Link>
            );
          }

          if (isAssistant) {
            return (
              <Link
                key={task.id}
                href={`/educators/communication/${task.id}?type=works`}
                className="overflow-hidden rounded-[20px] border border-[#eaecf2] transition-colors hover:bg-[#f8f9fc] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4b72f7] focus-visible:ring-inset"
              >
                {cardContent}
              </Link>
            );
          }

          return (
            <div
              key={task.id}
              className="overflow-hidden rounded-[20px] border border-[#eaecf2]"
            >
              {cardContent}
            </div>
          );
        })}
      </div>
    </section>
  );
}
