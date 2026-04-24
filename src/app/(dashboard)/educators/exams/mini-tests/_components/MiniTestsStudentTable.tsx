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
        "overflow-hidden rounded-[24px] border border-[#eaecf2] bg-white transition-all",
        isCategoryApplyFeedback
          ? "border-[#4b72f7]/40 ring-2 ring-[#4b72f7]/30"
          : ""
      )}
    >
      <div
        className="overflow-auto"
        style={{ maxHeight: `${STUDENT_TABLE_MAX_HEIGHT_PX}px` }}
      >
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-[#eaecf2] bg-[#fcfcfd]">
              <th className="sticky left-0 z-10 w-[170px] bg-[#fcfcfd] p-4 text-left text-[14px] font-semibold text-[#8b90a3]">
                학생명
              </th>
              {includedAssignments.map((assignment) => (
                <th
                  key={assignment.id}
                  className="min-w-[128px] p-4 text-center text-[14px] font-semibold text-[#8b90a3]"
                >
                  {assignment.categoryName}
                  <div className="text-[11px] font-medium text-[rgba(22,22,27,0.28)]">
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
                className="border-b border-[#eaecf2] transition-colors hover:bg-[#fcfcfd]"
              >
                <td className="sticky left-0 z-10 border-r border-[#eaecf2] bg-white p-4">
                  <div className="flex items-center gap-2">
                    <StudentProfileAvatar
                      size={28}
                      seedKey={student.id}
                      label={`${student.name || "학생"} 프로필 이미지`}
                    />
                    <span className="text-[14px] font-semibold text-[#4a4d5c]">
                      {student.name}
                    </span>
                  </div>
                </td>
                {includedAssignments.map((assignment) => {
                  const selectedIndex =
                    currentSelections[student.id]?.[assignment.id] ?? null;
                  return (
                    <td key={assignment.id} className="p-2.5">
                      <div className="flex flex-wrap justify-center gap-1">
                        {assignment.presets.map((preset, presetIndex) => (
                          <button
                            key={`${assignment.id}-${presetIndex}-${preset}`}
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
                              "h-8 min-w-[40px] rounded-[8px] border px-2 text-xs font-semibold transition-all",
                              selectedIndex === presetIndex
                                ? "scale-105 border-[#3863f6] bg-[#3863f6] text-white shadow-[0_0_10px_rgba(56,99,246,0.2)]"
                                : "border-[#d6d9e0] bg-white text-[#6b6f80] hover:border-[#4b72f7]/50 hover:bg-[#fcfcfd]",
                              !isEditMode
                                ? "cursor-not-allowed opacity-60 hover:border-[#d6d9e0] hover:bg-white"
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
