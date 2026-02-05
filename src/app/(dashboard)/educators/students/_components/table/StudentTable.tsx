import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { STUDENTS_TABLE_COLUMNS } from "@/constants/students.default";
import { GetEnrollmentList } from "@/types/students.type";

import { StudentTableColumn } from "./StudentTableColumns";

type StudentTableProps = {
  isPending: boolean;
  studentList: GetEnrollmentList[];
  isCurrentPageAllSelected: boolean;
  handleSelectAll: (checked: boolean) => void;
  columns: StudentTableColumn[];
};

export function StudentTable({
  isPending,
  studentList,
  isCurrentPageAllSelected,
  handleSelectAll,
  columns,
}: StudentTableProps) {
  return (
    <div className="border rounded-lg overflow-x-auto min-h-[550px]">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="whitespace-nowrap w-[50px]">
              <Checkbox
                checked={isCurrentPageAllSelected}
                onCheckedChange={handleSelectAll}
              />
            </TableHead>
            {STUDENTS_TABLE_COLUMNS.map((col) => (
              <TableHead key={col.key} className="whitespace-nowrap">
                {col.label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {isPending ? (
            <TableRow>
              <TableCell
                colSpan={STUDENTS_TABLE_COLUMNS.length + 1}
                className="text-center"
              >
                로딩 중...
              </TableCell>
            </TableRow>
          ) : studentList.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={STUDENTS_TABLE_COLUMNS.length + 1}
                className="h-[550px] text-center align-middle"
              >
                <div className="flex flex-col items-center justify-center gap-2">
                  <span className="text-gray-400 text-lg font-medium">
                    검색 결과가 없습니다.
                  </span>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            studentList.map((studentData) => (
              <TableRow key={studentData.id}>
                {columns.map((col) => (
                  <TableCell
                    key={col.key}
                    className="whitespace-nowrap text-sm"
                  >
                    {col.render(studentData)}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
