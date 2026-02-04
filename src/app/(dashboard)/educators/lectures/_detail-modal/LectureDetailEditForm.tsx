"use client";

import { Input } from "@/components/ui/input";
import SelectBtn from "@/components/common/button/SelectBtn";
import { LectureSelectOption, LectureStatus } from "@/types/lectures";
import { InfoRow } from "@/components/common/InfoRow";
import { ScheduleEditor } from "@/components/common/ScheduleEditor";

type EditTimeRow = {
  id: string;
  day: string;
  startTime: string;
  endTime: string;
};

type LectureDetailEditFormProps = {
  editTitle: string;
  editSubject: string;
  editSchoolYear: string;
  editStatus: LectureStatus | "";
  editStartDate: string;
  editInstructor: string;
  editTimes: EditTimeRow[];
  currentStudents: number;
  subjectOptions: LectureSelectOption[];
  schoolYearOptions: LectureSelectOption[];
  statusOptions: LectureSelectOption[];
  dayOptions: LectureSelectOption[];
  onTitleChange: (value: string) => void;
  onSubjectChange: (value: string) => void;
  onSchoolYearChange: (value: string) => void;
  onStatusChange: (value: LectureStatus | "") => void;
  onStartDateChange: (value: string) => void;
  onScheduleAdd: () => void;
  onScheduleRemove: (id: string) => void;
  onScheduleChange: (
    id: string,
    field: "day" | "startTime" | "endTime",
    value: string
  ) => void;
};

export function LectureDetailEditForm({
  editTitle,
  editSubject,
  editSchoolYear,
  editStatus,
  editStartDate,
  editInstructor,
  editTimes,
  currentStudents,
  subjectOptions,
  schoolYearOptions,
  statusOptions,
  dayOptions,
  onTitleChange,
  onSubjectChange,
  onSchoolYearChange,
  onStatusChange,
  onStartDateChange,
  onScheduleAdd,
  onScheduleRemove,
  onScheduleChange,
}: LectureDetailEditFormProps) {
  return (
    <div className="space-y-4">
      <InfoRow label="수업명">
        <Input
          value={editTitle}
          onChange={(event) => onTitleChange(event.target.value)}
        />
      </InfoRow>
      <InfoRow label="등록 학생">
        <span>{currentStudents}명</span>
      </InfoRow>
      <InfoRow label="과목">
        <SelectBtn
          value={editSubject}
          placeholder="과목 선택"
          options={subjectOptions}
          onChange={(value) => onSubjectChange(value)}
        />
      </InfoRow>
      <InfoRow label="학년">
        <SelectBtn
          value={editSchoolYear}
          placeholder="학년 선택"
          options={schoolYearOptions}
          onChange={(value) => onSchoolYearChange(value)}
        />
      </InfoRow>
      <InfoRow label="수업 상태">
        <SelectBtn
          value={editStatus}
          placeholder="상태 선택"
          options={statusOptions}
          onChange={(value) => onStatusChange(value as LectureStatus | "")}
        />
      </InfoRow>
      <InfoRow label="개강일">
        <Input
          type="date"
          value={editStartDate}
          onChange={(event) => onStartDateChange(event.target.value)}
        />
      </InfoRow>
      <div className="grid grid-cols-[120px_1fr] items-start gap-4">
        <p className="text-sm text-muted-foreground">시간표</p>
        <ScheduleEditor
          rows={editTimes}
          dayOptions={dayOptions}
          onAdd={onScheduleAdd}
          onRemove={onScheduleRemove}
          onChange={onScheduleChange}
        />
      </div>
      <InfoRow label="담당 강사">
        <Input value={editInstructor} disabled />
      </InfoRow>
    </div>
  );
}
