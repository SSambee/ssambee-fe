import { CheckSquare } from "lucide-react";

import {
  type Assistant,
  type AssistantDetailDraft,
  type AssistantStatus,
} from "@/app/(dashboard)/educators/assistants/_types/assistants";
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
import { Textarea } from "@/components/ui/textarea";

type AssistantDetailModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedAssistant: Assistant | undefined;
  assistantDetailDraft: AssistantDetailDraft;
  isEditingAssistantDetail: boolean;
  isRetiringAssistant: boolean;
  editableStatusOptions: readonly ["근무전", "근무중"];
  onChangeStatus: (status: AssistantStatus) => void;
  onChangeMemo: (memo: string) => void;
  onRetireAssistant: () => void;
  onCancelEdit: () => void;
  onSaveDetail: () => void;
  onCloseDetail: () => void;
  onStartEdit: () => void;
};

export default function AssistantDetailModal({
  open,
  onOpenChange,
  selectedAssistant,
  assistantDetailDraft,
  isEditingAssistantDetail,
  isRetiringAssistant,
  editableStatusOptions,
  onChangeStatus,
  onChangeMemo,
  onRetireAssistant,
  onCancelEdit,
  onSaveDetail,
  onCloseDetail,
  onStartEdit,
}: AssistantDetailModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
        <DialogHeader className="text-left">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarFallback>
                {selectedAssistant?.name.slice(0, 1)}
              </AvatarFallback>
            </Avatar>
            <div>
              <DialogTitle className="text-2xl font-bold">
                {selectedAssistant?.name}
              </DialogTitle>
              <DialogDescription className="mt-1 text-base">
                현재 상태 {assistantDetailDraft.status}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-semibold">이름</label>
            <Input value={selectedAssistant?.name ?? ""} readOnly />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold">연락처</label>
            <Input value={selectedAssistant?.phone ?? ""} readOnly />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold">이메일</label>
            <Input value={selectedAssistant?.email ?? ""} readOnly />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold">상태</label>
            {isEditingAssistantDetail ? (
              <Select
                value={
                  assistantDetailDraft.status === "퇴사"
                    ? "근무중"
                    : assistantDetailDraft.status
                }
                onValueChange={onChangeStatus}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {editableStatusOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Input value={assistantDetailDraft.status} readOnly />
            )}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold">메모</label>
          <Textarea
            value={assistantDetailDraft.memo}
            readOnly={!isEditingAssistantDetail}
            className="min-h-[100px]"
            placeholder="조교 운영 메모를 입력하세요."
            onChange={(event) => onChangeMemo(event.target.value)}
          />
        </div>

        <DialogFooter className="gap-2">
          {isEditingAssistantDetail ? (
            <>
              <Button
                variant="outline"
                className="rounded-full"
                onClick={onRetireAssistant}
                disabled={
                  selectedAssistant?.status === "퇴사" || isRetiringAssistant
                }
              >
                {isRetiringAssistant ? "처리 중..." : "퇴사 처리"}
              </Button>
              <Button
                variant="outline"
                className="rounded-full"
                onClick={onCancelEdit}
                disabled={isRetiringAssistant}
              >
                취소
              </Button>
              <Button
                className="rounded-full"
                onClick={onSaveDetail}
                disabled={isRetiringAssistant}
              >
                <CheckSquare className="h-4 w-4" />
                저장
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                className="rounded-full"
                onClick={onCloseDetail}
                disabled={isRetiringAssistant}
              >
                닫기
              </Button>
              <Button
                variant="outline"
                className="rounded-full"
                onClick={onRetireAssistant}
                disabled={
                  selectedAssistant?.status === "퇴사" || isRetiringAssistant
                }
              >
                {isRetiringAssistant ? "처리 중..." : "퇴사 처리"}
              </Button>
              <Button
                className="rounded-full"
                disabled={
                  selectedAssistant?.status === "퇴사" || isRetiringAssistant
                }
                onClick={onStartEdit}
              >
                수정
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
