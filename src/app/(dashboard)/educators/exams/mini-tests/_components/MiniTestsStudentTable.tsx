"use client";

import { StudentProfileAvatar } from "@/components/common/avatar/StudentProfileAvatar";
import { STUDENT_TABLE_MAX_HEIGHT_PX } from "@/constants/exams.constants";
import { cn } from "@/lib/utils";
import type {
  IncludedAssignment,
  SelectionByStudent,
} from "@/types/exams/mini-tests";

type MiniTestsStudentTableProps = {
  students: Array<{ id: string; name: string }>;
  includedAssignments: IncludedAssignment[];
  currentSelections: SelectionByStudent;
  isEditMode: boolean;
  isCategoryApplyFeedback: boolean;
  onSelectionChange: (
    studentId: string,
    assignmentId: string,
    resultIndex: number | null
  ) => void;
};

export function MiniTestsStudentTable({
  students,
  includedAssignments,
  currentSelections,
  isEditMode,
  isCategoryApplyFeedback,
  onSelectionChange,
}: MiniTestsStudentTableProps) {
  return (
    <div
      className={cn(
        "rounded-lg border bg-card overflow-hidden transition-all",
        isCategoryApplyFeedback
          ? "ring-2 ring-primary/30 border-primary/40"
          : ""
      )}
    >
      <div
        className="overflow-auto"
        style={{ maxHeight: `${STUDENT_TABLE_MAX_HEIGHT_PX}px` }}
      >
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-muted/50 border-b">
              <th className="p-4 text-left font-semibold sticky left-0 bg-muted/50 z-10 w-[150px]">
                학생명
              </th>
              {includedAssignments.map((assignment) => (
                <th
                  key={assignment.id}
                  className="p-4 text-center font-semibold min-w-[120px]"
                >
                  {assignment.categoryName}
                  <div className="text-[10px] font-normal text-muted-foreground">
                    {assignment.title}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr
                key={student.id}
                className="border-b hover:bg-muted/30 transition-colors"
              >
                <td className="p-4 sticky left-0 bg-card z-10 border-r">
                  <div className="flex items-center gap-2">
                    <StudentProfileAvatar
                      size={28}
                      seedKey={student.id}
                      label={`${student.name || "학생"} 프로필 이미지`}
                    />
                    <span className="font-medium">{student.name}</span>
                  </div>
                </td>
                {includedAssignments.map((assignment) => {
                  const selectedIndex =
                    currentSelections[student.id]?.[assignment.id] ?? null;
                  return (
                    <td key={assignment.id} className="p-2">
                      <div className="flex flex-wrap justify-center gap-1">
                        {assignment.presets.map((preset, presetIndex) => (
                          <button
                            key={`${assignment.id}-${preset}`}
                            type="button"
                            onClick={() =>
                              onSelectionChange(
                                student.id,
                                assignment.id,
                                selectedIndex === presetIndex
                                  ? null
                                  : presetIndex
                              )
                            }
                            disabled={!isEditMode}
                            className={cn(
                              "h-8 min-w-[32px] px-2 rounded border text-xs font-medium transition-all",
                              selectedIndex === presetIndex
                                ? "bg-primary border-primary text-primary-foreground shadow-sm scale-105"
                                : "bg-background border-input hover:border-primary/50 hover:bg-muted",
                              !isEditMode
                                ? "opacity-60 cursor-not-allowed hover:border-input hover:bg-background"
                                : ""
                            )}
                          >
                            {preset}
                          </button>
                        ))}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
