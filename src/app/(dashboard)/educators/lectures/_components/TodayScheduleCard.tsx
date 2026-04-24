"use client";

import { ChevronRight } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

type TodayScheduleItem = {
  id: string;
  time: string;
  title: string;
  isActive?: boolean;
};

type TodayScheduleCardProps = {
  dateLabel: string;
  items: TodayScheduleItem[];
  onMoreClick?: () => void;
};

export function TodayScheduleCard({
  dateLabel,
  items,
  onMoreClick,
}: TodayScheduleCardProps) {
  const activeIndex = items.findIndex((item) => item.isActive);

  const getItemTone = (index: number, isActive?: boolean) => {
    if (isActive) {
      return {
        dot: "bg-[#4b72f7]",
        text: "text-[rgba(22,22,27,0.88)] font-semibold",
      };
    }

    if (activeIndex !== -1 && index < activeIndex) {
      return {
        dot: "bg-[#d6d9e0]",
        text: "text-[#d6d9e0] font-semibold",
      };
    }

    return {
      dot: "bg-[#c6cad4]",
      text: "text-[#8b90a3] font-medium",
    };
  };

  return (
    <Card className="w-full max-w-[440px] rounded-[24px] border-[#f1f3f8] bg-white shadow-none">
      <CardContent className="px-6 pb-8 pt-8 sm:pl-10">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-[10px]">
            <span className="text-[20px] font-bold leading-7 tracking-[-0.2px] text-[#040405]">
              오늘 일정
            </span>
            <span className="text-[14px] font-medium leading-5 tracking-[-0.14px] text-[rgba(22,22,27,0.28)]">
              {dateLabel}
            </span>
          </div>
          <button
            type="button"
            className="flex items-center gap-[2px] rounded-full px-2 py-1 text-[13px] font-medium leading-5 text-[#b0b4c2] transition-colors hover:text-[#8b90a3]"
            onClick={onMoreClick}
            disabled={!onMoreClick}
          >
            더보기 <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="py-2 text-sm text-muted-foreground">
            오늘 예정된 수업이 없습니다.
          </div>
        ) : (
          <div className="relative">
            <div
              aria-hidden="true"
              className="absolute bottom-2 left-[5px] top-[11px] w-px bg-[#eaecf2]"
            />
            <div className="space-y-4">
              {items.map((item, index) => {
                const tone = getItemTone(index, item.isActive);

                return (
                  <div
                    key={item.id}
                    className="relative flex items-center gap-3"
                  >
                    <span
                      aria-hidden="true"
                      className={`h-2.5 w-2.5 shrink-0 rounded-full ${tone.dot}`}
                    />
                    <p
                      className={`flex min-w-0 items-center gap-2 text-[16px] leading-6 tracking-[-0.16px] ${tone.text}`}
                    >
                      <span className="shrink-0">
                        {item.time}
                        {item.isActive && (
                          <span className="sr-only"> (진행 중)</span>
                        )}
                      </span>
                      <span className="truncate">{item.title}</span>
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
