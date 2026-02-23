import type { GradingReportQuestionStat } from "@/types/exams";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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
    <Card className="rounded-[20px] border border-[#eaecf2] bg-white shadow-none">
      <CardContent className="p-0">
        <div className="px-5 pb-3 pt-5 sm:px-6">
          <p className="text-[16px] font-semibold tracking-[-0.16px] text-[#4a4d5c]">
            문항별 오답률
          </p>
        </div>

        <div className="overflow-x-auto border-y border-[#eaecf2]">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-[#eaecf2] bg-[#fcfcfd] hover:bg-[#fcfcfd]">
                <TableHead className="px-6 py-3 text-[13px] font-semibold text-[#8b90a3]">
                  문제번호
                </TableHead>
                <TableHead className="py-3 text-[13px] font-semibold text-[#8b90a3]">
                  정답률
                </TableHead>
                <TableHead className="py-3 text-[13px] font-semibold text-[#8b90a3]">
                  오답률
                </TableHead>
                <TableHead className="py-3 text-[13px] font-semibold text-[#8b90a3]">
                  1번
                </TableHead>
                <TableHead className="py-3 text-[13px] font-semibold text-[#8b90a3]">
                  2번
                </TableHead>
                <TableHead className="py-3 text-[13px] font-semibold text-[#8b90a3]">
                  3번
                </TableHead>
                <TableHead className="py-3 text-[13px] font-semibold text-[#8b90a3]">
                  4번
                </TableHead>
                <TableHead className="py-3 pr-6 text-[13px] font-semibold text-[#8b90a3]">
                  5번
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {stats.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="px-6 py-10 text-center text-[14px] font-medium text-[#8b90a3]"
                  >
                    표시할 문항 통계가 없습니다.
                  </TableCell>
                </TableRow>
              ) : (
                stats.map((row, index) => (
                  <TableRow
                    key={row.questionNumber}
                    className={index % 2 === 1 ? "bg-[#fcfcfd]" : ""}
                  >
                    <TableCell className="px-6 py-4 text-[14px] font-semibold text-[#4a4d5c]">
                      {row.questionNumber}
                    </TableCell>
                    <TableCell className="py-4 text-[14px] font-semibold text-[#1f8b4d]">
                      <RateCell value={row.correctRate} />
                    </TableCell>
                    <TableCell className="py-4 text-[14px] font-semibold text-[#d84949]">
                      <RateCell value={row.wrongRate} />
                    </TableCell>
                    {row.optionRates.map((rate, idx) => (
                      <TableCell
                        key={`${row.questionNumber}-${idx}`}
                        className={
                          idx === 4
                            ? "py-4 pr-6 text-[14px] font-medium text-[#4a4d5c]"
                            : "py-4 text-[14px] font-medium text-[#4a4d5c]"
                        }
                      >
                        <RateCell value={rate} />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
