"use client";

import {
  timetableEntries,
  timetableMeta,
  type TimetableDay,
} from "@/data/schedules.mock";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const timetableDays: TimetableDay[] = ["월", "화", "수", "목", "금", "토"];
const timetableStartHour = 11;
const timetableEndHour = 23;
const timetableRowHeight = 48;
const timetableRowCount = timetableEndHour - timetableStartHour;

const toMinutes = (time: string) => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};

const getTimetableBlockStyle = (startTime: string, endTime: string) => {
  const startMinutes = toMinutes(startTime);
  const endMinutes = toMinutes(endTime);
  const offsetMinutes = startMinutes - timetableStartHour * 60;
  const durationMinutes = Math.max(endMinutes - startMinutes, 30);

  return {
    top: (offsetMinutes / 60) * timetableRowHeight,
    height: (durationMinutes / 60) * timetableRowHeight,
  };
};

type ScheduleTimetableModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function ScheduleTimetableModal({
  open,
  onOpenChange,
}: ScheduleTimetableModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl">
        <DialogHeader>
          <DialogTitle>개설된 강의 시간표</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="rounded-xl border border-[#f2c7d4] bg-[#fbd1dd] px-4 py-3 text-center">
            <p className="text-sm font-semibold text-[#3f2b35]">
              {timetableMeta.academy}
            </p>
            <p className="text-lg font-bold text-[#2f2030]">
              {timetableMeta.term}
            </p>
          </div>

          <div className="space-y-3">
            <div className="grid grid-cols-[80px_repeat(6,minmax(0,1fr))] gap-2 text-sm font-semibold text-muted-foreground">
              <span />
              {timetableDays.map((day) => (
                <div key={day} className="text-center">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-[80px_repeat(6,minmax(0,1fr))] gap-2">
              <div className="flex flex-col text-xs text-muted-foreground">
                {Array.from({ length: timetableRowCount }, (_, index) => {
                  const hour = timetableStartHour + index;
                  return (
                    <div
                      key={`time-${hour}`}
                      className="flex h-12 items-start justify-end pr-2"
                    >
                      {String(hour).padStart(2, "0")}:00
                    </div>
                  );
                })}
              </div>

              {timetableDays.map((day) => {
                const dayEntries = timetableEntries.filter(
                  (entry) => entry.day === day
                );
                return (
                  <div
                    key={day}
                    className="relative h-[576px] rounded-xl border border-slate-100 bg-white"
                  >
                    <div className="absolute inset-0 flex flex-col">
                      {Array.from({ length: timetableRowCount }).map(
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
                        entry.endTime
                      );
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
