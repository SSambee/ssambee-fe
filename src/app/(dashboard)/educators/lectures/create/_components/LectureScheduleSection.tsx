"use client";

import { Trash2 } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ScheduleEditor,
  ScheduleEditorRow,
} from "@/components/common/ScheduleEditor";
import { WEEKDAY_OPTIONS } from "@/constants/lectures.constants";
import { ScheduleData } from "@/types/lectures";

import { useScheduleData } from "../_hooks/useScheduleData";

type LectureScheduleSectionProps = {
  schedules: number[];
  scheduleData: Record<number, ScheduleData>;
  disabled: boolean;
  onAdd: () => void;
  onRemove: (id: number) => void;
  onScheduleDataChange: (nextData: Record<number, ScheduleData>) => void;
};

export function LectureScheduleSection({
  schedules,
  scheduleData,
  disabled,
  onAdd,
  onRemove,
  onScheduleDataChange,
}: LectureScheduleSectionProps) {
  const { updateScheduleField } = useScheduleData({
    scheduleData,
    onScheduleDataChange,
  });

  const rows: ScheduleEditorRow[] = schedules.map((scheduleId) => ({
    id: String(scheduleId),
    day: scheduleData[scheduleId]?.day || "",
    startTime: scheduleData[scheduleId]?.startTime || "",
    endTime: scheduleData[scheduleId]?.endTime || "",
  }));

  const dayOptions = [...WEEKDAY_OPTIONS];

  return (
    <Card className="rounded-[24px] border-0 shadow-[0_0_14px_rgba(138,138,138,0.08)]">
      <div className="flex items-center justify-between px-8 pb-6 pt-8">
        <h2 className="text-[24px] font-bold leading-[32px] tracking-[-0.24px] text-[#040405]">
          강의 시간표
        </h2>
        <Button
          onClick={onAdd}
          size="default"
          variant="outline"
          disabled={disabled}
          className="h-12 rounded-xl border border-[#ced9fd] bg-[#f4f6fe] px-7 text-[14px] font-semibold leading-[20px] tracking-[-0.14px] text-[#3863f6] shadow-[0_0_14px_rgba(138,138,138,0.08)]"
        >
          + 시간 추가
        </Button>
      </div>
      <CardContent className="px-8 pb-8">
        <div
          className={disabled ? "pointer-events-none opacity-60" : ""}
          aria-disabled={disabled}
          inert={disabled ? true : undefined}
        >
          <ScheduleEditor
            rows={rows}
            dayOptions={dayOptions}
            onAdd={onAdd}
            onRemove={(id) => onRemove(Number(id))}
            onChange={(id, field, value) =>
              updateScheduleField(Number(id), field, value)
            }
            showAddButton={false}
            layoutVariant="compact"
            inputClassName="h-14 rounded-[12px] border-[#d6d9e0] text-[16px] text-[#8b90a3] placeholder:text-[#8b90a3]"
            selectClassName="text-[#8b90a3]"
            selectVariant="figma"
            timeInputVariant="text"
            startTimePlaceholder="시작 시간"
            endTimePlaceholder="종료 시간"
            renderRemoveButton={(id) => (
              <Button
                type="button"
                variant="outline"
                onClick={() => onRemove(Number(id))}
                className="h-12 w-12 rounded-[12px] border-[#d6d9e0] bg-white p-0 text-[#8b90a3]"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
}
