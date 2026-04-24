"use client";

import { UseFormReturn, useWatch } from "react-hook-form";

import {
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import type { ExamFormInput } from "@/validation/exam.validation";

import { QuestionAnswer } from "../questions/QuestionAnswer";
import { QuestionBody } from "../questions/QuestionBody";
import { QuestionHeader } from "../questions/QuestionHeader";

type QuestionItemProps = {
  form: UseFormReturn<ExamFormInput>;
  index: number;
  questionNumber: number;
  disabled?: boolean;
  onDelete?: () => void;
  onScoreManualChange?: () => void;
};

type QuestionErrors = {
  score?: { message?: string };
  content?: { message?: string };
  answer?: {
    selected?: { message?: string };
    text?: { message?: string };
  };
};

export function QuestionItem({
  form,
  index,
  questionNumber,
  disabled = false,
  onDelete,
  onScoreManualChange,
}: QuestionItemProps) {
  const {
    control,
    register,
    setValue,
    formState: { errors },
  } = form;

  const questionType = useWatch({
    control,
    name: `questions.${index}.type`,
  });
  const selectedAnswer = useWatch({
    control,
    name: `questions.${index}.answer.selected`,
  });
  const scoreField = register(`questions.${index}.score`, {
    setValueAs: (value) => (value === "" ? 0 : Number(value)),
  });
  const questionErrors = errors.questions?.[index] as
    | QuestionErrors
    | undefined;

  return (
    <AccordionItem
      value={`question-${questionNumber}`}
      className="overflow-hidden rounded-[14px] border border-[#eaecf2] bg-white"
    >
      <QuestionHeader
        control={control}
        index={index}
        questionNumber={questionNumber}
        scoreField={scoreField}
        scoreError={questionErrors?.score?.message}
        disabled={disabled}
        onDelete={onDelete}
        onScoreManualChange={onScoreManualChange}
      />

      <AccordionTrigger
        className="px-6 text-[13px] font-semibold text-[#8b90a3] hover:bg-[#fcfcfd]"
        disabled={disabled}
      >
        <span>상세 설정</span>
      </AccordionTrigger>
      <AccordionContent>
        <div className="space-y-4">
          <QuestionBody
            register={register}
            index={index}
            disabled={disabled}
            contentError={questionErrors?.content?.message}
          />
          <QuestionAnswer
            questionType={questionType ?? "객관식"}
            selectedAnswer={selectedAnswer}
            setValue={setValue}
            register={register}
            index={index}
            disabled={disabled}
            answerSelectedError={questionErrors?.answer?.selected?.message}
            answerTextError={questionErrors?.answer?.text?.message}
          />
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
