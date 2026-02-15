import Link from "next/link";
import { FlaskConical, Languages, Sigma } from "lucide-react";

import { type LearnersRecentExamResult } from "@/types/learners-dashboard";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type LearnersRecentExamResultsCardProps = {
  results: LearnersRecentExamResult[];
};

const subjectIconMap = {
  수학: Sigma,
  영어: Languages,
  과학: FlaskConical,
} as const;

const subjectIconColorMap = {
  수학: "bg-rose-100 text-rose-700",
  영어: "bg-blue-100 text-blue-700",
  과학: "bg-emerald-100 text-emerald-700",
} as const;

const statusClassMap = {
  통과: "bg-emerald-100 text-emerald-700",
  평균: "bg-amber-100 text-amber-700",
} as const;

export default function LearnersRecentExamResultsCard({
  results,
}: LearnersRecentExamResultsCardProps) {
  return (
    <Card className="shadow-sm">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <p className="text-2xl font-semibold tracking-tight">
            최근 시험 결과
          </p>
          <Link
            href="/learners/exams"
            className="text-xs font-semibold text-muted-foreground underline-offset-2 hover:underline"
          >
            전체 보기
          </Link>
        </div>

        <div className="mt-6 rounded-xl border">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-muted-foreground">과목</TableHead>
                <TableHead className="text-muted-foreground">시험명</TableHead>
                <TableHead className="text-muted-foreground">날짜</TableHead>
                <TableHead className="text-muted-foreground">점수</TableHead>
                <TableHead className="text-muted-foreground">상태</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {results.map((result) => {
                const SubjectIcon = subjectIconMap[result.subject];
                return (
                  <TableRow key={result.id} className="hover:bg-muted/30">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <span
                          className={`flex h-8 w-8 items-center justify-center rounded-md ${subjectIconColorMap[result.subject]}`}
                        >
                          <SubjectIcon className="h-4 w-4" />
                        </span>
                        <span className="text-base font-semibold text-foreground">
                          {result.subject}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm font-semibold text-foreground">
                      {result.examName}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {result.examDate}
                    </TableCell>
                    <TableCell className="text-sm font-semibold text-foreground">
                      {result.scoreLabel}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusClassMap[result.status]}`}
                      >
                        {result.status}
                      </span>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
