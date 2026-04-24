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
    <div className="space-y-4">
      <div className="rounded-[24px] border border-neutral-100 bg-surface-normal-light overflow-hidden text-base">
        <Table>
          <TableHeader className="bg-neutral-50">
            <TableRow className="hover:bg-transparent border-b border-neutral-100">
              <TableHead className="h-14 px-6 text-base font-semibold text-neutral-500">
                시험명
              </TableHead>
              <TableHead className="h-14 px-6 text-base font-semibold text-neutral-500">
                시험일
              </TableHead>
              <TableHead className="h-14 px-6 text-center text-base font-semibold text-neutral-500">
                과목
              </TableHead>
              <TableHead className="h-14 px-6 text-center text-base font-semibold text-neutral-500">
                점수
              </TableHead>
              <TableHead className="h-14 px-6 text-center text-base font-semibold text-neutral-500">
                학급 평균
              </TableHead>
              <TableHead className="h-14 px-6 text-center text-base font-semibold text-neutral-500">
                학급 석차
              </TableHead>
              <TableHead className="h-14 px-6 text-right text-base font-semibold text-neutral-500">
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
                  className={`cursor-pointer transition-colors border-b border-neutral-50 last:border-0 ${
                    isSelected
                      ? "bg-brand-25 hover:bg-brand-50"
                      : "hover:bg-surface-elevated-light"
                  }`}
                  onClick={() => onSelectExam(examKey)}
                >
                  <TableCell className="px-6 py-5 text-base font-bold text-neutral-700">
                    {exam.title}
                  </TableCell>
                  <TableCell className="px-6 py-5 text-base text-neutral-500">
                    {formatYMDFromISO(exam.examDate)}
                  </TableCell>
                  <TableCell className="px-6 py-5 text-center">
                    <span className="inline-flex items-center rounded-full bg-brand-50 px-3 py-1 text-sm font-semibold text-brand-700 border border-brand-100">
                      {exam.subject}
                    </span>
                  </TableCell>
                  <TableCell className="px-6 py-5 text-center text-base font-bold text-brand-700">
                    {Number(grade.score).toFixed(1)}점
                  </TableCell>
                  <TableCell className="px-6 py-5 text-center text-base text-neutral-500">
                    {Number(exam.average).toFixed(1)}점
                  </TableCell>
                  <TableCell className="px-6 py-5 text-center text-base text-neutral-500">
                    <span className="font-semibold text-neutral-700">
                      {grade.rank}등
                    </span>{" "}
                    / {exam.totalExaminees}명
                  </TableCell>
                  <TableCell className="px-6 py-5 text-right">
                    <Button
                      variant="outline"
                      className="h-8 rounded-[10px] border border-neutral-200 bg-white px-3 text-xs font-semibold text-neutral-500 hover:bg-surface-elevated-light"
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
      </div>

      {visibleCount < exams.length && (
        <div className="flex justify-center pt-4">
          <Button
            variant="outline"
            onClick={handleLoadMore}
            className="h-12 rounded-[12px] border border-neutral-200 bg-surface-normal-light px-8 text-base font-semibold text-neutral-500 hover:bg-surface-elevated-light shadow-none transition-colors"
          >
            더보기 ({exams.length - visibleCount})
          </Button>
        </div>
      )}
    </div>
  );
}
