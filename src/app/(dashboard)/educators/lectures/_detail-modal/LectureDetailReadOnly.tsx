"use client";

import { Lecture, LectureStatus } from "@/types/lectures";
import { InfoRow } from "@/components/common/InfoRow";
import { DAY_ORDER } from "@/constants/lectures.constants";

type LectureDetailReadOnlyProps = {
  lecture: Lecture;
  currentStudents: number;
  scheduleSummary: string;
  subjectOverride?: string;
  schoolYearOverride?: string;
  statusOverride?: LectureStatus | "";
  startDateOverride?: string;
  instructorOverride?: string;
};

export function LectureDetailReadOnly({
  lecture,
  currentStudents,
  scheduleSummary,
  subjectOverride,
  schoolYearOverride,
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

  return (
    <div className="space-y-4">
      <InfoRow label="수업명">{lecture.name}</InfoRow>
      <InfoRow label="등록 학생">{currentStudents}명</InfoRow>
      <InfoRow label="과목">{subjectOverride || lecture.subject}</InfoRow>
      <InfoRow label="학년">{schoolYearOverride || lecture.schoolYear}</InfoRow>
      <InfoRow label="수업 상태">
        {statusOverride ? statusOverride : (lecture.status ?? "-")}
      </InfoRow>
      <InfoRow label="개강일">
        {startDateOverride || lecture.startDate || "-"}
      </InfoRow>
      <InfoRow label="시간표">{scheduleDetail}</InfoRow>
      <InfoRow label="담당 강사">
        {instructorOverride || lecture.instructor}
      </InfoRow>
    </div>
  );
}
