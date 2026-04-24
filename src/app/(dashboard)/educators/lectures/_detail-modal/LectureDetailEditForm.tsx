"use client";

import {
  BookOpen,
  CalendarDays,
  Clock3,
  Headphones,
  LoaderCircle,
  Plus,
  Trash2,
  Users,
} from "lucide-react";

import { DatePickerInput } from "@/components/common/input/DatePickerField";
import { Input } from "@/components/ui/input";
import SelectBtn from "@/components/common/button/SelectBtn";
import { LectureSelectOption, LectureStatus } from "@/types/lectures";
import { Button } from "@/components/ui/button";

type EditTimeRow = {
  id: string;
  day: string;
  startTime: string;
  endTime: string;
};

type LectureDetailEditFormProps = {
  editTitle: string;
  editStatus: LectureStatus | "";
  editStartDate: string;
  editInstructor: string;
  editTimes: EditTimeRow[];
  currentStudents: number;
  statusOptions: LectureSelectOption[];
  dayOptions: LectureSelectOption[];
  onTitleChange: (value: string) => void;
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
  editStatus,
  editStartDate,
  editInstructor,
  editTimes,
  currentStudents,
  statusOptions,
  dayOptions,
  onTitleChange,
  onStatusChange,
  onStartDateChange,
  onScheduleAdd,
  onScheduleRemove,
  onScheduleChange,
}: LectureDetailEditFormProps) {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-[120px_1fr] items-center gap-10 py-2">
        <div className="flex items-center gap-[10px]">
          <BookOpen className="h-6 w-6 text-[#c6cad4]" />
          <p className="text-[18px] font-semibold leading-[26px] tracking-[-0.18px] text-[#8b90a3]">
            수업명
          </p>
        </div>
        <Input
          value={editTitle}
          onChange={(event) => onTitleChange(event.target.value)}
          className="h-[42px] rounded-[10px] border-[#d6d9e0] px-4 text-[16px] font-medium leading-6 tracking-[-0.16px] text-[#8b90a3]"
        />
      </div>

      <div className="grid grid-cols-[120px_1fr] items-center gap-10 py-2">
        <div className="flex items-center gap-[10px]">
          <Users className="h-6 w-6 text-[#c6cad4]" />
          <p className="text-[18px] font-semibold leading-[26px] tracking-[-0.18px] text-[#8b90a3]">
            총 인원
          </p>
        </div>
        <div className="flex items-center">
          <span className="text-[18px] font-medium leading-[26px] tracking-[-0.18px] text-[rgba(22,22,27,0.88)]">
            {currentStudents}명
          </span>
        </div>
      </div>

      <div className="grid grid-cols-[120px_1fr] items-center gap-10 py-2">
        <div className="flex items-center gap-[10px]">
          <LoaderCircle className="h-6 w-6 text-[#c6cad4]" />
          <p className="text-[18px] font-semibold leading-[26px] tracking-[-0.18px] text-[#8b90a3]">
            수업 상태
          </p>
        </div>
        <SelectBtn
          value={editStatus}
          placeholder="수업 상태"
          options={statusOptions}
          onChange={(value) => onStatusChange(value as LectureStatus | "")}
          variant="figma"
          className="h-[42px] rounded-[10px] py-0"
          optionSize="sm"
        />
      </div>

      <div className="grid grid-cols-[120px_1fr] items-center gap-10 py-2">
        <div className="flex items-center gap-[10px]">
          <CalendarDays className="h-6 w-6 text-[#c6cad4]" />
          <p className="text-[18px] font-semibold leading-[26px] tracking-[-0.18px] text-[#8b90a3]">
            개강일
          </p>
        </div>
        <DatePickerInput
          value={editStartDate}
          onChangeAction={onStartDateChange}
          className="h-[42px] rounded-[10px] py-0"
        />
      </div>

      <div className="grid grid-cols-[120px_1fr] items-start gap-10 py-2">
        <div className="flex items-center gap-[10px] pt-2">
          <Clock3 className="h-6 w-6 text-[#c6cad4]" />
          <p className="text-[18px] font-semibold leading-[26px] tracking-[-0.18px] text-[#8b90a3]">
            시간표
          </p>
        </div>

        <div className="space-y-2">
          {editTimes.map((row) => (
            <div
              key={row.id}
              className="grid grid-cols-[1fr_1fr_1fr_54px] gap-2"
            >
              <SelectBtn
                value={row.day}
                placeholder="요일"
                options={dayOptions}
                onChange={(value) => onScheduleChange(row.id, "day", value)}
                variant="figma"
                className="h-[42px] rounded-[10px] py-0"
                optionSize="sm"
              />

              <Input
                value={row.startTime}
                onChange={(event) =>
                  onScheduleChange(row.id, "startTime", event.target.value)
                }
                placeholder="18:00"
                className="h-[42px] rounded-[10px] border-[#d6d9e0] px-4 text-[16px] font-medium leading-6 tracking-[-0.16px] text-[#8b90a3]"
              />

              <Input
                value={row.endTime}
                onChange={(event) =>
                  onScheduleChange(row.id, "endTime", event.target.value)
                }
                placeholder="20:00"
                className="h-[42px] rounded-[10px] border-[#d6d9e0] px-4 text-[16px] font-medium leading-6 tracking-[-0.16px] text-[#8b90a3]"
              />

              <Button
                type="button"
                variant="outline"
                onClick={() => onScheduleRemove(row.id)}
                className="h-[42px] rounded-[10px] border-[#e9ebf0] bg-white px-0 text-[#8b90a3] hover:bg-[#f8f9fc]"
              >
                <Trash2 className="h-5 w-5" />
              </Button>
            </div>
          ))}

          <Button
            type="button"
            variant="outline"
            onClick={onScheduleAdd}
            className="h-[42px] w-full rounded-[10px] border-[#ced9fd] bg-[#f4f6fe] text-[14px] font-semibold leading-5 tracking-[-0.14px] text-[#3863f6] hover:bg-[#e8edfe]"
          >
            <Plus className="h-5 w-5" />
            시간 추가
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-[120px_1fr] items-center gap-10 py-2">
        <div className="flex items-center gap-[10px]">
          <Headphones className="h-6 w-6 text-[#c6cad4]" />
          <p className="text-[18px] font-semibold leading-[26px] tracking-[-0.18px] text-[#8b90a3]">
            담당 강사
          </p>
        </div>

        <div className="flex items-center h-[42px] px-1">
          <span className="text-[18px] font-medium leading-[26px] tracking-[-0.18px] text-[#8b90a3]">
            {editInstructor}
          </span>
        </div>
      </div>
    </div>
  );
}
