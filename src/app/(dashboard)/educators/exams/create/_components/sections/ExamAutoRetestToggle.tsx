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
    <div className="rounded-[14px] border border-[#ced9fd] bg-[#f4f6fe] p-4">
      <label className="flex items-start gap-3 cursor-pointer">
        <input
          type="checkbox"
          {...register("isAutoClinic")}
          disabled={disabled}
          className="mt-1 h-4 w-4 accent-[#3863f6]"
        />
        <div>
          <div className="text-[15px] font-semibold text-[#4a4d5c]">
            재시험 대상 자동 분류 활성화
          </div>
          <div className="mt-1 text-[13px] font-medium text-[#8b90a3]">
            통과 기준 점수에 미달하는 학생을 자동으로 재시험 대상 그룹으로
            분류합니다.
          </div>
        </div>
      </label>
    </div>
  );
}
