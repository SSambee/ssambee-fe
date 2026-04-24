"use client";

import { cn } from "@/lib/utils";
import { Lecture } from "@/types/lectures";

type LecturesStatsProps = {
  lectures: Lecture[];
  totalCount?: number;
  todayCount: number;
};

export function LecturesStats({
  lectures,
  totalCount,
  todayCount,
}: LecturesStatsProps) {
  const totalLectures = totalCount ?? lectures.length;

  const totalStudents = lectures.reduce(
    (sum, lecture) => sum + lecture.currentStudents,
    0
  );

  const stats = [
    {
      id: "lecture-stat-total",
      label: "전체 클래스",
      note: "캠퍼스 전체",
      value: totalLectures,
      unit: "개",
    },
    {
      id: "lecture-stat-students",
      label: "등록 인원",
      note: "캠퍼스 전체",
      value: totalStudents,
      unit: "명",
    },
    {
      id: "lecture-stat-today",
      label: "오늘 일정",
      note: "캠퍼스 전체",
      value: todayCount,
      unit: "개",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 xl:gap-6">
      {stats.map((stat, index) => {
        const isPrimary = index === 0;
        const isSecondary = index === 1;
        const isTertiary = index === 2;

        return (
          <div
            key={stat.id}
            className={cn(
              "flex h-[160px] w-full items-end justify-between rounded-[24px] border border-[#eaecf2] px-8 pb-6 pt-8 xl:px-10",
              index === stats.length - 1 && "sm:col-span-2 xl:col-span-1",
              isPrimary && "bg-[#4b72f7]",
              isSecondary && "bg-[#6b6f80]",
              isTertiary && "bg-white"
            )}
          >
            <div className="flex h-full flex-col items-start gap-1">
              <p
                className={cn(
                  "text-xl font-semibold tracking-tight",
                  isTertiary ? "text-[#4a4d5c]" : "text-white/[0.88]"
                )}
              >
                {stat.label}
              </p>
              <p
                className={cn(
                  "text-base font-semibold tracking-tight",
                  isTertiary ? "text-[#8b90a3]" : "text-white/40"
                )}
              >
                {stat.note}
              </p>
            </div>
            <div
              className={cn(
                "flex items-end gap-1 font-bold",
                isTertiary ? "text-[#4a4d5c]" : "text-white"
              )}
            >
              <span className="text-4xl leading-[52px] tracking-tight">
                {stat.value}
              </span>
              <span className="text-[28px] leading-[38px] tracking-tight">
                {stat.unit}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
