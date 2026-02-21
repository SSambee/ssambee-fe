"use client";

import { memo } from "react";
import { ChevronDown } from "lucide-react";

import SelectBtn from "@/components/common/button/SelectBtn";
import { DatePickerInput } from "@/components/common/input/DatePickerField";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
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

  const modalTitle = isEditMode
    ? isReadonlyView
      ? "일정 확인"
      : "일정 수정"
    : "일정 생성";

  const modalSubtitle = isEditMode
    ? isReadonlyView
      ? "일정을 확인하고 필요하면 수정해 주세요"
      : "변경 내용을 확인하고 저장해 주세요"
    : "새로운 일정을 추가해주세요";

  const primaryActionLabel = isReadonlyView
    ? "수정하기"
    : isSubmitting
      ? isEditMode
        ? "저장 중..."
        : "등록 중..."
      : isEditMode
        ? "저장하기"
        : "등록하기";

  const handlePrimaryAction = () => {
    if (isReadonlyView) {
      onEnableEdit();
      return;
    }

    onSubmit();
  };

  const handleSecondaryAction = () => {
    onOpenChange(false);
  };

  const fieldLabelClass =
    "text-[16px] font-semibold leading-6 tracking-[-0.16px] text-[#5e6275]";
  const fieldInputClass =
    "h-12 rounded-[12px] border-[#d6d9e0] bg-white px-4 text-[15px] font-medium leading-6 tracking-[-0.16px] text-[#2b2e3a] shadow-none placeholder:text-[#8b90a3] focus-visible:ring-0 md:text-[15px]";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showClose={false}
        className="w-[calc(100vw-32px)] max-h-[86vh] max-w-[610px] gap-5 overflow-y-auto border-none bg-white p-5 shadow-[0_0_14px_rgba(138,138,138,0.16)] sm:gap-6 sm:rounded-[24px] sm:p-6"
      >
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <DialogHeader className="space-y-1 text-left">
            <DialogTitle className="text-[22px] font-bold leading-8 tracking-[-0.24px] text-[#040405]">
              {modalTitle}
            </DialogTitle>
            <p className="text-[16px] font-medium leading-6 tracking-[-0.16px] text-[rgba(22,22,27,0.4)]">
              {modalSubtitle}
            </p>
          </DialogHeader>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              className="h-11 w-[112px] rounded-[12px] bg-[#3863f6] px-6 text-[14px] font-semibold leading-5 tracking-[-0.14px] text-white shadow-[0_0_14px_rgba(138,138,138,0.08)] hover:bg-[#2f57e8]"
              onClick={handlePrimaryAction}
              disabled={isActionLocked}
            >
              {primaryActionLabel}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="h-11 w-[112px] rounded-[12px] border-none bg-[#e1e7fe] px-6 text-[14px] font-semibold leading-5 tracking-[-0.14px] text-[#3863f6] shadow-[0_0_14px_rgba(138,138,138,0.08)] hover:bg-[#d3ddfe]"
              onClick={handleSecondaryAction}
              disabled={isActionLocked}
            >
              취소
            </Button>
          </div>
        </div>

        <div className="rounded-[20px] border border-[#e9ebf0] bg-[#fcfcfd] px-5 pb-5 pt-4">
          <div className="space-y-5">
            <div className="space-y-3">
              <Label htmlFor="schedule-title" className={fieldLabelClass}>
                일정 제목
              </Label>
              <Input
                id="schedule-title"
                value={formState.title}
                onChange={(event) =>
                  onFormChange((prev) => ({
                    ...prev,
                    title: event.target.value,
                  }))
                }
                placeholder="제목을 입력해주세요"
                className={fieldInputClass}
                disabled={isFormDisabled}
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <Label htmlFor="schedule-date" className={fieldLabelClass}>
                  일정 날짜
                </Label>
                <Label
                  htmlFor="schedule-all-day"
                  className="inline-flex items-center gap-1 text-[16px] font-medium leading-6 tracking-[-0.16px] text-[rgba(22,22,27,0.88)]"
                >
                  <Checkbox
                    id="schedule-all-day"
                    checked={formState.isAllDay}
                    disabled={isFormDisabled}
                    className="h-[18px] w-[18px] rounded-[3px] border-2 border-[rgba(22,22,27,0.4)] data-[state=checked]:border-[#3863f6] data-[state=checked]:bg-[#3863f6]"
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
                </Label>
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
                className={fieldInputClass}
                disabled={isFormDisabled}
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="schedule-start-time" className={fieldLabelClass}>
                시작 시간
              </Label>
              <div className="relative">
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
                  placeholder="시간 선택"
                  inputMode="numeric"
                  maxLength={5}
                  className={`${fieldInputClass} pr-11`}
                />
                <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#8b90a3]" />
              </div>
            </div>

            <div className="space-y-3">
              <Label htmlFor="schedule-end-time" className={fieldLabelClass}>
                종료 시간
              </Label>
              <div className="relative">
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
                  placeholder="시간 선택"
                  inputMode="numeric"
                  maxLength={5}
                  className={`${fieldInputClass} pr-11`}
                />
                <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#8b90a3]" />
              </div>
            </div>

            <div className="space-y-3">
              <Label htmlFor="schedule-category" className={fieldLabelClass}>
                일정 분류
              </Label>
              <SelectBtn
                id="schedule-category"
                value={formState.categoryId}
                onChange={(value) =>
                  onFormChange((prev) => ({
                    ...prev,
                    categoryId: value,
                  }))
                }
                placeholder="카테고리 선택"
                options={categoryOptions.map((option) => ({
                  label: option.name,
                  value: option.id,
                }))}
                disabled={isFormDisabled}
                variant="figma"
                optionSize="sm"
                className="h-12 rounded-[12px] border-[#d6d9e0] text-[15px] font-medium leading-6 tracking-[-0.15px] text-[#8b90a3]"
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="schedule-desc" className={fieldLabelClass}>
                일정 내용
              </Label>
              <Textarea
                id="schedule-desc"
                value={formState.description}
                onChange={(event) =>
                  onFormChange((prev) => ({
                    ...prev,
                    description: event.target.value,
                  }))
                }
                placeholder="일정 상세 내용을 입력해주세요"
                className="h-[100px] min-h-[100px] rounded-[12px] border-[#d6d9e0] bg-white px-4 py-3 text-[15px] font-medium leading-6 tracking-[-0.16px] text-[#2b2e3a] shadow-none placeholder:text-[15px] placeholder:font-medium placeholder:leading-6 placeholder:tracking-[-0.16px] placeholder:text-[#8b90a3] focus-visible:ring-0 md:text-[15px]"
                disabled={isFormDisabled}
              />
            </div>
          </div>
        </div>

        <div className="flex items-start justify-between">
          {formError ? (
            <p className="text-xs text-destructive">{formError}</p>
          ) : (
            <span />
          )}

          {isEditableMode ? (
            <Button
              type="button"
              variant="outline"
              className="h-auto border-none p-0 text-[14px] font-semibold leading-5 text-destructive shadow-none hover:bg-transparent"
              onClick={onDelete}
              disabled={isActionLocked}
            >
              {isDeleting ? "삭제 중..." : "일정 삭제"}
            </Button>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export const ScheduleCreateModal = memo(ScheduleCreateModalComponent);
ScheduleCreateModal.displayName = "ScheduleCreateModal";
