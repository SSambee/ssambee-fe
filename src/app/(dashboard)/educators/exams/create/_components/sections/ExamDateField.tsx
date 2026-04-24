"use client";

import { CalendarIcon } from "lucide-react";
import type { Control, FieldErrors } from "react-hook-form";
import { Controller } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import type { ExamFormInput } from "@/validation/exam.validation";

type ExamDateFieldProps = {
  control: Control<ExamFormInput>;
  errors: FieldErrors<ExamFormInput>;
  disabled?: boolean;
};

const parseYMD = (value?: string) => {
  if (!value) return undefined;
  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return undefined;
  return new Date(year, month - 1, day);
};

const formatDateLabel = (value?: string) => {
  if (!value) return "시험일 선택";
  return value.split("-").join(". ");
};

const formatDateToYMD = (date: Date) => {
  return date.toLocaleDateString("sv-SE", { timeZone: "Asia/Seoul" });
};

export function ExamDateField({
  control,
  errors,
  disabled = false,
}: ExamDateFieldProps) {
  return (
    <div>
      <label
        htmlFor="exam-date"
        className="mb-2 block text-[14px] font-semibold text-[#8b90a3]"
      >
        시험일 <span className="text-red-500">*</span>
      </label>
      <Controller
        name="examDate"
        control={control}
        render={({ field }) => (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="exam-date"
                type="button"
                variant="outline"
                disabled={disabled}
                className={cn(
                  "h-12 w-full justify-start rounded-[12px] border-[#e9ebf0] bg-[#fcfcfd] text-left text-[14px] font-medium text-[#4a4d5c]",
                  !field.value && "text-[#8b90a3]"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formatDateLabel(field.value ?? "")}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={parseYMD(field.value ?? "")}
                onSelect={(date) => {
                  if (!date) {
                    field.onChange("");
                    return;
                  }
                  field.onChange(formatDateToYMD(date));
                }}
                disabled={disabled}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        )}
      />
      {errors.examDate && (
        <p className="text-xs text-red-500 mt-1">{errors.examDate.message}</p>
      )}
    </div>
  );
}
