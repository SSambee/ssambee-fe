"use client";

import { UseFormReturn, useFormState, useWatch } from "react-hook-form";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import SelectBtn from "@/components/common/button/SelectBtn";
import { DatePickerField } from "@/components/common/input/DatePickerField";
import { LectureFormInput } from "@/validation/lecture.validation";
import {
  LECTURE_GRADES,
  LECTURE_STATUS_OPTIONS,
  LECTURE_SUBJECTS,
} from "@/constants/lectures.constants";

type LectureInfoSectionProps = {
  form: UseFormReturn<LectureFormInput>;
  disabled: boolean;
};

export function LectureInfoSection({
  form,
  disabled,
}: LectureInfoSectionProps) {
  const { register, setValue } = form;
  const { errors } = useFormState({ control: form.control });

  const subjectValue =
    useWatch({ control: form.control, name: "subject" }) ?? "";
  const schoolYearValue =
    useWatch({ control: form.control, name: "schoolYear" }) ?? "";
  const statusValue = useWatch({ control: form.control, name: "status" }) ?? "";
  const subjectOptions = LECTURE_SUBJECTS.map((subject) => ({
    label: subject,
    value: subject,
  }));
  const schoolYearOptions = LECTURE_GRADES.map((grade) => ({
    label: grade,
    value: grade,
  }));
  const statusOptions = LECTURE_STATUS_OPTIONS.map((option) => ({
    label: option.label,
    value: option.value,
  }));

  return (
    <Card className="rounded-[24px] border-0 shadow-[0_0_14px_rgba(138,138,138,0.08)]">
      <CardContent className="p-8">
        <h2 className="text-[24px] font-bold leading-[32px] tracking-[-0.24px] text-[#040405]">
          강의 기본정보
        </h2>
        <div className="mt-10 flex flex-col gap-8">
          <input type="hidden" {...register("subject")} />
          <input type="hidden" {...register("schoolYear")} />
          <input type="hidden" {...register("status")} />

          <div>
            <label htmlFor="lecture-name" className="sr-only">
              수업명
            </label>
            <Input
              id="lecture-name"
              {...register("name")}
              placeholder="수업명"
              disabled={disabled}
              className="h-14 rounded-[12px] border-[#d6d9e0] px-4 pr-3 text-[16px] md:text-[16px] font-medium leading-6 tracking-[-0.16px] placeholder:text-[#8b90a3]"
            />
            {!errors.name && (
              <p className="mt-2 pl-3 text-[13px] font-medium leading-[18px] tracking-[-0.13px] text-[rgba(22,22,27,0.4)]">
                학년과 과목명이 들어가면 좋아요
              </p>
            )}
            {errors.name && (
              <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="lecture-subject" className="sr-only">
              과목
            </label>
            <SelectBtn
              id="lecture-subject"
              value={subjectValue}
              placeholder="과목"
              options={subjectOptions}
              onChange={(value) =>
                setValue("subject", value, {
                  shouldValidate: true,
                  shouldDirty: true,
                })
              }
              variant="figma"
              className="font-medium tracking-[-0.16px] text-[#8b90a3]"
              isError={Boolean(errors.subject)}
              disabled={disabled}
            />
            {errors.subject && (
              <p className="mt-1 text-xs text-red-500">
                {errors.subject.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="lecture-grade" className="sr-only">
              학년
            </label>
            <SelectBtn
              id="lecture-grade"
              value={schoolYearValue}
              placeholder="학년"
              options={schoolYearOptions}
              onChange={(value) =>
                setValue("schoolYear", value, {
                  shouldValidate: true,
                  shouldDirty: true,
                })
              }
              variant="figma"
              className="font-medium tracking-[-0.16px] text-[#8b90a3]"
              isError={Boolean(errors.schoolYear)}
              disabled={disabled}
            />
            {errors.schoolYear && (
              <p className="mt-1 text-xs text-red-500">
                {errors.schoolYear.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="lecture-start-date" className="sr-only">
              개강일
            </label>
            <DatePickerField
              control={form.control}
              name="startDate"
              placeholder="개강일"
              disabled={disabled}
              className="font-medium tracking-[-0.16px] text-[#8b90a3]"
            />
            {errors.startDate && (
              <p className="mt-1 text-xs text-red-500">
                {errors.startDate.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="lecture-status" className="sr-only">
              수업 상태
            </label>
            <SelectBtn
              id="lecture-status"
              value={statusValue}
              placeholder="수업 상태"
              options={statusOptions}
              onChange={(value) =>
                setValue("status", value, {
                  shouldValidate: true,
                  shouldDirty: true,
                })
              }
              variant="figma"
              className="font-medium tracking-[-0.16px] text-[#8b90a3]"
              isError={Boolean(errors.status)}
              disabled={disabled}
            />
            {errors.status && (
              <p className="mt-1 text-xs text-red-500">
                {errors.status.message}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
