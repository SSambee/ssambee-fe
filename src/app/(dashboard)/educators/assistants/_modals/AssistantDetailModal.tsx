import { CheckSquare } from "lucide-react";

import {
  type Assistant,
  type AssistantDetailDraft,
  type AssistantStatus,
} from "@/types/assistants";
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
      <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto rounded-[24px] border border-[#eaecf2] p-6 sm:p-7">
        <DialogHeader className="border-b border-[#eaecf2] pb-4 text-left">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarFallback>
                {selectedAssistant?.name.slice(0, 1)}
              </AvatarFallback>
            </Avatar>
            <div>
              <DialogTitle className="text-[22px] font-bold tracking-[-0.22px] text-[#040405]">
                {selectedAssistant?.name}
              </DialogTitle>
              <DialogDescription className="mt-1 text-base text-[#8b90a3]">
                현재 상태 {assistantDetailDraft.status}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <p className="text-sm font-semibold text-[#4a4d5c]">이름</p>
            <Input
              value={selectedAssistant?.name ?? ""}
              readOnly
              className="h-10 rounded-[12px] border-[#e9ebf0] bg-[#fcfcfd]"
            />
          </div>
          <div className="space-y-2">
            <p className="text-sm font-semibold text-[#4a4d5c]">연락처</p>
            <Input
              value={selectedAssistant?.phone ?? ""}
              readOnly
              className="h-10 rounded-[12px] border-[#e9ebf0] bg-[#fcfcfd]"
            />
          </div>
          <div className="space-y-2">
            <p className="text-sm font-semibold text-[#4a4d5c]">이메일</p>
            <Input
              value={selectedAssistant?.email ?? ""}
              readOnly
              className="h-10 rounded-[12px] border-[#e9ebf0] bg-[#fcfcfd]"
            />
          </div>
          <div className="space-y-2">
            <p className="text-sm font-semibold text-[#4a4d5c]">상태</p>
            {isEditingAssistantDetail ? (
              <Select
                value={
                  assistantDetailDraft.status === "퇴사"
                    ? "근무중"
                    : assistantDetailDraft.status
                }
                onValueChange={onChangeStatus}
              >
                <SelectTrigger className="h-10 rounded-[12px] border-[#e9ebf0] bg-[#fcfcfd] text-[#6b6f80]">
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
              <Input
                value={assistantDetailDraft.status}
                readOnly
                className="h-10 rounded-[12px] border-[#e9ebf0] bg-[#fcfcfd]"
              />
            )}
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-semibold text-[#4a4d5c]">메모</p>
          <Textarea
            value={assistantDetailDraft.memo}
            readOnly={!isEditingAssistantDetail}
            className="min-h-[100px] rounded-[12px] border-[#e9ebf0] bg-[#fcfcfd]"
            placeholder="조교 운영 메모를 입력하세요."
            onChange={(event) => onChangeMemo(event.target.value)}
          />
        </div>

        <DialogFooter className="gap-2 border-t border-[#eaecf2] pt-4">
          {isEditingAssistantDetail ? (
            <>
              <Button
                variant="outline"
                className="h-10 rounded-[12px] border-[#d6d9e0] bg-white px-4 text-[#6b6f80] hover:bg-[#fcfcfd] hover:text-[#5e6275]"
                onClick={onRetireAssistant}
                disabled={
                  selectedAssistant?.status === "퇴사" || isRetiringAssistant
                }
              >
                {isRetiringAssistant ? "처리 중..." : "퇴사 처리"}
              </Button>
              <Button
                variant="outline"
                className="h-10 rounded-[12px] border-[#d6d9e0] bg-white px-4 text-[#6b6f80] hover:bg-[#fcfcfd] hover:text-[#5e6275]"
                onClick={onCancelEdit}
                disabled={isRetiringAssistant}
              >
                취소
              </Button>
              <Button
                className="h-10 rounded-[12px] bg-[#3863f6] px-4 text-white hover:bg-[#2f57e8]"
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
                className="h-10 rounded-[12px] border-[#d6d9e0] bg-white px-4 text-[#6b6f80] hover:bg-[#fcfcfd] hover:text-[#5e6275]"
                onClick={onCloseDetail}
                disabled={isRetiringAssistant}
              >
                닫기
              </Button>
              <Button
                variant="outline"
                className="h-10 rounded-[12px] border-[#d6d9e0] bg-white px-4 text-[#6b6f80] hover:bg-[#fcfcfd] hover:text-[#5e6275]"
                onClick={onRetireAssistant}
                disabled={
                  selectedAssistant?.status === "퇴사" || isRetiringAssistant
                }
              >
                {isRetiringAssistant ? "처리 중..." : "퇴사 처리"}
              </Button>
              <Button
                className="h-10 rounded-[12px] bg-[#3863f6] px-4 text-white hover:bg-[#2f57e8]"
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
