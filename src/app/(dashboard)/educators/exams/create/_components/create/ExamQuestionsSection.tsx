"use client";

import { FieldArrayWithId, UseFormReturn } from "react-hook-form";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Accordion } from "@/components/ui/accordion";
import { ExamFormInput } from "@/validation/exam.validation";

import { QuestionItem } from "./QuestionItem";

type ExamQuestionsSectionProps = {
  form: UseFormReturn<ExamFormInput>;
  fields: FieldArrayWithId<ExamFormInput, "questions", "fieldId">[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  onScoreManualChange?: () => void;
  disabled?: boolean;
};

export function ExamQuestionsSection({
  form,
  fields,
  onAdd,
  onRemove,
  onScoreManualChange,
  disabled = false,
}: ExamQuestionsSectionProps) {
  return (
    <Card className="rounded-[24px] border border-[#eaecf2] bg-white shadow-none">
      <div className="flex items-center justify-between border-b border-[#eaecf2] px-6 py-5">
        <h2 className="text-[20px] font-semibold tracking-[-0.2px] text-[#4a4d5c]">
          문항별 정답 및 배점 설정
        </h2>
        <Button
          type="button"
          onClick={onAdd}
          disabled={disabled}
          className="h-10 rounded-[12px] bg-[#3863f6] px-4 text-[13px] font-semibold text-white hover:bg-[#2f57e8]"
        >
          문항 추가
        </Button>
      </div>
      <CardContent className="p-6">
        {fields.length === 0 ? (
          <div className="py-12 text-center text-[14px] font-medium text-[#8b90a3]">
            문항이 없습니다. &quot;문항 추가&quot; 버튼을 클릭하여 문항을
            추가하세요.
          </div>
        ) : (
          <Accordion type="multiple" className="space-y-2">
            {fields.map((field, index) => (
              <QuestionItem
                key={field.fieldId}
                form={form}
                index={index}
                questionNumber={index + 1}
                disabled={disabled}
                onDelete={() => onRemove(index)}
                onScoreManualChange={onScoreManualChange}
              />
            ))}
          </Accordion>
        )}
      </CardContent>
    </Card>
  );
}
