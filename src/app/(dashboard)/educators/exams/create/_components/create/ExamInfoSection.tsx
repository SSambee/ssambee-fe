"use client";

import type { UseFormReturn } from "react-hook-form";
import { Controller } from "react-hook-form";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { Lecture } from "@/types/lectures";
import type { ExamFormInput } from "@/validation/exam.validation";

import { ExamAutoRetestToggle } from "../sections/ExamAutoRetestToggle";
import { ExamDateField } from "../sections/ExamDateField";
import { ExamInfoGrid } from "../sections/ExamInfoGrid";

type ExamInfoSectionProps = {
  form: UseFormReturn<ExamFormInput>;
  disabled?: boolean;
  disableLectureSelect?: boolean;
  showLectureSelect?: boolean;
  lectures: Lecture[];
  isLecturesLoading?: boolean;
};

export function ExamInfoSection({
  form,
  disabled = false,
  disableLectureSelect = false,
  showLectureSelect = true,
  lectures,
  isLecturesLoading = false,
}: ExamInfoSectionProps) {
  return (
    <Card className="rounded-[24px] border border-[#eaecf2] bg-white shadow-none">
      <div className="border-b border-[#eaecf2] px-6 py-5">
        <h2 className="text-[20px] font-semibold tracking-[-0.2px] text-[#4a4d5c]">
          시험 정보
        </h2>
      </div>
      <CardContent className="p-6 space-y-6">
        <ExamInfoGrid
          form={form}
          lectures={lectures}
          disabled={disabled}
          disableLectureSelect={disableLectureSelect}
          showLectureSelect={showLectureSelect}
          isLecturesLoading={isLecturesLoading}
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="exam-pass-score"
              className="mb-2 block text-[14px] font-semibold text-[#8b90a3]"
            >
              통과 기준 점수
            </label>
            <div className="flex gap-2">
              <Controller
                name="passScore"
                control={form.control}
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
                    className="h-11 flex-1 rounded-[12px] border-[#e9ebf0] bg-[#fcfcfd] text-[14px] font-medium text-[#4a4d5c]"
                  />
                )}
              />
              <span className="flex items-center text-[14px] font-medium text-[#8b90a3]">
                점
              </span>
            </div>
            {form.formState.errors.passScore && (
              <p className="text-xs text-red-500 mt-1">
                {form.formState.errors.passScore.message}
              </p>
            )}
          </div>
          <ExamDateField
            control={form.control}
            errors={form.formState.errors}
            disabled={disabled}
          />
        </div>
        <ExamAutoRetestToggle register={form.register} disabled={disabled} />
      </CardContent>
    </Card>
  );
}
