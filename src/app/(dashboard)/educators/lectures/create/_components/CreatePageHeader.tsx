"use client";

import { Button } from "@/components/ui/button";

type CreatePageHeaderProps = {
  isSaved: boolean;
  isSubmitting: boolean;
  onSave: () => void;
  onCancel: () => void;
};

export function CreatePageHeader({
  isSaved,
  isSubmitting,
  onSave,
  onCancel,
}: CreatePageHeaderProps) {
  return (
    <div className="h-[140px] border-b border-[#e9ebf0] bg-white px-6 sm:px-10 lg:px-16">
      <div className="flex h-full items-center justify-between gap-6">
        <div className="flex flex-col gap-1.5">
          <h1 className="text-[24px] font-bold leading-[32px] tracking-[-0.24px] text-[#040405] lg:text-[28px] lg:leading-[38px] lg:tracking-[-0.28px]">
            수업 개설하기
          </h1>
          <p className="text-[16px] font-medium leading-6 tracking-[-0.16px] text-[rgba(22,22,27,0.4)] lg:text-[20px] lg:leading-[28px] lg:tracking-[-0.2px]">
            새로운 강의를 개설하고 수강생을 모집해보세요.
          </p>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <Button
            onClick={onSave}
            disabled={isSaved || isSubmitting}
            className="h-12 w-[112px] rounded-[12px] bg-[#3863f6] px-0 text-[14px] font-semibold leading-5 tracking-[-0.14px] text-white shadow-[0_0_14px_rgba(138,138,138,0.08)] sm:h-14 sm:w-[140px] sm:text-[16px] sm:leading-[24px] sm:tracking-[-0.16px]"
          >
            {isSubmitting ? "개설 중..." : "개설하기"}
          </Button>
          <Button
            onClick={onCancel}
            variant="outline"
            className="h-12 w-[112px] rounded-[12px] border border-[#ced9fd] bg-[#f4f6fe] px-0 text-[14px] font-semibold leading-5 tracking-[-0.14px] text-[#3863f6] shadow-[0_0_14px_rgba(138,138,138,0.08)] sm:h-14 sm:w-[140px] sm:text-[16px] sm:leading-[24px] sm:tracking-[-0.16px]"
          >
            나가기
          </Button>
        </div>
      </div>
    </div>
  );
}
