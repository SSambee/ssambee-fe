"use client";

import { memo, useMemo } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type {
  ScheduleTimetableDay,
  ScheduleTimetableEntry,
  ScheduleTimetableMeta,
} from "@/types/schedules";

const timetableDays: ScheduleTimetableDay[] = [
  "월",
  "화",
  "수",
  "목",
  "금",
  "토",
  "일",
];
const DEFAULT_TIMETABLE_START_HOUR = 8;
const DEFAULT_TIMETABLE_END_HOUR = 24;
const MIN_TIMETABLE_START_HOUR = 6;
const MAX_TIMETABLE_END_HOUR = 24;
const TIMETABLE_AXIS_PADDING_MINUTES = 60;
const timetableRowHeight = 44;
const TIMETABLE_BLOCK_COMPACT_HEIGHT = 56;
const TIMETABLE_BLOCK_EXPANDED_HEIGHT = 76;

type TimetableAxis = {
  startHour: number;
  endHour: number;
  rowCount: number;
  gridHeight: number;
  minMinutes: number;
  maxMinutes: number;
};

const clampNumber = (value: number, min: number, max: number) => {
  return Math.min(Math.max(value, min), max);
};

const toMinutes = (time: string) => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};

const getContrastingTextColor = (hexColor: string) => {
  const normalized = hexColor.replace("#", "");
  const isValidHex = /^[0-9A-Fa-f]{6}$/.test(normalized);

  if (!isValidHex) {
    return "#1c202b";
  }

  const red = parseInt(normalized.slice(0, 2), 16);
  const green = parseInt(normalized.slice(2, 4), 16);
  const blue = parseInt(normalized.slice(4, 6), 16);

  const luminance = (0.299 * red + 0.587 * green + 0.114 * blue) / 255;
  return luminance > 0.7 ? "#1c202b" : "#ffffff";
};

const twoLineClampStyle = {
  display: "-webkit-box",
  WebkitLineClamp: 2,
  WebkitBoxOrient: "vertical" as const,
};

const getDefaultTimetableAxis = (): TimetableAxis => {
  const rowCount = DEFAULT_TIMETABLE_END_HOUR - DEFAULT_TIMETABLE_START_HOUR;

  return {
    startHour: DEFAULT_TIMETABLE_START_HOUR,
    endHour: DEFAULT_TIMETABLE_END_HOUR,
    rowCount,
    gridHeight: rowCount * timetableRowHeight,
    minMinutes: DEFAULT_TIMETABLE_START_HOUR * 60,
    maxMinutes: DEFAULT_TIMETABLE_END_HOUR * 60,
  };
};

const buildTimetableAxis = (
  entries: ScheduleTimetableEntry[]
): TimetableAxis => {
  const validRanges = entries
    .map((entry) => {
      const startMinutes = toMinutes(entry.startTime);
      const endMinutes = toMinutes(entry.endTime);

      if (
        Number.isNaN(startMinutes) ||
        Number.isNaN(endMinutes) ||
        endMinutes <= startMinutes
      ) {
        return null;
      }

      return {
        startMinutes,
        endMinutes,
      };
    })
    .filter((range): range is { startMinutes: number; endMinutes: number } => {
      return range !== null;
    });

  if (validRanges.length === 0) {
    return getDefaultTimetableAxis();
  }

  const minStartMinutes = Math.min(
    ...validRanges.map((range) => range.startMinutes)
  );
  const maxEndMinutes = Math.max(
    ...validRanges.map((range) => range.endMinutes)
  );

  const paddedStartMinutes = clampNumber(
    minStartMinutes - TIMETABLE_AXIS_PADDING_MINUTES,
    MIN_TIMETABLE_START_HOUR * 60,
    MAX_TIMETABLE_END_HOUR * 60
  );
  const paddedEndMinutes = clampNumber(
    maxEndMinutes + TIMETABLE_AXIS_PADDING_MINUTES,
    MIN_TIMETABLE_START_HOUR * 60,
    MAX_TIMETABLE_END_HOUR * 60
  );

  let startHour = Math.floor(paddedStartMinutes / 60);
  startHour = clampNumber(
    startHour,
    MIN_TIMETABLE_START_HOUR,
    MAX_TIMETABLE_END_HOUR - 1
  );

  let endHour = Math.ceil(paddedEndMinutes / 60);
  endHour = clampNumber(endHour, startHour + 1, MAX_TIMETABLE_END_HOUR);

  const rowCount = Math.max(endHour - startHour, 1);

  return {
    startHour,
    endHour,
    rowCount,
    gridHeight: rowCount * timetableRowHeight,
    minMinutes: startHour * 60,
    maxMinutes: endHour * 60,
  };
};

