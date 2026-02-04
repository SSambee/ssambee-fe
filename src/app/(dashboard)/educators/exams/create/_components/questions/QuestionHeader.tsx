"use client";

import { Trash2 } from "lucide-react";
import type { Control, UseFormRegisterReturn } from "react-hook-form";
import { Controller } from "react-hook-form";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ExamFormInput } from "@/validation/exam.validation";

type QuestionHeaderProps = {
  control: Control<ExamFormInput>;
  index: number;
  questionNumber: number;
  scoreField: UseFormRegisterReturn;
  scoreError?: string;
  disabled?: boolean;
  onDelete?: () => void;
  onScoreManualChange?: () => void;
};

export function QuestionHeader({
  control,
  index,
  questionNumber,
  scoreField,
  scoreError,
  disabled = false,
  onDelete,
  onScoreManualChange,
}: QuestionHeaderProps) {
  return (
    <div className="flex items-center gap-4 px-6 py-4 border-b">
      <div className="flex items-center gap-4 flex-1">
        <div className="flex items-center gap-2">
          <div className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
            {questionNumber}
          </div>
          <Controller
            name={`questions.${index}.type`}
            control={control}
            render={({ field }) => (
              <Select
                value={field.value}
                onValueChange={field.onChange}
                disabled={disabled}
              >
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="객관식">객관식</SelectItem>
                  <SelectItem value="주관식">주관식</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Input
              type="number"
              min={0}
              step={1}
              {...scoreField}
              onChange={(event) => {
                scoreField.onChange(event);
                if (!disabled) {
                  onScoreManualChange?.();
                }
              }}
              disabled={disabled}
              className="w-20"
            />
            <span className="text-sm text-muted-foreground">점</span>
          </div>
          {scoreError && <p className="text-xs text-red-500">{scoreError}</p>}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onDelete}
          disabled={disabled}
          aria-label={`문항 ${questionNumber} 삭제`}
          className="p-2 rounded-md hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
