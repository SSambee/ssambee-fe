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
    <Card>
      <div className="p-6 border-b">
        <h2 className="text-xl font-semibold">📄 시험 정보</h2>
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
              className="block text-sm font-medium mb-2"
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
                    className="flex-1"
                  />
                )}
              />
              <span className="flex items-center text-sm text-muted-foreground">
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
