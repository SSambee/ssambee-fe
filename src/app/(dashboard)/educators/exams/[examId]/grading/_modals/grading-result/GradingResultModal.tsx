"use client";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type {
  GradingReportOverview,
  GradingReportQuestionStat,
  GradingReportStudentRow,
} from "@/types/exams";

import { GradingResultSummary } from "./GradingResultSummary";
import { StudentScoreTable } from "./StudentScoreTable";
import { QuestionStatsTable } from "./QuestionStatsTable";

type GradingResultModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  subtitle: string;
  overview: GradingReportOverview;
  studentRows: GradingReportStudentRow[];
  questionStats: GradingReportQuestionStat[];
  isLoading?: boolean;
  isError?: boolean;
};

export function GradingResultModal({
  open,
  onOpenChange,
  title,
  subtitle,
  overview,
  studentRows,
  questionStats,
  isLoading,
  isError,
}: GradingResultModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[88vh] max-w-5xl overflow-y-auto rounded-[24px] border border-[#eaecf2] p-6 sm:p-7">
        <DialogHeader className="space-y-1 border-b border-[#eaecf2] pb-4 text-left">
          <DialogTitle className="text-[24px] font-bold tracking-[-0.24px] text-[#040405]">
            {title}
          </DialogTitle>
          <p className="text-[13px] font-medium text-[#8b90a3]">
            {subtitle} · {overview.examDate}
          </p>
        </DialogHeader>

        {isLoading ? (
          <div className="rounded-[16px] border border-[#eaecf2] bg-[#fcfcfd] py-14 text-center text-[14px] font-medium text-[#8b90a3]">
            통계 데이터를 불러오는 중입니다.
          </div>
        ) : isError ? (
          <div className="rounded-[16px] border border-[#ffdcdc] bg-[#fff7f7] py-14 text-center text-[14px] font-semibold text-[#d84949]">
            통계 데이터를 불러오지 못했습니다.
          </div>
        ) : (
          <div className="space-y-5">
            <GradingResultSummary overview={overview} />
            <StudentScoreTable rows={studentRows} />
            <QuestionStatsTable stats={questionStats} />
          </div>
        )}

        <DialogFooter className="border-t border-[#eaecf2] pt-4">
          <Button
            variant="outline"
            className="h-10 rounded-[10px] border-[#d6d9e0] px-4 text-[14px] font-semibold text-[#6b6f80] hover:bg-[#fcfcfd] hover:text-[#5e6275]"
            onClick={() => onOpenChange(false)}
          >
            닫기
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
