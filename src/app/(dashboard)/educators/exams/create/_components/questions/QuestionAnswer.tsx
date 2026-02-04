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
      <div className="border border-blue-500/20 bg-blue-500/5 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-4">
          <Check className="h-4 w-4 text-blue-500" />
          <h3 className="font-medium">객관식 정답 설정</h3>
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
                "w-12 h-12 rounded-full border-2 font-medium transition-colors " +
                (selectedAnswer === num
                  ? "bg-blue-500 border-blue-500 text-white"
                  : "bg-background border-input hover:bg-accent") +
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
    <div className="border border-blue-500/20 bg-blue-500/5 rounded-lg p-4">
      <div className="flex items-center gap-2 mb-4">
        <Check className="h-4 w-4 text-blue-500" />
        <h3 className="font-medium">주관식 정답 설정</h3>
      </div>
      <div>
        <label
          htmlFor={`question-${index}-answer-text`}
          className="block text-sm font-medium mb-2"
        >
          정답 입력
        </label>
        <Input
          id={`question-${index}-answer-text`}
          {...register(`questions.${index}.answer.text`)}
          placeholder="정답을 입력하세요"
          disabled={disabled}
        />
        {answerTextError && (
          <p className="text-xs text-red-500 mt-1">{answerTextError}</p>
        )}
      </div>
    </div>
  );
}
