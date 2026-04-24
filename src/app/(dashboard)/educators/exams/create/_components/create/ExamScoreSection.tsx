"use client";

import { Card, CardContent } from "@/components/ui/card";

type ExamScoreSectionProps = {
  totalQuestions: number;
  totalScore: number;
  errorMessage?: string;
  autoScore?: boolean;
  onAutoScoreChange?: (value: boolean) => void;
  disabled?: boolean;
};

export function ExamScoreSection({
  totalQuestions,
  totalScore,
  errorMessage,
  autoScore = true,
  onAutoScoreChange,
  disabled = false,
}: ExamScoreSectionProps) {
  return (
    <Card className="rounded-[24px] border border-[#eaecf2] bg-white shadow-none">
      <div className="border-b border-[#eaecf2] px-6 py-5">
        <div className="flex items-center justify-between">
          <h2 className="text-[20px] font-semibold tracking-[-0.2px] text-[#4a4d5c]">
            문항 및 배점 구성
          </h2>
          <label className="flex items-center gap-2 text-[13px] font-semibold text-[#6b6f80]">
            <input
              type="checkbox"
              checked={autoScore}
              onChange={(event) => onAutoScoreChange?.(event.target.checked)}
              disabled={disabled}
              className="h-4 w-4 accent-[#3863f6]"
            />
            자동 배점
          </label>
        </div>
      </div>
      <CardContent className="p-6">
        <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:gap-8">
          {/* 총 문항 수 */}
          <div className="flex-1">
            <div className="mb-2 text-[13px] font-semibold text-[#8b90a3]">
              총 문항 수
            </div>
            <div className="flex items-baseline gap-2">
              <div className="text-[36px] font-bold leading-[44px] text-[#4a4d5c]">
                {totalQuestions}
              </div>
              <div className="text-[18px] font-semibold text-[#8b90a3]">
                문항
              </div>
            </div>
            <div className="mt-2 text-[12px] font-medium text-[#8b90a3]">
              문항 수 입력 시 100점 기준으로 자동 배점됩니다.
            </div>
          </div>

          {/* 화살표 */}
          <div className="text-3xl text-[#b0b4c2]">→</div>

          {/* 총 배점 (만점) */}
          <div className="flex-1">
            <div className="mb-2 text-[13px] font-semibold text-[#8b90a3]">
              총 배점 (만점)
            </div>
            <div className="flex items-baseline gap-2">
              <div className="text-[36px] font-bold leading-[44px] text-[#4a4d5c]">
                {totalScore}
              </div>
              <div className="text-[18px] font-semibold text-[#8b90a3]">점</div>
            </div>
            <div className="mt-2 text-[12px] font-medium text-[#8b90a3]">
              만점 100점 기준입니다. 문항 배점을 입력해 합계를 맞춰주세요.
            </div>
          </div>
        </div>
        {errorMessage && (
          <p className="text-xs text-red-500 mt-4">{errorMessage}</p>
        )}
      </CardContent>
    </Card>
  );
}
