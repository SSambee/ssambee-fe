"use client";

import type { UseFormRegister } from "react-hook-form";

import type { ExamFormInput } from "@/validation/exam.validation";

type ExamAutoRetestToggleProps = {
  register: UseFormRegister<ExamFormInput>;
  disabled?: boolean;
};

export function ExamAutoRetestToggle({
  register,
  disabled = false,
}: ExamAutoRetestToggleProps) {
  return (
    <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
      <label className="flex items-start gap-3 cursor-pointer">
        <input
          type="checkbox"
          {...register("isAutoClinic")}
          disabled={disabled}
          className="mt-1"
        />
        <div>
          <div className="font-medium">재시험 대상 자동 분류 활성화</div>
          <div className="text-sm text-muted-foreground mt-1">
            통과 기준 점수에 미달하는 학생을 자동으로 재시험 대상 그룹으로
            분류합니다.
          </div>
        </div>
      </label>
    </div>
  );
}
