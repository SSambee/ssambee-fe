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
  const statusColor =
    exam.status === "채점 완료" ? "text-green-600" : "text-orange-600";
  const statusDotColor =
    exam.status === "채점 완료" ? "bg-green-500" : "bg-orange-500";

  return (
    <tr className="border-b hover:bg-muted/50 transition-colors">
      <td className="px-4 py-4">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={(e) => onSelect(e.target.checked)}
          className="cursor-pointer"
          disabled={disableSelection}
          aria-label={`${exam.name} 선택`}
        />
      </td>
      <td className="px-4 py-4">
        <div>
          <p className="font-medium">{exam.name}</p>
          <p className="text-sm text-muted-foreground">{exam.subtitle}</p>
        </div>
      </td>
      <td className="px-4 py-4">
        <p className="text-sm">{exam.lectureName}</p>
      </td>
      <td className="px-4 py-4">
        <p className="text-sm text-muted-foreground">{exam.registrationDate}</p>
      </td>
      <td className="px-4 py-4">
        <div className="flex items-center gap-2">
          <span className={`h-2 w-2 rounded-full ${statusDotColor}`}></span>
          <span className={`text-sm ${statusColor}`}>{exam.status}</span>
        </div>
      </td>
      <td className="px-4 py-4">
        <Button
          variant="outline"
          className="h-8 rounded-md px-3 text-xs"
          onClick={() => router.push(`/educators/exams/${exam.id}/grading`)}
          disabled={disableGrading}
        >
          채점하기
        </Button>
      </td>
    </tr>
  );
}
