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
    <Card>
      <div className="p-6 border-b flex justify-between items-center">
        <h2 className="text-xl font-semibold">문항별 정답 및 배점 설정</h2>
        <Button type="button" onClick={onAdd} disabled={disabled}>
          문항 추가
        </Button>
      </div>
      <CardContent className="p-6">
        {fields.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
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
