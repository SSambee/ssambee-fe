import type { ExamReportAssignment } from "@/services/exams/exam-report-assignments.service";
import type {
  IncludedAssignment,
  MiniTestStudent,
  SelectionByStudent,
} from "@/types/exams/mini-tests";

export const hasCompleteMiniTestSelections = ({
  assignments,
  students,
  selections,
}: {
  assignments: IncludedAssignment[];
  students: MiniTestStudent[];
  selections: SelectionByStudent;
}) => {
  if (assignments.length === 0 || students.length === 0) return false;

  const studentsWithGrade = students.filter((student) => student.gradeId);
  if (studentsWithGrade.length === 0) return false;

  return studentsWithGrade.every((student) => {
    const row = selections[student.id] ?? {};

    return assignments.every((assignment) => {
      const value = row[assignment.id];
      return typeof value === "number";
    });
  });
};

export const mapIncludedAssignments = (
  rows: ExamReportAssignment[]
): IncludedAssignment[] => {
  return rows.map((row) => ({
    id: row.assignmentId,
    title:
      typeof row.assignment?.title === "string" ? row.assignment.title : "과제",
    categoryName:
      typeof row.assignment?.category?.name === "string"
        ? row.assignment.category.name
        : "카테고리",
    presets:
      Array.isArray(row.assignment?.category?.resultPresets) &&
      row.assignment.category.resultPresets.every(
        (preset) => typeof preset === "string"
      )
        ? row.assignment.category.resultPresets
        : [],
  }));
};
