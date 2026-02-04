"use client";

import { LectureStudent } from "@/types/lectures";
import { formatPhoneNumber } from "@/utils/phone";

type LectureDetailStudentsProps = {
  students?: LectureStudent[];
};

export function LectureDetailStudents({
  students,
}: LectureDetailStudentsProps) {
  if (!students || students.length === 0) {
    return (
      <div>
        <p className="text-sm text-muted-foreground mb-2">등록 학생 (0명)</p>
        <div className="rounded-lg border px-3 py-4 text-sm text-muted-foreground">
          등록된 학생이 없습니다.
        </div>
      </div>
    );
  }

  return (
    <div>
      <p className="text-sm text-muted-foreground mb-2">
        등록 학생 ({students.length}명)
      </p>
      <div className="border rounded-lg overflow-hidden">
        <div className="grid grid-cols-4 gap-4 bg-muted px-3 py-2 text-sm font-medium border-b">
          <div>이름</div>
          <div>학교 · 학년</div>
          <div>학생 연락처</div>
          <div>학부모 연락처</div>
        </div>
        <div className="max-h-[240px] overflow-y-auto">
          {students.map((student, index) => (
            <div
              key={student.id}
              className={`grid grid-cols-4 gap-4 px-3 py-3 text-sm ${
                index !== students.length - 1 ? "border-b" : ""
              } hover:bg-muted/50 transition-colors`}
            >
              <div className="font-medium">{student.name || "-"}</div>
              <div className="text-muted-foreground">
                {student.school && student.schoolYear
                  ? `${student.school} · ${student.schoolYear}`
                  : student.school || student.schoolYear || "-"}
              </div>
              <div className="text-muted-foreground">
                {formatPhoneNumber(student.phone) || student.phone || "-"}
              </div>
              <div className="text-muted-foreground">
                {formatPhoneNumber(student.parentPhone) ||
                  student.parentPhone ||
                  "-"}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
