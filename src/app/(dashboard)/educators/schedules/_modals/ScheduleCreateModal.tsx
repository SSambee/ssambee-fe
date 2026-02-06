"use client";

import SelectBtn from "@/components/common/button/SelectBtn";
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
import {
  scheduleCategoryOptions,
  type ScheduleCategory,
} from "@/data/schedules.mock";
import type { ScheduleFormState } from "@/app/(dashboard)/educators/schedules/_hooks/useScheduleEvents";

type ScheduleCreateModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formState: ScheduleFormState;
  onFormChange: (
    updater:
      | ScheduleFormState
      | ((prev: ScheduleFormState) => ScheduleFormState)
  ) => void;
  formError: string | null;
  onClose: () => void;
  onSubmit: () => void;
};

export function ScheduleCreateModal({
  open,
  onOpenChange,
  formState,
  onFormChange,
  formError,
  onClose,
  onSubmit,
}: ScheduleCreateModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>일정 생성</DialogTitle>
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
            />
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="schedule-date">일정 날짜</Label>
              <Input
                id="schedule-date"
                type="date"
                value={formState.date}
                onChange={(event) =>
                  onFormChange((prev) => ({
                    ...prev,
                    date: event.target.value,
                  }))
                }
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="schedule-time">시간</Label>
              <Input
                id="schedule-time"
                type="time"
                value={formState.time}
                onChange={(event) =>
                  onFormChange((prev) => ({
                    ...prev,
                    time: event.target.value,
                  }))
                }
                className="h-11"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>일정 분류</Label>
            <SelectBtn
              value={formState.category}
              onChange={(value) =>
                onFormChange((prev) => ({
                  ...prev,
                  category: value as ScheduleCategory,
                }))
              }
              placeholder="분류 선택"
              options={scheduleCategoryOptions.map((option) => ({
                label: option.label,
                value: option.value,
              }))}
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
            />
          </div>
          {formError ? (
            <p className="text-xs text-destructive">{formError}</p>
          ) : null}
        </div>
        <DialogFooter className="mt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            취소
          </Button>
          <Button type="button" className="gap-2" onClick={onSubmit}>
            등록
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
