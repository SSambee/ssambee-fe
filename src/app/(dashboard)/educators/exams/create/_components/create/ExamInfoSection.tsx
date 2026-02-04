"use client";

import type { UseFormReturn } from "react-hook-form";

import { Card, CardContent } from "@/components/ui/card";
import type { Lecture } from "@/types/lectures";
import type { ExamFormInput } from "@/validation/exam.validation";

import { ExamAutoRetestToggle } from "../sections/ExamAutoRetestToggle";
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
        <ExamAutoRetestToggle register={form.register} disabled={disabled} />
      </CardContent>
    </Card>
  );
}