const getTimetableBlockStyle = (
  startTime: string,
  endTime: string,
  timeAxis: TimetableAxis
) => {
  const { minMinutes, maxMinutes } = timeAxis;
  const startMinutes = toMinutes(startTime);
  const endMinutes = toMinutes(endTime);

  if (Number.isNaN(startMinutes) || Number.isNaN(endMinutes)) {
    return null;
  }

  const clippedStartMinutes = Math.max(startMinutes, minMinutes);
  const clippedEndMinutes = Math.min(endMinutes, maxMinutes);

  if (
    clippedEndMinutes <= minMinutes ||
    clippedStartMinutes >= maxMinutes ||
    clippedEndMinutes <= clippedStartMinutes
  ) {
    return null;
  }

  const rawDuration = Math.max(clippedEndMinutes - clippedStartMinutes, 30);
  const durationMinutes = Math.min(
    rawDuration,
    maxMinutes - clippedStartMinutes
  );
  const offsetMinutes = clippedStartMinutes - minMinutes;

  return {
    top: (offsetMinutes / 60) * timetableRowHeight,
    height: (durationMinutes / 60) * timetableRowHeight,
  };
};

type ScheduleTimetableModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  entries: ScheduleTimetableEntry[];
  meta: ScheduleTimetableMeta;
  isLoading: boolean;
  errorMessage: string | null;
};

