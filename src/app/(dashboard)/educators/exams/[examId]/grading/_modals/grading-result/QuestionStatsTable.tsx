import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { GradingReportQuestionStat } from "./types";

type QuestionStatsTableProps = {
  stats: GradingReportQuestionStat[];
};

function RateCell({ value }: { value: number }) {
  const text =
    value === 0 ? "0%" : value === 100 ? "100%" : `${Math.round(value)}%`;
  return <span className="tabular-nums">{text}</span>;
}

export function QuestionStatsTable({ stats }: QuestionStatsTableProps) {
  return (
    <Card className="bg-muted/30">
      <CardContent className="p-0">
        <div className="px-6 pt-5 pb-3">
          <p className="text-sm font-semibold">문항별 오답률</p>
        </div>

        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40 hover:bg-muted/40">
              <TableHead className="px-6 py-3">문제번호</TableHead>
              <TableHead className="py-3">정답률</TableHead>
              <TableHead className="py-3">오답률</TableHead>
              <TableHead className="py-3">1번</TableHead>
              <TableHead className="py-3">2번</TableHead>
              <TableHead className="py-3">3번</TableHead>
              <TableHead className="py-3">4번</TableHead>
              <TableHead className="py-3 pr-6">5번</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {stats.map((row) => (
              <TableRow key={row.questionNumber}>
                <TableCell className="px-6 py-4 font-semibold">
                  {row.questionNumber}
                </TableCell>
                <TableCell className="py-4 text-emerald-600">
                  <RateCell value={row.correctRate} />
                </TableCell>
                <TableCell className="py-4 text-red-600">
                  <RateCell value={row.wrongRate} />
                </TableCell>
                {row.optionRates.map((rate, idx) => (
                  <TableCell
                    key={`${row.questionNumber}-${idx}`}
                    className={idx === 4 ? "py-4 pr-6" : "py-4"}
                  >
                    <RateCell value={rate} />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
