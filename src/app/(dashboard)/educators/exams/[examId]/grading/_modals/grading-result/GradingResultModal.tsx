"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
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
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="text-left space-y-1">
          <DialogTitle className="text-2xl font-bold">{title}</DialogTitle>
          <p className="text-sm text-muted-foreground">
            {subtitle} · {overview.examDate}
          </p>
        </DialogHeader>

        <Separator />

        {isLoading ? (
          <div className="py-16 text-center text-sm text-muted-foreground">
            통계 데이터를 불러오는 중입니다.
          </div>
        ) : isError ? (
          <div className="py-16 text-center text-sm text-red-500">
            통계 데이터를 불러오지 못했습니다.
          </div>
        ) : (
          <div className="space-y-5">
            <GradingResultSummary overview={overview} />
            <StudentScoreTable rows={studentRows} />
            <QuestionStatsTable stats={questionStats} />
          </div>
        )}

        <Separator />

        <div className="flex justify-end pt-2">
          <Button onClick={() => onOpenChange(false)}>닫기</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
