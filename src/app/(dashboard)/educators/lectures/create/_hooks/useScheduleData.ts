"use client";

import { ScheduleData } from "@/types/lectures";

type UseScheduleDataParams = {
  scheduleData: Record<number, ScheduleData>;
  onScheduleDataChange: (next: Record<number, ScheduleData>) => void;
};

export const useScheduleData = ({
  scheduleData,
  onScheduleDataChange,
}: UseScheduleDataParams) => {
  const updateScheduleField = (
    id: number,
    field: keyof ScheduleData,
    value: string
  ) => {
    onScheduleDataChange({
      ...scheduleData,
      [id]: {
        day: scheduleData[id]?.day || "",
        startTime: scheduleData[id]?.startTime || "",
        endTime: scheduleData[id]?.endTime || "",
        [field]: value,
      },
    });
  };

  return { updateScheduleField };
};
