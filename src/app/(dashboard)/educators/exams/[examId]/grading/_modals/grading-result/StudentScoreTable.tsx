import { ChevronDown } from "lucide-react";

import type { GradingReportStudentRow } from "@/types/exams";
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

type StudentScoreTableProps = {
  rows: GradingReportStudentRow[];
};

export function StudentScoreTable({ rows }: StudentScoreTableProps) {
  return (
    <Card className="rounded-[20px] border border-[#eaecf2] bg-white shadow-none">
      <CardContent className="p-0">
        <div className="px-5 pb-3 pt-5 sm:px-6">
          <p className="text-[16px] font-semibold tracking-[-0.16px] text-[#4a4d5c]">
            학생별 성적
          </p>
        </div>

        <div className="overflow-x-auto border-y border-[#eaecf2]">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-[#eaecf2] bg-[#fcfcfd] hover:bg-[#fcfcfd]">
                <TableHead className="px-6 py-3 text-[13px] font-semibold text-[#8b90a3]">
                  이름
                </TableHead>
                <TableHead className="py-3 text-[13px] font-semibold text-[#8b90a3]">
                  정답개수
                </TableHead>
                <TableHead className="py-3 text-[13px] font-semibold text-[#8b90a3]">
                  점수(배점식)
                </TableHead>
                <TableHead className="py-3 pr-6 text-right text-[13px] font-semibold text-[#8b90a3]">
                  석차
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="px-6 py-10 text-center text-[14px] font-medium text-[#8b90a3]"
                  >
                    표시할 학생 성적이 없습니다.
                  </TableCell>
                </TableRow>
              ) : (
                rows.map((row, index) => (
                  <TableRow
                    key={row.id}
                    className={index % 2 === 1 ? "bg-[#fcfcfd]" : ""}
                  >
                    <TableCell className="px-6 py-4 text-[14px] font-semibold text-[#4a4d5c]">
                      {row.name}
                    </TableCell>
                    <TableCell className="py-4 text-[14px] font-medium text-[#4a4d5c]">
                      {row.correctCount}
                    </TableCell>
                    <TableCell className="py-4 text-[14px] font-semibold text-[#3863f6]">
                      {row.score}
                    </TableCell>
                    <TableCell className="py-4 pr-6 text-right text-[14px] font-medium text-[#4a4d5c]">
                      {row.rank}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex justify-center py-4">
          <Button
            variant="outline"
            className="h-10 gap-2 rounded-[12px] border-[#d6d9e0] bg-white px-4 text-[13px] font-semibold text-[#6b6f80] hover:bg-[#fcfcfd] hover:text-[#5e6275]"
            disabled
          >
            더보기 ({rows.length}/{rows.length})
            <ChevronDown className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
