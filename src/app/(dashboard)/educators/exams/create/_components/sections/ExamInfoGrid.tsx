"use client";

import type { UseFormReturn } from "react-hook-form";

import type { Lecture } from "@/types/lectures";
import type { ExamFormInput } from "@/validation/exam.validation";

import { ExamLectureField } from "./ExamLectureField";
import { ExamMetaFields } from "./ExamMetaFields";

type ExamInfoGridProps = {
  form: UseFormReturn<ExamFormInput>;
  lectures: Lecture[];
  disabled?: boolean;
  disableLectureSelect?: boolean;
  showLectureSelect?: boolean;
  isLecturesLoading?: boolean;
};

export function ExamInfoGrid({
  form,
  lectures,
  disabled = false,
  disableLectureSelect = false,
  showLectureSelect = true,
  isLecturesLoading = false,
}: ExamInfoGridProps) {
  const {
    control,
    formState: { errors },
  } = form;

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <ExamMetaFields control={control} errors={errors} disabled={disabled} />
      {showLectureSelect && (
        <ExamLectureField
          control={control}
          errors={errors}
          lectures={lectures}
          disabled={disabled}
          disableLectureSelect={disableLectureSelect}
          isLecturesLoading={isLecturesLoading}
        />
      )}
    </div>
  );
}
