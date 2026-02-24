"use client";

import { useState } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { LectureEnrollmentDetail } from "@/types/students.type";
import { formatYMDFromISO } from "@/utils/date";

type ExamListTableProps = {
  exams: LectureEnrollmentDetail["grades"];
  selectedExamIds: string[];
  onSelectExam: (examId: string) => void;
};

export default function ExamListTable({
  exams,
  selectedExamIds,
  onSelectExam,
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
            </TableRow>
          </TableHeader>
          <TableBody>
            {exams.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="h-32 text-center text-neutral-400 text-base"
                >
                  등록된 시험 정보가 없습니다.
                </TableCell>
              </TableRow>
            ) : (
              exams.slice(0, visibleCount).map((data) => {
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
                      {grade.score}점
                    </TableCell>
                    <TableCell className="px-6 py-5 text-center text-base text-neutral-500">
                      {exam.average}점
                    </TableCell>
                    <TableCell className="px-6 py-5 text-center text-base text-neutral-500">
                      <span className="font-semibold text-neutral-700">
                        {grade.rank}등
                      </span>{" "}
                      / {exam.totalExaminees}명
                    </TableCell>
                  </TableRow>
                );
              })
            )}
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
