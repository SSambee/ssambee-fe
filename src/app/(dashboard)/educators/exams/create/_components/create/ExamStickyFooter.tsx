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
      <div className="w-full max-w-5xl rounded-2xl border border-border/60 bg-background/80 shadow-lg backdrop-blur supports-[backdrop-filter]:bg-background/70">
        <div className="flex flex-col gap-4 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <div className="flex items-baseline gap-2">
              <span className="text-muted-foreground">등록된 문항</span>
              <span className="text-lg font-semibold">{totalQuestions}</span>
              <span className="text-muted-foreground">문항</span>
            </div>
            <div className="hidden h-4 w-px bg-border sm:block" />
            <div className="flex items-baseline gap-2">
              <span className="text-muted-foreground">총점</span>
              <span className="text-lg font-semibold">{totalScore}</span>
              <span className="text-muted-foreground">점</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {showEditButton && (
              <Button onClick={onEdit} variant="secondary" disabled={isSaving}>
                수정
              </Button>
            )}
            {onBack && (
              <Button onClick={onBack} variant="outline" disabled={isSaving}>
                {backLabel}
              </Button>
            )}
            <Button onClick={onSave} disabled={isBusy}>
              저장
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
