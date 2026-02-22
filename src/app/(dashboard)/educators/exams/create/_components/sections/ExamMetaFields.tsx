"use client";

import type { Control, FieldErrors } from "react-hook-form";
import { Controller } from "react-hook-form";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LECTURE_SUBJECTS } from "@/constants/lectures.constants";
import type { ExamFormInput } from "@/validation/exam.validation";

type ExamMetaFieldsProps = {
  control: Control<ExamFormInput>;
  errors: FieldErrors<ExamFormInput>;
  disabled?: boolean;
};

export function ExamMetaFields({
  control,
  errors,
  disabled = false,
}: ExamMetaFieldsProps) {
  return (
    <>
      <div>
        <label
          htmlFor="exam-name"
          className="mb-2 block text-[14px] font-semibold text-[#8b90a3]"
        >
          시험 <span className="text-red-500">*</span>
        </label>
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <Input
              id="exam-name"
              {...field}
              value={field.value ?? ""}
              placeholder="예: 2024년 1학기 중간고사 수학"
              disabled={disabled}
              className="h-11 rounded-[12px] border-[#e9ebf0] bg-[#fcfcfd] text-[14px] font-medium text-[#4a4d5c]"
            />
          )}
        />
        {errors.name && (
          <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="exam-subject"
          className="mb-2 block text-[14px] font-semibold text-[#8b90a3]"
        >
          과목 <span className="text-red-500">*</span>
        </label>
        {/* TODO: Select는 blur 이벤트가 없어 onOpenChange에서 닫힐 때 field.onBlur() 호출 필요 (blur 검증/포커스 관리) */}
        <Controller
          name="subject"
          control={control}
          render={({ field }) => (
            <Select
              value={field.value}
              onValueChange={field.onChange}
              disabled={disabled}
            >
              <SelectTrigger
                id="exam-subject"
                className="h-11 rounded-[12px] border-[#e9ebf0] bg-[#fcfcfd] text-[14px] font-medium text-[#4a4d5c]"
              >
                <SelectValue placeholder="과목 선택" />
              </SelectTrigger>
              <SelectContent>
                {LECTURE_SUBJECTS.map((subject) => (
                  <SelectItem key={subject} value={subject}>
                    {subject}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.subject && (
          <p className="text-xs text-red-500 mt-1">{errors.subject.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="exam-category"
          className="mb-2 block text-[14px] font-semibold text-[#8b90a3]"
        >
          시험지 유형
        </label>
        <Controller
          name="category"
          control={control}
          render={({ field }) => (
            <Input
              id="exam-category"
              {...field}
              value={field.value ?? ""}
              placeholder="예: 모의고사, 단원 평가"
              disabled={disabled}
              className="h-11 rounded-[12px] border-[#e9ebf0] bg-[#fcfcfd] text-[14px] font-medium text-[#4a4d5c]"
            />
          )}
        />
      </div>

      <div>
        <label
          htmlFor="exam-source"
          className="mb-2 block text-[14px] font-semibold text-[#8b90a3]"
        >
          출처
        </label>
        <Controller
          name="source"
          control={control}
          render={({ field }) => (
            <Input
              id="exam-source"
              {...field}
              value={field.value ?? ""}
              placeholder="예: 자체 제작, 기출"
              disabled={disabled}
              className="h-11 rounded-[12px] border-[#e9ebf0] bg-[#fcfcfd] text-[14px] font-medium text-[#4a4d5c]"
            />
          )}
        />
      </div>
    </>
  );
}
