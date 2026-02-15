"use client";

import { memo, useMemo } from "react";

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
const timetableRowHeight = 48;

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

  const gridTemplateColumns = `80px repeat(${timetableDays.length}, minmax(0, 1fr))`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl">
        <DialogHeader>
          <DialogTitle>개설된 강의 시간표</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="rounded-xl border border-[#f2c7d4] bg-[#fbd1dd] px-4 py-3 text-center">
            <p className="text-sm font-semibold text-[#3f2b35]">
              {meta.academy}
            </p>
            <p className="text-lg font-bold text-[#2f2030]">{meta.term}</p>
          </div>

          {isLoading ? (
            <p className="text-sm text-muted-foreground">
              시간표를 불러오는 중입니다...
            </p>
          ) : null}

          {errorMessage ? (
            <p className="text-sm text-destructive">{errorMessage}</p>
          ) : null}

          {!isLoading && !errorMessage && entries.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              등록된 강의 시간표가 없습니다.
            </p>
          ) : null}

          <div className="space-y-3">
            <div
              className="grid gap-2 text-sm font-semibold text-muted-foreground"
              style={{ gridTemplateColumns }}
            >
              <span />
              {timetableDays.map((day) => (
                <div key={day} className="text-center">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid gap-2" style={{ gridTemplateColumns }}>
              <div className="flex flex-col text-xs text-muted-foreground">
                {Array.from({ length: timeAxis.rowCount + 1 }, (_, index) => {
                  const hour = timeAxis.startHour + index;
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
                const dayEntries = entries.filter((entry) => entry.day === day);
                return (
                  <div
                    key={day}
                    className="relative rounded-xl border border-slate-100 bg-white"
                    style={{ height: timeAxis.gridHeight }}
                  >
                    <div className="absolute inset-0 flex flex-col">
                      {Array.from({ length: timeAxis.rowCount }).map(
                        (_, index) => (
                          <div
                            key={`row-${day}-${index}`}
                            className="h-12 border-b border-slate-100 last:border-b-0"
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

                      return (
                        <div
                          key={entry.id}
                          className="absolute left-2 right-2 rounded-lg px-2 py-2 text-xs font-semibold text-slate-800 shadow-sm"
                          style={{
                            top: style.top,
                            height: style.height,
                            backgroundColor: entry.color,
                          }}
                        >
                          <p>{entry.title}</p>
                          <p className="text-[10px] text-slate-600">
                            {entry.startTime} - {entry.endTime}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export const ScheduleTimetableModal = memo(ScheduleTimetableModalComponent);
ScheduleTimetableModal.displayName = "ScheduleTimetableModal";
