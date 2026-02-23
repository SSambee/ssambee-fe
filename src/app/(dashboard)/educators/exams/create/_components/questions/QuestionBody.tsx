"use client";

import type { UseFormRegister } from "react-hook-form";

import { Input } from "@/components/ui/input";
import type { ExamFormInput } from "@/validation/exam.validation";

type QuestionBodyProps = {
  register: UseFormRegister<ExamFormInput>;
  index: number;
  disabled?: boolean;
  contentError?: string;
};

export function QuestionBody({
  register,
  index,
  disabled = false,
  contentError,
}: QuestionBodyProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label
            htmlFor={`question-${index}-category`}
            className="mb-2 block text-[13px] font-semibold text-[#8b90a3]"
          >
            유형
          </label>
          <Input
            id={`question-${index}-category`}
            placeholder="예: 제목, 빈칸, 요약"
            {...register(`questions.${index}.category`)}
            disabled={disabled}
            className="h-10 rounded-[10px] border-[#e9ebf0] bg-[#fcfcfd] text-[14px] font-medium text-[#4a4d5c]"
          />
        </div>
        <div>
          <label
            htmlFor={`question-${index}-source`}
            className="mb-2 block text-[13px] font-semibold text-[#8b90a3]"
          >
            출처
          </label>
          <Input
            id={`question-${index}-source`}
            placeholder="예: 2025 3월 모의고사"
            {...register(`questions.${index}.source`)}
            disabled={disabled}
            className="h-10 rounded-[10px] border-[#e9ebf0] bg-[#fcfcfd] text-[14px] font-medium text-[#4a4d5c]"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor={`question-${index}-content`}
          className="mb-2 block text-[13px] font-semibold text-[#8b90a3]"
        >
          문제 내용 <span className="text-red-500">*</span>
        </label>
        <textarea
          id={`question-${index}-content`}
          className="flex min-h-[100px] w-full rounded-[10px] border border-[#e9ebf0] bg-[#fcfcfd] px-3 py-2 text-[14px] font-medium text-[#4a4d5c] shadow-sm placeholder:text-[#8b90a3] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#4b72f7] disabled:cursor-not-allowed disabled:opacity-50"
          placeholder="문항 1"
          {...register(`questions.${index}.content`)}
          disabled={disabled}
        />
        {contentError && (
          <p className="text-xs text-red-500 mt-1">{contentError}</p>
        )}
        <p className="text-xs text-muted-foreground mt-1">
          문항 내용을 입력해주세요.
        </p>
      </div>
    </div>
  );
}
