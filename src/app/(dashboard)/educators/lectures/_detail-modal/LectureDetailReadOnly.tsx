"use client";

import { ReactNode } from "react";
import {
  BookOpen,
  CalendarDays,
  Clock3,
  Headphones,
  LoaderCircle,
  Users,
} from "lucide-react";

import { Lecture, LectureStatus } from "@/types/lectures";
import { DAY_ORDER } from "@/constants/lectures.constants";

type DetailRowProps = {
  icon: ReactNode;
  label: string;
  value: ReactNode;
};

function DetailRow({ icon, label, value }: DetailRowProps) {
  return (
    <div className="flex min-h-10 w-full items-center gap-10 py-2">
      <div className="flex w-[120px] shrink-0 items-center gap-[10px]">
        <span className="text-[#c6cad4]">{icon}</span>
        <p className="text-[18px] font-semibold leading-[26px] tracking-[-0.18px] text-[#8b90a3]">
          {label}
        </p>
      </div>
      <div className="min-w-0 flex-1 text-[18px] font-medium leading-[26px] tracking-[-0.18px] text-[rgba(22,22,27,0.88)]">
        {value}
      </div>
    </div>
  );
}

const STATUS_CHIP_STYLES: Record<LectureStatus, string> = {
  개강전: "bg-[#e1e7fe] text-[#3863f6]",
  진행중: "bg-[#fee2e2] text-[#ef4444]",
  완료: "bg-[#e9ebf0] text-[#8b90a3]",
};

const formatDateLabel = (value?: string) => {
  if (!value) return "-";

  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [yyyy, mm, dd] = value.split("-");
    return `${yyyy}. ${mm}. ${dd}`;
  }

  return value;
};

type LectureDetailReadOnlyProps = {
  lecture: Lecture;
  currentStudents: number;
  scheduleSummary: string;
  statusOverride?: LectureStatus | "";
  startDateOverride?: string;
  instructorOverride?: string;
};

export function LectureDetailReadOnly({
  lecture,
  currentStudents,
  scheduleSummary,
  statusOverride,
  startDateOverride,
  instructorOverride,
}: LectureDetailReadOnlyProps) {
  const scheduleDetail =
    lecture.lectureTimes && lecture.lectureTimes.length > 0
      ? (() => {
          const timesByDay = new Map<string, string[]>();
          lecture.lectureTimes.forEach((time) => {
            const day = time.day ?? "";
            if (!day) return;
            const timeLabel =
              time.startTime && time.endTime
                ? `${time.startTime} - ${time.endTime}`
                : "시간 미지정";
            const list = timesByDay.get(day) ?? [];
            list.push(timeLabel);
            timesByDay.set(day, list);
          });

          const sortedDays = Array.from(timesByDay.keys()).sort(
            (a, b) => (DAY_ORDER[a] ?? 99) - (DAY_ORDER[b] ?? 99)
          );
          const uniqueTimes = new Set(Array.from(timesByDay.values()).flat());
          const hasDifferentTimes = uniqueTimes.size > 1;

          if (!hasDifferentTimes) {
            return scheduleSummary;
          }

          return (
            <div className="space-y-1">
              {sortedDays.map((day) => (
                <div key={day}>
                  {day} {timesByDay.get(day)?.join(", ")}
                </div>
              ))}
            </div>
          );
        })()
      : scheduleSummary;

  const statusValue = statusOverride ? statusOverride : lecture.status;
  const instructorName = instructorOverride || lecture.instructor || "-";
  const instructorInitial = instructorName.slice(0, 1);

  return (
    <div className="flex flex-col gap-3">
      <DetailRow
        icon={<BookOpen className="h-6 w-6" />}
        label="수업명"
        value={lecture.name}
      />

      <DetailRow
        icon={<Users className="h-6 w-6" />}
        label="총 인원"
        value={`${currentStudents}명`}
      />

      <DetailRow
        icon={<LoaderCircle className="h-6 w-6" />}
        label="수업 상태"
        value={
          statusValue ? (
            <span
              className={`inline-flex items-center rounded-[6px] px-2 py-1 text-[14px] font-semibold leading-5 tracking-[-0.14px] ${STATUS_CHIP_STYLES[statusValue]}`}
            >
              {statusValue}
            </span>
          ) : (
            "-"
          )
        }
      />

      <DetailRow
        icon={<CalendarDays className="h-6 w-6" />}
        label="개강일"
        value={formatDateLabel(startDateOverride || lecture.startDate)}
      />

      <DetailRow
        icon={<Clock3 className="h-6 w-6" />}
        label="시간표"
        value={scheduleDetail}
      />

      <DetailRow
        icon={<Headphones className="h-6 w-6" />}
        label="담당 강사"
        value={
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border-[1.5px] border-[#f4f6fa] bg-[#eef2ff] text-sm font-semibold text-[#4b72f7]">
              {instructorInitial}
            </div>
            <span className="text-[#8b90a3]">{instructorName}</span>
          </div>
        }
      />
    </div>
  );
}
