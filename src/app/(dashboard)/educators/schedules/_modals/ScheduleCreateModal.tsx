"use client";

import { memo } from "react";

import SelectBtn from "@/components/common/button/SelectBtn";
import { DatePickerInput } from "@/components/common/input/DatePickerField";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import type {
  ScheduleCategoryOption,
  ScheduleFormState,
  ScheduleModalMode,
} from "@/types/schedules";

type ScheduleCreateModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categoryOptions: ScheduleCategoryOption[];
  isSubmitting: boolean;
  mode: ScheduleModalMode;
  isDeleting: boolean;
  formState: ScheduleFormState;
  onFormChange: (
    updater:
      | ScheduleFormState
      | ((prev: ScheduleFormState) => ScheduleFormState)
  ) => void;
  formError: string | null;
  onEnableEdit: () => void;
  onSubmit: () => void;
  onDelete: () => void;
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

const getMeridiemLabel = (time: string) => {
  const matched = time.match(/^([01]\d|2[0-3]):([0-5]\d)$/);
  if (!matched) {
    return null;
  }

  const hour = Number(matched[1]);
  return hour < 12
    ? { label: "AM 오전", className: "bg-sky-100 text-sky-700" }
    : { label: "PM 오후", className: "bg-amber-100 text-amber-700" };
};

function ScheduleCreateModalComponent({
  open,
  onOpenChange,
  categoryOptions,
  isSubmitting,
  mode,
  isDeleting,
  formState,
  onFormChange,
  formError,
  onEnableEdit,
  onSubmit,
  onDelete,
}: ScheduleCreateModalProps) {
  const isEditMode = mode === "view" || mode === "edit";
  const isEditableMode = mode === "edit";
  const isReadonlyView = mode === "view";
  const isActionLocked = isSubmitting || isDeleting;
  const isFormDisabled = isActionLocked || isReadonlyView;
  const startMeridiem = getMeridiemLabel(formState.startTime);
  const endMeridiem = getMeridiemLabel(formState.endTime);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {isEditMode
              ? isReadonlyView
                ? "일정 확인"
                : "일정 수정"
              : "일정 생성"}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="schedule-title">일정 제목</Label>
            <Input
              id="schedule-title"
              value={formState.title}
              onChange={(event) =>
                onFormChange((prev) => ({ ...prev, title: event.target.value }))
              }
              placeholder="예: 수학 모의고사"
              className="h-11"
              disabled={isFormDisabled}
            />
          </div>
          <div className="space-y-3 rounded-lg border border-neutral-200 p-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <Label htmlFor="schedule-date">일정 날짜</Label>
                <label className="inline-flex items-center gap-1.5 px-1 py-0.5 text-xs font-medium text-neutral-700">
                  <Checkbox
                    checked={formState.isAllDay}
                    disabled={isFormDisabled}
                    onCheckedChange={(checked) =>
                      onFormChange((prev) => ({
                        ...prev,
                        isAllDay: Boolean(checked),
                        startTime: Boolean(checked) ? "" : prev.startTime,
                        endTime: Boolean(checked) ? "" : prev.endTime,
                      }))
                    }
                  />
                  종일 일정
                </label>
              </div>
              <DatePickerInput
                id="schedule-date"
                value={formState.date}
                onChangeAction={(value) =>
                  onFormChange((prev) => ({
                    ...prev,
                    date: value,
                  }))
                }
                className="h-11 rounded-md border-input text-sm"
                disabled={isFormDisabled}
              />
            </div>

            <div className="grid gap-3">
              <div className="space-y-2">
                <Label htmlFor="schedule-start-time">시작 시간</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="schedule-start-time"
                    type="text"
                    value={formState.startTime}
                    onChange={(event) =>
                      onFormChange((prev) => ({
                        ...prev,
                        startTime: normalizeTimeInput(event.target.value),
                      }))
                    }
                    disabled={isFormDisabled || formState.isAllDay}
                    placeholder="시작 시간"
                    inputMode="numeric"
                    maxLength={5}
                    className="h-11"
                  />
                  <span
                    className={`inline-flex h-9 min-w-[76px] items-center justify-center rounded-full px-3 text-xs font-semibold ${
                      startMeridiem?.className ??
                      "bg-muted text-muted-foreground"
                    }`}
                  >
                    {startMeridiem?.label ?? "시간 입력"}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="schedule-end-time">종료 시간</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="schedule-end-time"
                    type="text"
                    value={formState.endTime}
                    onChange={(event) =>
                      onFormChange((prev) => ({
                        ...prev,
                        endTime: normalizeTimeInput(event.target.value),
                      }))
                    }
                    disabled={isFormDisabled || formState.isAllDay}
                    placeholder="종료 시간"
                    inputMode="numeric"
                    maxLength={5}
                    className="h-11"
                  />
                  <span
                    className={`inline-flex h-9 min-w-[76px] items-center justify-center rounded-full px-3 text-xs font-semibold ${
                      endMeridiem?.className ?? "bg-muted text-muted-foreground"
                    }`}
                  >
                    {endMeridiem?.label ?? "시간 입력"}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <Label>일정 분류</Label>
            <SelectBtn
              value={formState.categoryId}
              onChange={(value) =>
                onFormChange((prev) => ({
                  ...prev,
                  categoryId: value,
                }))
              }
              placeholder="분류 선택"
              options={categoryOptions.map((option) => ({
                label: option.name,
                value: option.id,
              }))}
              disabled={isFormDisabled}
              variant="figma"
              optionSize="sm"
              className="h-11"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="schedule-desc">일정 내용</Label>
            <Textarea
              id="schedule-desc"
              value={formState.description}
              onChange={(event) =>
                onFormChange((prev) => ({
                  ...prev,
                  description: event.target.value,
                }))
              }
              placeholder="예: 모의고사 대비 특강 진행"
              className="min-h-[96px]"
              disabled={isFormDisabled}
            />
          </div>
          {formError ? (
            <p className="text-xs text-destructive">{formError}</p>
          ) : null}
        </div>
        <DialogFooter className="mt-4">
          {isEditableMode ? (
            <Button
              type="button"
              variant="outline"
              className="text-destructive"
              onClick={onDelete}
              disabled={isActionLocked}
            >
              {isDeleting ? "삭제 중..." : "삭제"}
            </Button>
          ) : null}
          <Button
            type="button"
            className="gap-2"
            onClick={() => {
              if (isReadonlyView) {
                onEnableEdit();
                return;
              }

              onSubmit();
            }}
            disabled={isActionLocked}
          >
            {isReadonlyView
              ? "수정"
              : isSubmitting
                ? isEditMode
                  ? "저장 중..."
                  : "등록 중..."
                : isEditMode
                  ? "저장"
                  : "등록"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export const ScheduleCreateModal = memo(ScheduleCreateModalComponent);
ScheduleCreateModal.displayName = "ScheduleCreateModal";
