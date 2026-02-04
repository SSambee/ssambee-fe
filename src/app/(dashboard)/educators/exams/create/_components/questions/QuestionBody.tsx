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
            className="block text-sm font-medium mb-2"
          >
            유형
          </label>
          <Input
            id={`question-${index}-category`}
            placeholder="예: 제목, 빈칸, 요약"
            {...register(`questions.${index}.category`)}
            disabled={disabled}
          />
        </div>
        <div>
          <label
            htmlFor={`question-${index}-source`}
            className="block text-sm font-medium mb-2"
          >
            출처
          </label>
          <Input
            id={`question-${index}-source`}
            placeholder="예: 2025 3월 모의고사"
            {...register(`questions.${index}.source`)}
            disabled={disabled}
          />
        </div>
      </div>

      <div>
        <label
          htmlFor={`question-${index}-content`}
          className="block text-sm font-medium mb-2"
        >
          문제 내용 <span className="text-red-500">*</span>
        </label>
        <textarea
          id={`question-${index}-content`}
          className="flex min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
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
