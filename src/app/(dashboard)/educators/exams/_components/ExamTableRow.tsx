"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Exam } from "@/types/exams";

type ExamTableRowProps = {
  exam: Exam;
  isSelected: boolean;
  onSelect: (checked: boolean) => void;
  disableSelection?: boolean;
  disableGrading?: boolean;
};

export function ExamTableRow({
  exam,
  isSelected,
  onSelect,
  disableSelection = false,
  disableGrading = false,
}: ExamTableRowProps) {
  const router = useRouter();
  const isDone = exam.status === "채점 완료";

  return (
    <tr className="border-b border-[#eaecf2] transition-colors hover:bg-[#fcfcfd]">
      <td className="px-4 py-4">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={(e) => onSelect(e.target.checked)}
          className="h-4 w-4 cursor-pointer accent-[#3863f6]"
          disabled={disableSelection}
          aria-label={`${exam.name} 선택`}
        />
      </td>
      <td className="px-4 py-4">
        <div>
          <p className="text-[15px] font-semibold text-[#4a4d5c]">
            {exam.name}
          </p>
          <p className="text-[13px] font-medium text-[#8b90a3]">
            {exam.subtitle}
          </p>
        </div>
      </td>
      <td className="px-4 py-4">
        <p className="text-[14px] font-medium text-[#4a4d5c]">
          {exam.lectureName}
        </p>
      </td>
      <td className="px-4 py-4">
        <p className="text-[14px] font-medium text-[#8b90a3]">
          {exam.registrationDate}
        </p>
      </td>
      <td className="px-4 py-4">
        <span
          className={`inline-flex h-8 items-center justify-center rounded-[8px] px-3 text-[12px] font-semibold ${
            isDone
              ? "bg-[#dcfce7] text-[#16a34a]"
              : "bg-[#fef3c7] text-[#d97706]"
          }`}
        >
          {exam.status}
        </span>
      </td>
      <td className="px-4 py-4">
        <Button
          variant="outline"
          className="h-9 rounded-[10px] border-[#d6d9e0] px-3 text-[12px] font-semibold text-[#6b6f80] hover:bg-[#fcfcfd] hover:text-[#5e6275]"
          onClick={() => router.push(`/educators/exams/${exam.id}/grading`)}
          disabled={disableGrading}
        >
          채점하기
        </Button>
      </td>
    </tr>
  );
}
