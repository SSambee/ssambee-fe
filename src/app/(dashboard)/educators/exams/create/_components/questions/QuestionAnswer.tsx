"use client";

import { Check } from "lucide-react";
import type { UseFormRegister, UseFormSetValue } from "react-hook-form";

import { Input } from "@/components/ui/input";
import type { ExamFormInput } from "@/validation/exam.validation";

type QuestionAnswerProps = {
  questionType: ExamFormInput["questions"][number]["type"];
  selectedAnswer?: number;
  setValue: UseFormSetValue<ExamFormInput>;
  register: UseFormRegister<ExamFormInput>;
  index: number;
  disabled?: boolean;
  answerSelectedError?: string;
  answerTextError?: string;
};

export function QuestionAnswer({
  questionType,
  selectedAnswer,
  setValue,
  register,
  index,
  disabled = false,
  answerSelectedError,
  answerTextError,
}: QuestionAnswerProps) {
  if (questionType === "객관식") {
    return (
      <div className="rounded-[12px] border border-[#ced9fd] bg-[#f4f6fe] p-4">
        <div className="flex items-center gap-2 mb-4">
          <Check className="h-4 w-4 text-[#3863f6]" />
          <h3 className="text-[14px] font-semibold text-[#4a4d5c]">
            객관식 정답 설정
          </h3>
        </div>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((num) => (
            <button
              key={num}
              type="button"
              aria-pressed={selectedAnswer === num}
              onClick={() =>
                setValue(`questions.${index}.answer.selected`, num, {
                  shouldValidate: true,
                })
              }
              disabled={disabled}
              className={
                "h-11 w-11 rounded-full border-2 text-[13px] font-semibold transition-colors " +
                (selectedAnswer === num
                  ? "border-[#3863f6] bg-[#3863f6] text-white"
                  : "border-[#d6d9e0] bg-white text-[#6b6f80] hover:bg-[#fcfcfd]") +
                " disabled:opacity-50 disabled:cursor-not-allowed"
              }
            >
              {num}
            </button>
          ))}
        </div>
        {answerSelectedError && (
          <p className="text-xs text-red-500 mt-2">{answerSelectedError}</p>
        )}
      </div>
    );
  }

  return (
    <div className="rounded-[12px] border border-[#ced9fd] bg-[#f4f6fe] p-4">
      <div className="flex items-center gap-2 mb-4">
        <Check className="h-4 w-4 text-[#3863f6]" />
        <h3 className="text-[14px] font-semibold text-[#4a4d5c]">
          주관식 정답 설정
        </h3>
      </div>
      <div>
        <label
          htmlFor={`question-${index}-answer-text`}
          className="mb-2 block text-[13px] font-semibold text-[#8b90a3]"
        >
          정답 입력
        </label>
        <Input
          id={`question-${index}-answer-text`}
          {...register(`questions.${index}.answer.text`)}
          placeholder="정답을 입력하세요"
          disabled={disabled}
          className="h-10 rounded-[10px] border-[#e9ebf0] bg-white text-[14px] font-medium text-[#4a4d5c]"
        />
        {answerTextError && (
          <p className="text-xs text-red-500 mt-1">{answerTextError}</p>
        )}
      </div>
    </div>
  );
}
