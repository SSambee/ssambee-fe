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
        <label htmlFor="exam-name" className="block text-sm font-medium mb-2">
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
          className="block text-sm font-medium mb-2"
        >
          과목 <span className="text-red-500">*</span>
        </label>
        <Controller
          name="subject"
          control={control}
          render={({ field }) => (
            <Select
              value={field.value}
              onValueChange={field.onChange}
              disabled={disabled}
            >
              <SelectTrigger id="exam-subject">
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
        <label htmlFor="exam-type" className="block text-sm font-medium mb-2">
          시험지 유형
        </label>
        <Controller
          name="examType"
          control={control}
          render={({ field }) => (
            <Input
              id="exam-type"
              {...field}
              value={field.value ?? ""}
              placeholder="예: 모의고사, 단원 평가"
              disabled={disabled}
            />
          )}
        />
      </div>

      <div>
        <label htmlFor="exam-source" className="block text-sm font-medium mb-2">
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
            />
          )}
        />
      </div>

      <div>
        <label
          htmlFor="exam-pass-score"
          className="block text-sm font-medium mb-2"
        >
          통과 기준 점수
        </label>
        <div className="flex gap-2">
          <Controller
            name="passScore"
            control={control}
            render={({ field }) => (
              <Input
                id="exam-pass-score"
                type="number"
                placeholder="80"
                value={field.value ?? ""}
                onChange={(event) => {
                  const next = event.target.value;
                  field.onChange(next === "" ? undefined : Number(next));
                }}
                disabled={disabled}
                className="flex-1"
              />
            )}
          />
          <span className="flex items-center text-sm text-muted-foreground">
            점
          </span>
        </div>
        {errors.passScore && (
          <p className="text-xs text-red-500 mt-1">
            {errors.passScore.message}
          </p>
        )}
      </div>
    </>
  );
}
