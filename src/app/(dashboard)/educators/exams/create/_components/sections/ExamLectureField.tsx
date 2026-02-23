"use client";

import type { Control, FieldErrors } from "react-hook-form";
import { Controller } from "react-hook-form";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Lecture } from "@/types/lectures";
import type { ExamFormInput } from "@/validation/exam.validation";

type ExamLectureFieldProps = {
  control: Control<ExamFormInput>;
  errors: FieldErrors<ExamFormInput>;
  lectures: Lecture[];
  disabled?: boolean;
  disableLectureSelect?: boolean;
  isLecturesLoading?: boolean;
};

export function ExamLectureField({
  control,
  errors,
  lectures,
  disabled = false,
  disableLectureSelect = false,
  isLecturesLoading = false,
}: ExamLectureFieldProps) {
  return (
    <div className="sm:col-span-2">
      <label
        htmlFor="exam-class"
        className="mb-2 block text-[14px] font-semibold text-[#8b90a3]"
      >
        수업 <span className="text-red-500">*</span>
      </label>
      <Controller
        name="lectureId"
        control={control}
        render={({ field }) => (
          <Select
            value={field.value}
            onValueChange={field.onChange}
            disabled={
              disabled ||
              disableLectureSelect ||
              isLecturesLoading ||
              lectures.length === 0
            }
          >
            <SelectTrigger
              id="exam-class"
              className="h-11 rounded-[12px] border-[#e9ebf0] bg-[#fcfcfd] text-[14px] font-medium text-[#4a4d5c]"
            >
              <SelectValue placeholder="수업 선택" />
            </SelectTrigger>
            <SelectContent>
              {lectures.length === 0 ? (
                <SelectItem value="__empty__" disabled>
                  {isLecturesLoading
                    ? "수업을 불러오는 중입니다"
                    : "등록된 수업이 없습니다"}
                </SelectItem>
              ) : (
                lectures.map((lecture) => (
                  <SelectItem key={lecture.id} value={lecture.id}>
                    {lecture.name} ({lecture.subject} · {lecture.schoolYear})
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        )}
      />
      {errors.lectureId && (
        <p className="text-xs text-red-500 mt-1">{errors.lectureId.message}</p>
      )}
    </div>
  );
}