function ScheduleTimetableModalComponent({
  open,
  onOpenChange,
  entries,
  meta,
  isLoading,
  errorMessage,
}: ScheduleTimetableModalProps) {
  const timeAxis = useMemo(() => {
    return buildTimetableAxis(entries);
  }, [entries]);

  const gridTemplateColumns = `76px repeat(${timetableDays.length}, minmax(0, 1fr))`;
  const hourLabels = Array.from(
    { length: timeAxis.rowCount + 1 },
    (_, index) => {
      return timeAxis.startHour + index;
    }
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showClose={false}
        className="w-[calc(100vw-24px)] max-h-[86vh] max-w-[980px] gap-5 overflow-y-auto border-none bg-white p-4 shadow-[0_0_14px_rgba(138,138,138,0.16)] sm:gap-6 sm:rounded-[24px] sm:p-6"
      >
        <DialogHeader className="flex-col items-stretch gap-3 space-y-0 sm:flex-row sm:items-center sm:justify-between sm:gap-0">
          <DialogTitle className="text-[22px] font-bold leading-8 tracking-[-0.24px] text-[#040405]">
            개설된 강의 시간표
          </DialogTitle>
          <Button
            type="button"
            className="h-11 w-full rounded-[12px] bg-[#3863f6] px-6 text-[14px] font-semibold leading-5 tracking-[-0.14px] text-white shadow-[0_0_14px_rgba(138,138,138,0.08)] hover:bg-[#2f57e8] sm:w-auto"
            onClick={() => onOpenChange(false)}
          >
            확인
          </Button>
        </DialogHeader>

        <div className="space-y-5">
          <div className="rounded-[18px] border border-[#f2d4dd] bg-[#fbe4ea] px-5 py-[18px] text-center">
            <p className="text-[15px] font-semibold leading-6 tracking-[-0.01em] text-[#3f2b35]">
              {meta.academy}
            </p>
            <p className="text-[22px] font-bold leading-8 tracking-[-0.02em] text-[#2f2030]">
              {meta.term}
            </p>
          </div>

          {isLoading ? (
            <p className="rounded-[12px] bg-[#f7f8fa] px-4 py-3 text-sm text-muted-foreground">
              시간표를 불러오는 중입니다...
            </p>
          ) : null}

          {errorMessage ? (
            <p className="rounded-[12px] bg-[#fff1f1] px-4 py-3 text-sm text-destructive">
              {errorMessage}
            </p>
          ) : null}

          {!isLoading && !errorMessage && entries.length === 0 ? (
            <p className="rounded-[12px] bg-[#f7f8fa] px-4 py-3 text-sm text-muted-foreground">
              등록된 강의 시간표가 없습니다.
            </p>
          ) : null}

          <div className="rounded-[20px] border border-[#e9ebf0] bg-[#f7f8fa] p-3 sm:p-4">
            <div className="overflow-x-auto">
              <div className="min-w-[760px] space-y-3">
                <div
                  className="grid gap-2 text-sm font-semibold"
                  style={{ gridTemplateColumns }}
                >
                  <span />
                  {timetableDays.map((day) => (
                    <div
                      key={day}
                      className="rounded-[10px] border border-[#e9ebf0] bg-white py-2.5 text-center text-[#6b6f80]"
                    >
                      {day}
                    </div>
                  ))}
                </div>

                <div className="grid gap-2" style={{ gridTemplateColumns }}>
                  <div className="flex flex-col text-xs font-medium text-[#8b90a3]">
                    {hourLabels.map((hour, index) => {
                      const isBoundaryLabel = index === timeAxis.rowCount;

                      return (
                        <div
                          key={`time-${hour}`}
                          className={`flex items-start justify-end pr-2 ${
                            isBoundaryLabel ? "h-0" : "h-12"
                          }`}
                        >
                          {String(hour).padStart(2, "0")}:00
                        </div>
                      );
                    })}
                  </div>

                  {timetableDays.map((day) => {
                    const dayEntries = entries.filter(
                      (entry) => entry.day === day
                    );
                    return (
                      <div
                        key={day}
                        className="relative overflow-hidden rounded-[14px] border border-[#e9ebf0] bg-[#fcfcfd]"
                        style={{ height: timeAxis.gridHeight }}
                      >
                        <div className="absolute inset-0 flex flex-col">
                          {Array.from({ length: timeAxis.rowCount }).map(
                            (_, index) => (
                              <div
                                key={`row-${day}-${timeAxis.startHour + index}`}
                                className="h-12 border-b border-[#eef0f4] last:border-b-0"
                              />
                            )
                          )}
                        </div>
                        {dayEntries.map((entry) => {
                          const style = getTimetableBlockStyle(
                            entry.startTime,
                            entry.endTime,
                            timeAxis
                          );

                          if (!style) {
                            return null;
                          }

                          const textColor = getContrastingTextColor(
                            entry.color
                          );
                          const subTextColor =
                            textColor === "#ffffff"
                              ? "rgba(255,255,255,0.82)"
                              : "rgba(28,32,43,0.75)";
                          const isCompactBlock =
                            style.height < TIMETABLE_BLOCK_COMPACT_HEIGHT;
                          const isExpandedBlock =
                            style.height >= TIMETABLE_BLOCK_EXPANDED_HEIGHT;

                          return (
                            <div
                              key={entry.id}
                              className="absolute left-1.5 right-1.5 overflow-hidden rounded-[10px] px-2 py-1.5 shadow-[0_0_12px_rgba(0,0,0,0.08)]"
                              style={{
                                top: style.top,
                                height: style.height,
                                backgroundColor: entry.color,
                                color: textColor,
                              }}
                            >
                              <p
                                className="overflow-hidden text-[12px] font-semibold leading-4 tracking-[-0.01em]"
                                style={
                                  isExpandedBlock
                                    ? twoLineClampStyle
                                    : undefined
                                }
                              >
                                {entry.title}
                              </p>
                              {!isCompactBlock ? (
                                <p
                                  className="mt-1 truncate text-[11px] font-medium leading-4 tracking-[-0.01em]"
                                  style={{ color: subTextColor }}
                                >
                                  {entry.startTime} - {entry.endTime}
                                </p>
                              ) : null}
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export const ScheduleTimetableModal = memo(ScheduleTimetableModalComponent);
ScheduleTimetableModal.displayName = "ScheduleTimetableModal";
