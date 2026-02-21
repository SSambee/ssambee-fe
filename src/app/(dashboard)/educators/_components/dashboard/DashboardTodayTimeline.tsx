import { ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { DashboardScheduleItem } from "@/types/dashboard";

type DashboardTodayTimelineProps = {
  dateLabel: string;
  items: DashboardScheduleItem[];
};

const TEMP_ACTIVE_INDEX_FOR_UI_PHASE = 2;

export function DashboardTodayTimeline({
  dateLabel,
  items,
}: DashboardTodayTimelineProps) {
  return (
    <div className="w-full rounded-[24px] border border-[#eaecf2] bg-white px-6 pb-8 pt-8 shadow-none sm:pl-10 xl:w-[440px]">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-[10px]">
          <h2 className="text-[20px] font-bold leading-7 tracking-[-0.2px] text-[#040405]">
            오늘 일정
          </h2>
          <p className="text-[14px] font-medium leading-5 tracking-[-0.14px] text-[rgba(22,22,27,0.28)]">
            {dateLabel}
          </p>
        </div>
        <Button
          variant={null}
          disabled
          aria-label="더보기 (준비 중)"
          title="준비 중인 기능입니다"
          className="h-auto rounded-full px-2 py-1 text-[13px] font-medium leading-5 text-[#b0b4c2] shadow-none transition-colors hover:bg-transparent hover:text-[#8b90a3] disabled:opacity-100"
        >
          더보기
          <ChevronRight className="h-3.5 w-3.5" />
        </Button>
      </div>

      <div className="relative">
        {items.length > 0 ? (
          <div className="absolute bottom-2 left-[5px] top-[11px] w-px bg-[#eaecf2]" />
        ) : null}

        <div className="space-y-4">
          {items.map((item, index) => {
            const isActive = index === TEMP_ACTIVE_INDEX_FOR_UI_PHASE;
            const isPast = index < TEMP_ACTIVE_INDEX_FOR_UI_PHASE;

            return (
              <div key={item.id} className="relative flex items-center gap-3">
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
                      ? "font-semibold text-[rgba(22,22,27,0.88)]"
                      : isPast
                        ? "font-semibold text-[#d6d9e0]"
                        : "font-medium text-[#8b90a3]"
                  )}
                >
                  <span className="shrink-0">
                    {item.startTime} - {item.endTime}
                  </span>
                  <span className="truncate">{item.title}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
