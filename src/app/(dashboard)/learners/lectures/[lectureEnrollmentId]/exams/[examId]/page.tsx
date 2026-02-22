"use client";

import {
  ArrowLeft,
  BarChart3,
  Calendar,
  ClipboardList,
  Trophy,
  User,
  Users,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

import EmptyState from "@/components/common/EmptyState";
import Title from "@/components/common/header/Title";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useSetBreadcrumb } from "@/hooks/useBreadcrumb";
import { cn } from "@/lib/utils";
import { formatYMDFromISO } from "@/utils/date";

import { useLearnerExamDetail } from "../../../_hooks/useLearnerExamDetail";

export default function LearnersExamDetailPage() {
  const params = useParams();
  const lectureEnrollmentId = params.lectureEnrollmentId as string;
  const examId = params.examId as string;

  const { isPending, errorMessage, lectureTitle, examTitle, detail } =
    useLearnerExamDetail({
      lectureEnrollmentId,
      examId,
    });

  useSetBreadcrumb([
    { label: "나의강의", href: "/learners/lectures" },
    {
      label: lectureTitle,
      href: `/learners/lectures/${lectureEnrollmentId}`,
    },
    { label: examTitle },
  ]);

  if (isPending) {
    return <div className="p-8 text-center">로딩 중...</div>;
  }

  if (errorMessage || !detail) {
    return (
      <EmptyState
        message={errorMessage || "시험 상세 정보를 불러올 수 없습니다."}
        showBackButton={true}
      />
    );
  }

  const averageCorrectRate =
    detail.wrongQuestions.length > 0
      ? Number(
          (
            detail.wrongQuestions.reduce(
              (sum, item) => sum + item.correctRate,
              0
            ) / detail.wrongQuestions.length
          ).toFixed(1)
        )
      : null;

  return (
    <div className="container mx-auto max-w-[1400px] space-y-8 px-6 py-10">
      <div className="flex items-center justify-between">
        <Button
          asChild
          variant="outline"
          className="-ml-2 h-9 gap-2 border-none bg-transparent text-muted-foreground shadow-none hover:bg-accent hover:text-foreground"
        >
          <Link href={`/learners/lectures/${lectureEnrollmentId}`}>
            <ArrowLeft className="h-4 w-4" />
            목록으로 돌아가기
          </Link>
        </Button>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm font-medium">
          <span className="rounded-full bg-secondary px-3 py-0.5 text-xs font-semibold text-secondary-foreground">
            {detail.examType}
          </span>
          <span className="text-muted-foreground">·</span>
          <span className="text-muted-foreground">{detail.subjectLabel}</span>
        </div>
        <Title
          title={detail.examTitle}
          description={`${detail.lectureTitle} · ${formatYMDFromISO(detail.examDateLabel)}`}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          label="내 점수"
          value={detail.score}
          unit="점"
          icon={Trophy}
          trend="score"
        />
        <MetricCard
          label="학급 평균"
          value={detail.classAverage}
          unit="점"
          icon={Users}
        />
        <MetricCard
          label="석차"
          value={detail.rank}
          total={detail.totalExaminees}
          unit="위"
          icon={BarChart3}
        />
        <MetricCard
          label="출석률"
          value={detail.attendanceRate ?? "-"}
          unit={detail.attendanceRate === null ? undefined : "%"}
          icon={Calendar}
        />
      </div>

      <div className="grid grid-cols-1 gap-8 xl:grid-cols-[380px_1fr]">
        <div className="space-y-6">
          <Card className="h-[320px] overflow-hidden border-none shadow-sm ring-1 ring-border">
            <div className="border-b bg-muted/30 px-4 py-4">
              <h3 className="flex items-center gap-2 text-base font-semibold">
                <User className="h-4 w-4 text-primary" />
                시험 정보
              </h3>
            </div>
            <CardContent className="flex h-[260px] flex-col justify-between p-4">
              <InfoRow label="학생 성명" value={detail.studentName} />
              <InfoRow label="시험 종류" value={detail.examType} />
              <InfoRow label="응시 과목" value={detail.subjectLabel} />
              <InfoRow
                label="문항 평균 정답률"
                value={
                  averageCorrectRate === null
                    ? "-"
                    : `${averageCorrectRate.toFixed(1)}%`
                }
                highlight
              />
            </CardContent>
          </Card>

          <Card className="h-[320px] overflow-hidden border-none shadow-sm ring-1 ring-border">
            <div className="border-b bg-muted/30 px-4 py-4">
              <h3 className="flex items-center gap-2 text-base font-semibold">
                <ClipboardList className="h-4 w-4 text-primary" />
                미니테스트
              </h3>
            </div>
            <CardContent className="p-0">
              <div className="max-h-[260px] overflow-y-auto">
                <Table>
                  <TableHeader className="sticky top-0 z-10 bg-muted/50">
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="h-10 text-xs font-bold">
                        카테고리
                      </TableHead>
                      <TableHead className="h-10 text-xs font-bold">
                        항목
                      </TableHead>
                      <TableHead className="h-10 text-right text-xs font-bold">
                        결과
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {detail.miniTests.length > 0 ? (
                      detail.miniTests.map((item) => (
                        <TableRow key={item.id} className="group">
                          <TableCell className="py-3 text-xs text-muted-foreground">
                            {item.categoryName}
                          </TableCell>
                          <TableCell className="py-3 text-sm font-medium">
                            {item.title}
                          </TableCell>
                          <TableCell className="py-3 text-right">
                            <span className="inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-semibold">
                              {item.resultLabel}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={3}
                          className="h-24 text-center text-muted-foreground"
                        >
                          표시할 미니테스트 결과가 없습니다.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="overflow-hidden border-none shadow-sm ring-1 ring-border">
          <div className="border-b bg-muted/30 px-4 py-4">
            <div className="flex items-center justify-between">
              <h3 className="flex items-center gap-2 text-base font-semibold">
                <BarChart3 className="h-4 w-4 text-primary" />
                문항별 상세 분석
              </h3>
            </div>
          </div>
          <CardContent className="p-0">
            <div className="max-h-[700px] overflow-auto">
              <Table className="table-fixed min-w-[920px]">
                <colgroup>
                  <col className="w-[60px]" />
                  <col className="w-[80px]" />
                  <col className="w-[90px]" />
                  <col className="w-[100px]" />
                  <col className="w-[120px]" />
                  <col className="w-[270px]" />
                  <col className="w-[100px]" />
                  <col className="w-[100px]" />
                </colgroup>
                <TableHeader className="sticky top-0 z-10 bg-muted/80 backdrop-blur-sm">
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="whitespace-nowrap text-center text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      No.
                    </TableHead>
                    <TableHead className="whitespace-nowrap text-right text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      배점
                    </TableHead>
                    <TableHead className="whitespace-nowrap text-center text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      결과
                    </TableHead>
                    <TableHead className="whitespace-nowrap text-center text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      유형
                    </TableHead>
                    <TableHead className="whitespace-nowrap text-center text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      카테고리
                    </TableHead>
                    <TableHead className="whitespace-nowrap text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      출처
                    </TableHead>
                    <TableHead className="whitespace-nowrap text-right text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      오답률
                    </TableHead>
                    <TableHead className="whitespace-nowrap text-right text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      정답률
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {detail.wrongQuestions.length > 0 ? (
                    detail.wrongQuestions.map((question) => (
                      <TableRow
                        key={`question-${question.no}`}
                        className="border-b border-border/40 transition-colors hover:bg-muted/30"
                      >
                        <TableCell className="py-4 text-center font-mono text-sm font-medium tabular-nums text-muted-foreground/70">
                          {String(question.no).padStart(2, "0")}
                        </TableCell>
                        <TableCell className="py-4 text-right">
                          <span className="font-mono text-sm font-semibold tabular-nums text-foreground">
                            {question.questionScore}
                            <span className="ml-0.5 text-[10px] font-normal text-muted-foreground">
                              점
                            </span>
                          </span>
                        </TableCell>
                        <TableCell className="py-4 text-center">
                          <span
                            className={cn(
                              "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-bold ring-1 ring-inset",
                              question.resultLabel === "정답"
                                ? "bg-emerald-50 text-emerald-700 ring-emerald-600/20"
                                : question.resultLabel === "오답"
                                  ? "bg-rose-50 text-rose-700 ring-rose-600/20"
                                  : "bg-muted text-muted-foreground ring-border"
                            )}
                          >
                            {question.resultLabel}
                          </span>
                        </TableCell>
                        <TableCell className="py-4 text-center">
                          <span className="inline-flex items-center rounded-md bg-slate-50 px-2 py-0.5 text-[11px] font-medium text-slate-600 ring-1 ring-inset ring-slate-500/10">
                            {question.typeLabel}
                          </span>
                        </TableCell>
                        <TableCell className="py-4 text-center">
                          <span className="inline-flex items-center rounded-md bg-indigo-50 px-2 py-0.5 text-[11px] font-medium text-indigo-600 ring-1 ring-inset ring-indigo-500/10">
                            {question.categoryLabel}
                          </span>
                        </TableCell>
                        <TableCell className="py-4 text-sm text-muted-foreground">
                          <span
                            className="block truncate font-medium text-foreground/80"
                            title={question.sourceLabel}
                          >
                            {question.sourceLabel}
                          </span>
                        </TableCell>
                        <TableCell className="py-4 text-right">
                          <span
                            className={cn(
                              "font-mono text-sm font-bold tabular-nums",
                              question.wrongRate > 50
                                ? "text-rose-600"
                                : "text-foreground/70"
                            )}
                          >
                            {question.wrongRate}
                            <span className="ml-0.5 text-[10px] font-normal opacity-70">
                              %
                            </span>
                          </span>
                        </TableCell>
                        <TableCell className="py-4 text-right">
                          <span className="font-mono text-sm font-bold tabular-nums text-emerald-600">
                            {question.correctRate.toFixed(1)}
                            <span className="ml-0.5 text-[10px] font-normal opacity-70">
                              %
                            </span>
                          </span>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={8}
                        className="h-32 text-center text-muted-foreground"
                      >
                        <div className="flex flex-col items-center justify-center gap-2">
                          <ClipboardList className="h-8 w-8 opacity-20" />
                          <p>표시할 문항별 응시 결과가 없습니다.</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

interface MetricCardProps {
  label: string;
  value: string | number;
  unit?: string;
  total?: number;
  icon: LucideIcon;
  trend?: "score" | "none";
}

const MetricCard = ({
  label,
  value,
  unit,
  total,
  icon: Icon,
  trend,
}: MetricCardProps) => {
  return (
    <Card className="overflow-hidden border-none shadow-sm ring-1 ring-border">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{label}</p>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold tracking-tight">{value}</span>
              {total && (
                <span className="text-sm font-medium text-muted-foreground">
                  / {total}
                </span>
              )}
              {unit && (
                <span className="text-sm font-medium text-muted-foreground">
                  {unit}
                </span>
              )}
            </div>
          </div>
          <div className="rounded-xl bg-primary/10 p-2.5 text-primary">
            <Icon className="h-5 w-5" />
          </div>
        </div>
        {trend === "score" && (
          <div className="mt-4 flex items-center gap-2">
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full bg-primary transition-all duration-500"
                style={{
                  width: `${Math.max(0, Math.min(Number(value), 100))}%`,
                }}
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const InfoRow = ({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) => {
  return (
    <div className="flex items-center justify-between py-2.5">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span
        className={cn(
          "text-sm font-semibold",
          highlight ? "text-primary" : "text-foreground"
        )}
      >
        {value}
      </span>
    </div>
  );
};
