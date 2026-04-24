"use client";

import { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import SelectBtn from "@/components/common/button/SelectBtn";

type ScheduleOption = { label: string; value: string };
type TimeInputVariant = "native" | "text";

export type ScheduleEditorRow = {
  id: string;
  day: string;
  startTime: string;
  endTime: string;
};

type ScheduleEditorProps = {
  rows: ScheduleEditorRow[];
  dayOptions: ScheduleOption[];
  onChange: (
    id: string,
    field: "day" | "startTime" | "endTime",
    value: string
  ) => void;
  onAdd: () => void;
  onRemove: (id: string) => void;
  showAddButton?: boolean;
  layoutVariant?: "default" | "compact";
  inputClassName?: string;
  selectClassName?: string;
  selectVariant?: "default" | "figma";
  timeInputVariant?: TimeInputVariant;
  startTimePlaceholder?: string;
  endTimePlaceholder?: string;
  renderRemoveButton?: (id: string) => ReactNode;
};

const normalizeTimeInput = (value: string) => {
  const digits = value.replace(/\D/g, "").slice(0, 4);

  if (digits.length <= 2) {
    return digits;
  }

  if (digits.length === 3) {
    const firstTwo = Number(digits.slice(0, 2));
    if (Number.isNaN(firstTwo) || firstTwo > 23) {
      return `0${digits[0]}:${digits.slice(1)}`;
    }
    return `${digits.slice(0, 2)}:${digits.slice(2)}`;
  }

  return `${digits.slice(0, 2)}:${digits.slice(2, 4)}`;
};

export function ScheduleEditor({
  rows,
  dayOptions,
  onChange,
  onAdd,
  onRemove,
  showAddButton = true,
  layoutVariant = "default",
  inputClassName,
  selectClassName,
  selectVariant = "default",
  timeInputVariant = "native",
  startTimePlaceholder = "시작 시간",
  endTimePlaceholder = "종료 시간",
  renderRemoveButton,
}: ScheduleEditorProps) {
  const rowClassName =
    layoutVariant === "compact"
      ? "grid grid-cols-[1fr_1fr_1fr_48px] gap-3 items-center"
      : "grid grid-cols-12 gap-2 items-center";
  const isTextTimeInput = timeInputVariant === "text";

  return (
    <div className="space-y-2">
      {rows.map((row) => (
        <div key={row.id} className={rowClassName}>
          <div className={layoutVariant === "compact" ? "" : "col-span-4"}>
            <SelectBtn
              value={row.day}
              placeholder="요일"
              options={dayOptions}
              onChange={(value) => onChange(row.id, "day", value)}
              className={selectClassName}
              variant={selectVariant}
            />
          </div>
          <div className={layoutVariant === "compact" ? "" : "col-span-3"}>
            <Input
              type={isTextTimeInput ? "text" : "time"}
              value={row.startTime}
              aria-label="시작 시간"
              onChange={(event) =>
                onChange(
                  row.id,
                  "startTime",
                  isTextTimeInput
                    ? normalizeTimeInput(event.target.value)
                    : event.target.value
                )
              }
              placeholder={isTextTimeInput ? startTimePlaceholder : undefined}
              inputMode={isTextTimeInput ? "numeric" : undefined}
              maxLength={isTextTimeInput ? 5 : undefined}
              className={inputClassName}
            />
          </div>
          <div className={layoutVariant === "compact" ? "" : "col-span-3"}>
            <Input
              type={isTextTimeInput ? "text" : "time"}
              value={row.endTime}
              aria-label="종료 시간"
              onChange={(event) =>
                onChange(
                  row.id,
                  "endTime",
                  isTextTimeInput
                    ? normalizeTimeInput(event.target.value)
                    : event.target.value
                )
              }
              placeholder={isTextTimeInput ? endTimePlaceholder : undefined}
              inputMode={isTextTimeInput ? "numeric" : undefined}
              maxLength={isTextTimeInput ? 5 : undefined}
              className={inputClassName}
            />
          </div>
          <div
            className={
              layoutVariant === "compact" ? "" : "col-span-2 text-right"
            }
          >
            {renderRemoveButton ? (
              renderRemoveButton(row.id)
            ) : (
              <Button
                variant="outline"
                size="default"
                onClick={() => onRemove(row.id)}
              >
                삭제
              </Button>
            )}
          </div>
        </div>
      ))}
      {showAddButton ? (
        <Button variant="outline" size="default" onClick={onAdd}>
          + 시간 추가
        </Button>
      ) : null}
    </div>
  );
}
