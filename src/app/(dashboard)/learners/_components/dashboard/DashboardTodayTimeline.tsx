"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LearnersDashboardResponse } from "@/types/dashboard/learnersDashboard";

type DashboardTodayTimelineProps = {
  dateLabel: string;
  items: LearnersDashboardResponse["todaySchedule"];
};

const parseTimeToMinutes = (value: string) => {
  const matched = /^(\d{1,2}):([0-5]\d)$/.exec(value.trim());

  if (!matched) {
    return null;
  }

  const hours = Number(matched[1]);
  const minutes = Number(matched[2]);

  if (hours === 24 && minutes === 0) {
    return 24 * 60;
  }

  if (hours < 0 || hours > 23) {
    return null;
  }

  return hours * 60 + minutes;
};

const getCurrentMinutes = () => {
  const now = new Date();
  return now.getHours() * 60 + now.getMinutes();
};

export function DashboardTodayTimeline({
  dateLabel,
  items,
}: DashboardTodayTimelineProps) {
  const [nowMinutes, setNowMinutes] = useState(getCurrentMinutes);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setNowMinutes(getCurrentMinutes());
    }, 60_000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, []);

  return (
    <div className="w-full rounded-[24px] border border-[#eaecf2] bg-white px-6 pb-8 pt-8 shadow-none sm:pl-10 xl:w-[440px]">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-[10px]">
          <h2 className="text-[20px] font-bold leading-7 tracking-[-0.2px] text-[#040405]">
            오늘 일정
          </h2>
          <p className="text-[14px] font-medium leading-5 tracking-[-0.14px] text-label-assistive">
            {dateLabel}
          </p>
        </div>
        <Button
          variant={null}
          asChild
          aria-label="수업 관리 페이지로 이동"
          className="h-auto rounded-full px-2 py-1 text-[13px] font-medium leading-5 text-[#8b90a3] shadow-none transition-colors hover:bg-transparent hover:text-[#4a4d5c]"
        >
          <Link href="/learners/lectures">
            더보기
            <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </Button>
      </div>

      <div className="relative">
        {items.length >= 2 ? (
          <div className="absolute bottom-2 left-[5px] top-[11px] w-px bg-[#eaecf2]" />
        ) : null}

        <div className="space-y-4">
          {items.map((item, index) => {
            const [startTime = "", endTime = ""] = item.lectureTime
              .split(/[-~]/)
              .map((t) => t.trim());
            const startMinutes = parseTimeToMinutes(startTime);
            const endMinutes = parseTimeToMinutes(endTime);
            const hasValidRange =
              startMinutes !== null &&
              endMinutes !== null &&
              endMinutes > startMinutes;
            const isPast = hasValidRange ? endMinutes <= nowMinutes : false;
            const isActive = hasValidRange
              ? startMinutes <= nowMinutes && nowMinutes < endMinutes
              : false;

            return (
              <div
                key={`${item.lectureTitle}-${index}`}
                className="relative flex items-center gap-3"
              >
                <div
                  className={cn(
                    "h-2.5 w-2.5 shrink-0 rounded-full",
                    isActive
                      ? "bg-[#4b72f7]"
                      : isPast
                        ? "bg-[#d6d9e0]"
                        : "bg-[#c6cad4]"
                  )}
                />
                <div
                  className={cn(
                    "flex min-w-0 items-center gap-2 text-[16px] leading-6 tracking-[-0.16px]",
                    isActive
                      ? "font-semibold text-label-normal"
                      : isPast
                        ? "font-semibold text-neutral-200"
                        : "font-medium text-neutral-400"
                  )}
                >
                  <span className="shrink-0">{item.lectureTime}</span>
                  <span className="truncate">{item.lectureTitle}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
