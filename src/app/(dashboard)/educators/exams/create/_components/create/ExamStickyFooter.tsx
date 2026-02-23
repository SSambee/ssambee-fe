"use client";

import { Button } from "@/components/ui/button";

type ExamStickyFooterProps = {
  totalQuestions: number;
  totalScore: number;
  isSaving?: boolean;
  isSaveDisabled?: boolean;
  showEditButton?: boolean;
  onEdit?: () => void;
  onBack?: () => void;
  backLabel?: string;
  onSave?: () => void;
};

export function ExamStickyFooter({
  totalQuestions,
  totalScore,
  isSaving = false,
  isSaveDisabled = false,
  showEditButton = false,
  onEdit,
  onBack,
  backLabel = "뒤로가기",
  onSave,
}: ExamStickyFooterProps) {
  const isBusy = isSaving || isSaveDisabled;

  return (
    <div className="fixed inset-x-0 bottom-4 z-50 flex justify-center px-4">
      <div className="w-full max-w-5xl rounded-[20px] border border-[#d6d9e0] bg-white/95 shadow-[0_0_14px_rgba(138,138,138,0.16)] backdrop-blur supports-[backdrop-filter]:bg-white/90">
        <div className="flex flex-col gap-4 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-4 text-[13px]">
            <div className="flex items-baseline gap-2">
              <span className="font-medium text-[#8b90a3]">등록된 문항</span>
              <span className="text-[18px] font-semibold text-[#4a4d5c]">
                {totalQuestions}
              </span>
              <span className="font-medium text-[#8b90a3]">문항</span>
            </div>
            <div className="hidden h-4 w-px bg-[#d6d9e0] sm:block" />
            <div className="flex items-baseline gap-2">
              <span className="font-medium text-[#8b90a3]">총점</span>
              <span className="text-[18px] font-semibold text-[#4a4d5c]">
                {totalScore}
              </span>
              <span className="font-medium text-[#8b90a3]">점</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {showEditButton && (
              <Button
                onClick={onEdit}
                variant="secondary"
                disabled={isSaving}
                className="h-10 rounded-[10px] bg-[#f4f6fe] px-4 text-[13px] font-semibold text-[#3863f6] hover:bg-[#e1e7fe]"
              >
                수정
              </Button>
            )}
            {onBack && (
              <Button
                onClick={onBack}
                variant="outline"
                disabled={isSaving}
                className="h-10 rounded-[10px] border-[#d6d9e0] px-4 text-[13px] font-semibold text-[#6b6f80] hover:bg-[#fcfcfd] hover:text-[#5e6275]"
              >
                {backLabel}
              </Button>
            )}
            <Button
              onClick={onSave}
              disabled={isBusy}
              className="h-10 rounded-[10px] bg-[#3863f6] px-6 text-[13px] font-semibold text-white hover:bg-[#2f57e8]"
            >
              저장
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
