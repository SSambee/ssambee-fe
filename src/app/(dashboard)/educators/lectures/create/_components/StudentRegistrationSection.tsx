"use client";

import { ReactNode } from "react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type StudentRegistrationSectionProps = {
  disabled: boolean;
  children: ReactNode;
  actionLabel?: string;
  onAction?: () => void;
};

export function StudentRegistrationSection({
  disabled,
  children,
  actionLabel,
  onAction,
}: StudentRegistrationSectionProps) {
  return (
    <Card className="rounded-[24px] border-0 shadow-[0_0_14px_rgba(138,138,138,0.08)]">
      <div className="flex items-center justify-between px-8 pb-6 pt-8">
        <h2 className="text-[24px] font-bold leading-[32px] tracking-[-0.24px] text-[#040405]">
          학생 등록
        </h2>
        {actionLabel && onAction ? (
          <Button
            type="button"
            onClick={onAction}
            disabled={disabled}
            variant="outline"
            className="h-12 rounded-xl border border-[#ced9fd] bg-[#f4f6fe] px-7 text-[14px] font-semibold leading-[20px] tracking-[-0.14px] text-[#3863f6] shadow-[0_0_14px_rgba(138,138,138,0.08)]"
          >
            {actionLabel}
          </Button>
        ) : null}
      </div>
      <CardContent className="px-8 pb-8">
        {disabled ? (
          <div className="mb-4 text-sm text-muted-foreground">
            저장 완료 후에는 수정할 수 없습니다.
          </div>
        ) : null}
        {children}
      </CardContent>
    </Card>
  );
}
