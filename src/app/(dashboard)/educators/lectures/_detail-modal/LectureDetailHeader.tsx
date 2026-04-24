"use client";

import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type LectureDetailHeaderProps = {
  isEditing: boolean;
  onSave: () => void;
  onCancel: () => void;
  onEditStart: () => void;
  onClose: () => void;
};

export function LectureDetailHeader({
  isEditing,
  onSave,
  onCancel,
  onEditStart,
  onClose,
}: LectureDetailHeaderProps) {
  return (
    <div className="flex items-center justify-between border-b border-[#f4f6fa] px-6 py-4 sm:px-10 sm:py-6">
      <DialogHeader className="space-y-0">
        <DialogTitle className="text-[22px] font-bold leading-[30px] tracking-[-0.22px] text-[rgba(22,22,27,0.88)]">
          수업 상세
        </DialogTitle>
      </DialogHeader>

      <div className="flex items-center gap-2">
        {isEditing ? (
          <>
            <Button
              onClick={onSave}
              className="h-12 rounded-[12px] bg-[#3863f6] px-7 text-[14px] font-semibold leading-5 tracking-[-0.14px] text-white shadow-[0_0_14px_rgba(138,138,138,0.08)] hover:bg-[#2f57e8]"
            >
              완료
            </Button>
            <Button
              variant="outline"
              onClick={onCancel}
              className="h-12 rounded-[12px] border border-[#ced9fd] bg-[#e1e7fe] px-7 text-[14px] font-semibold leading-5 tracking-[-0.14px] text-[#3863f6] shadow-[0_0_14px_rgba(138,138,138,0.08)] hover:bg-[#d7e0fe]"
            >
              취소
            </Button>
          </>
        ) : (
          <>
            <Button
              onClick={onEditStart}
              className="h-12 rounded-[12px] bg-[#3863f6] px-7 text-[14px] font-semibold leading-5 tracking-[-0.14px] text-white shadow-[0_0_14px_rgba(138,138,138,0.08)] hover:bg-[#2f57e8]"
            >
              수정하기
            </Button>
            <Button
              variant="outline"
              onClick={onClose}
              className="h-12 rounded-[12px] border border-[#ced9fd] bg-[#e1e7fe] px-7 text-[14px] font-semibold leading-5 tracking-[-0.14px] text-[#3863f6] shadow-[0_0_14px_rgba(138,138,138,0.08)] hover:bg-[#d7e0fe]"
            >
              닫기
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
