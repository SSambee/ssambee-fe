import { CheckSquare, ClipboardCheck, FileText } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { type Assistant, type ResourceLibraryItem } from "@/types/assistants";
import { DatePickerField } from "@/components/common/input/DatePickerField";
import TiptapEditor from "@/components/common/editor/TiptapEditor";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { AssistantOrderPriority } from "@/types/assistantOrders";

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

const deadlineInputClassName =
  "h-14 rounded-[12px] border-[#d6d9e0] bg-white text-[16px] text-[#8b90a3] placeholder:text-[#8b90a3]";

type TaskCreateModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  instructorName: string;
  assistantOptions: Assistant[];
  taskAssigneeId: string;
  onChangeTaskAssigneeId: (assistantId: string) => void;
  taskTitle: string;
  onChangeTaskTitle: (title: string) => void;
  taskPriority: AssistantOrderPriority;
  onChangeTaskPriority: (priority: AssistantOrderPriority) => void;
  taskDeadlineDate: string;
  onChangeTaskDeadlineDate: (date: string) => void;
  taskDeadlineTime: string;
  onChangeTaskDeadlineTime: (time: string) => void;
  taskInstructionContent: string;
  onChangeTaskInstructionContent: (content: string) => void;
  attachedResources: ResourceLibraryItem[];
  onOpenResourceLibraryModal: () => void;
  onRemoveAttachedResource: (resourceId: string) => void;
  onCancel: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
};

export default function TaskCreateModal({
  open,
  onOpenChange,
  instructorName,
  assistantOptions,
  taskAssigneeId,
  onChangeTaskAssigneeId,
  taskTitle,
  onChangeTaskTitle,
  taskPriority,
  onChangeTaskPriority,
  taskDeadlineDate,
  onChangeTaskDeadlineDate,
  taskDeadlineTime,
  onChangeTaskDeadlineTime,
  taskInstructionContent,
  // onChangeTaskInstructionContent,
  attachedResources,
  onOpenResourceLibraryModal,
  onRemoveAttachedResource,
  onCancel,
  onSubmit,
  isSubmitting,
}: TaskCreateModalProps) {
  const selectedAssistant =
    assistantOptions.find((assistant) => assistant.id === taskAssigneeId) ??
    null;
  const { control, reset } = useForm<{ deadlineDate: string }>({
    defaultValues: { deadlineDate: taskDeadlineDate },
  });

  useEffect(() => {
    reset({ deadlineDate: taskDeadlineDate });
  }, [reset, taskDeadlineDate]);

  const canSubmit =
    taskAssigneeId.length > 0 && taskTitle.trim().length > 0 && !isSubmitting;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
        <DialogHeader className="text-left">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-primary/10 p-2 text-primary">
              <ClipboardCheck className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold">
                새 업무 지시 등록
              </DialogTitle>
              <DialogDescription className="mt-1">
                {selectedAssistant
                  ? `${selectedAssistant.name} 조교에게 업무를 전달합니다.`
                  : "조교를 선택하여 업무를 전달합니다."}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="rounded-lg border bg-muted/40 px-4 py-3 text-xs text-muted-foreground">
          업무 지시는 상세 모달 기준으로 저장되어 조교에게 즉시 전달됩니다.
        </div>

        <div className="space-y-2">
          <p className="text-sm font-semibold">대상 조교</p>
          <Select value={taskAssigneeId} onValueChange={onChangeTaskAssigneeId}>
            <SelectTrigger>
              <SelectValue placeholder="조교를 선택하세요" />
            </SelectTrigger>
            <SelectContent>
              {assistantOptions.map((assistant) => (
                <SelectItem key={assistant.id} value={assistant.id}>
                  {assistant.name} ({assistant.phone})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {selectedAssistant ? (
            <div className="flex items-center gap-3 rounded-lg border bg-background px-4 py-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback>
                  {selectedAssistant.name.slice(0, 1)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-semibold">
                  {selectedAssistant.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {selectedAssistant.phone}
                </p>
              </div>
            </div>
          ) : null}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium">지시자</label>
            <Input value={instructorName} readOnly />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">업무명</label>
            <Input
              placeholder="예: 중등 2학년 1학기 기말고사 채점"
              value={taskTitle}
              onChange={(event) => onChangeTaskTitle(event.target.value)}
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium">우선순위</label>
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant={taskPriority === "URGENT" ? "default" : "secondary"}
                className="rounded-full"
                onClick={() => onChangeTaskPriority("URGENT")}
              >
                긴급
              </Button>
              <Button
                type="button"
                variant={taskPriority === "HIGH" ? "default" : "secondary"}
                className="rounded-full"
                onClick={() => onChangeTaskPriority("HIGH")}
              >
                높음
              </Button>
              <Button
                type="button"
                variant={taskPriority === "NORMAL" ? "default" : "secondary"}
                className="rounded-full"
                onClick={() => onChangeTaskPriority("NORMAL")}
              >
                보통
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">마감 일시</label>
            <div className="grid gap-2 sm:grid-cols-2">
              <DatePickerField
                control={control}
                name="deadlineDate"
                placeholder="마감 날짜 선택"
                className={deadlineInputClassName}
                onValueChange={onChangeTaskDeadlineDate}
              />
              <Input
                type="text"
                value={taskDeadlineTime}
                onChange={(event) =>
                  onChangeTaskDeadlineTime(
                    normalizeTimeInput(event.target.value)
                  )
                }
                disabled={!taskDeadlineDate}
                placeholder="마감 시간"
                inputMode="numeric"
                maxLength={5}
                className={deadlineInputClassName}
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">업무 내용</label>
          <TiptapEditor
            content={taskInstructionContent}
            // onChange={onChangeTaskInstructionContent}
            placeholder="업무에 대한 상세한 내용을 입력해주세요."
            className="min-h-[240px]"
          />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">첨부 자료</label>
            <Button
              type="button"
              variant="outline"
              className="rounded-full"
              onClick={onOpenResourceLibraryModal}
            >
              자료실에서 선택
            </Button>
          </div>

          {attachedResources.length === 0 ? (
            <div className="rounded-lg border border-dashed bg-muted/20 px-4 py-5 text-sm text-muted-foreground">
              선택된 자료가 없습니다. 자료실에서 검색 후 선택해 첨부하세요.
            </div>
          ) : (
            <div className="space-y-2">
              {attachedResources.map((resource) => (
                <div
                  key={resource.id}
                  className="flex items-center justify-between rounded-lg border bg-muted/20 px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">{resource.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {resource.category} · {resource.updatedAt} ·{" "}
                        {resource.sizeLabel}
                      </p>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    className="h-8 px-3 text-xs"
                    onClick={() => onRemoveAttachedResource(resource.id)}
                  >
                    제거
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" className="rounded-full" onClick={onCancel}>
            취소
          </Button>
          <Button
            className="rounded-full"
            onClick={onSubmit}
            disabled={!canSubmit}
          >
            <CheckSquare className="h-4 w-4" />
            {isSubmitting ? "등록 중..." : "지시 등록"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
