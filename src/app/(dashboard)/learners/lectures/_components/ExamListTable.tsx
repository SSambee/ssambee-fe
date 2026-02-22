"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { LectureEnrollmentDetail } from "@/types/students.type";
import { formatYMDFromISO } from "@/utils/date";

type ExamListTableProps = {
  exams: LectureEnrollmentDetail["grades"];
  selectedExamIds: string[];
  onSelectExam: (examId: string) => void;
  onOpenDetail: (examItem: LectureEnrollmentDetail["grades"][number]) => void;
};

export default function ExamListTable({
  exams,
  selectedExamIds,
  onSelectExam,
  onOpenDetail,
}: ExamListTableProps) {
  const [visibleCount, setVisibleCount] = useState(5);

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 5);
  };

  return (
    <div className="space-y-4 text-sm">
      <Table>
        <TableHeader>
          <TableRow className="border-[#e9ebf0] hover:bg-white">
            <TableHead className="text-[14px] font-semibold text-[#8b90a3]">
              시험명
            </TableHead>
            <TableHead className="text-[14px] font-semibold text-[#8b90a3]">
              시험일
            </TableHead>
            <TableHead className="text-center text-[14px] font-semibold text-[#8b90a3]">
              과목
            </TableHead>
            <TableHead className="text-center text-[14px] font-semibold text-[#8b90a3]">
              점수
            </TableHead>
            <TableHead className="text-center text-[14px] font-semibold text-[#8b90a3]">
              학급 평균
            </TableHead>
            <TableHead className="text-center text-[14px] font-semibold text-[#8b90a3]">
              학급 석차
            </TableHead>
            <TableHead className="text-right text-[14px] font-semibold text-[#8b90a3]">
              상세
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {exams.slice(0, visibleCount).map((data) => {
            const { exam, grade } = data;
            const examKey = `${exam.title}-${exam.examDate}`;
            const isSelected = selectedExamIds.includes(examKey);

            return (
              <TableRow
                key={examKey}
                className={`cursor-pointer border-[#e9ebf0] hover:bg-[#f8f9fc] ${
                  isSelected ? "bg-[#e1e7fe]" : ""
                }`}
                onClick={() => onSelectExam(examKey)}
              >
                <TableCell className="font-medium text-[#16161b]/88">
                  {exam.title}
                </TableCell>
                <TableCell className="text-[#16161b]/88">
                  {formatYMDFromISO(exam.examDate)}
                </TableCell>
                <TableCell className="text-center text-[#16161b]/88">
                  {exam.subject}
                </TableCell>
                <TableCell className="text-center font-semibold text-[#4a4d5c]">
                  {grade.score}점
                </TableCell>
                <TableCell className="text-center text-[#16161b]/88">
                  {exam.average}점
                </TableCell>
                <TableCell className="text-center text-[#16161b]/88">
                  {grade.rank}등 / {exam.totalExaminees}명
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="outline"
                    className="h-8 rounded-[10px] border border-[#d6d9e0] bg-white px-3 text-xs font-semibold text-[#6b6f80] hover:bg-[#fcfcfd]"
                    onClick={(event) => {
                      event.stopPropagation();
                      onOpenDetail(data);
                    }}
                    aria-label={`${exam.title} 상세보기`}
                  >
                    상세보기
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      {visibleCount < exams.length && (
        <div className="flex justify-center">
          <Button
            variant="outline"
            onClick={handleLoadMore}
            className="h-12 rounded-[12px] border border-[#d6d9e0] bg-white px-6 text-[16px] font-semibold text-[#6b6f80] hover:bg-[#fcfcfd]"
          >
            더보기 ({exams.length - visibleCount})
          </Button>
        </div>
      )}
    </div>
  );
}
