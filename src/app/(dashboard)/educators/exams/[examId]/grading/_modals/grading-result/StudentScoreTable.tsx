import { ChevronDown } from "lucide-react";

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

import { GradingReportStudentRow } from "./types";

type StudentScoreTableProps = {
  rows: GradingReportStudentRow[];
};

export function StudentScoreTable({ rows }: StudentScoreTableProps) {
  return (
    <Card className="bg-muted/30">
      <CardContent className="p-0">
        <div className="px-6 pt-5 pb-3">
          <p className="text-sm font-semibold">학생별 성적</p>
        </div>

        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40 hover:bg-muted/40">
              <TableHead className="px-6 py-3">이름</TableHead>
              <TableHead className="py-3">정답개수</TableHead>
              <TableHead className="py-3">점수(배점식)</TableHead>
              <TableHead className="py-3 text-right pr-6">석차</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id}>
                <TableCell className="px-6 py-4 font-medium">
                  {row.name}
                </TableCell>
                <TableCell className="py-4">{row.correctCount}</TableCell>
                <TableCell className="py-4">{row.score}</TableCell>
                <TableCell className="py-4 text-right pr-6">
                  {row.rank}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="flex justify-center py-4">
          <Button variant="outline" className="gap-2" disabled>
            더보기 ({rows.length}/{rows.length})
            <ChevronDown className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
