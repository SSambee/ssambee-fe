"use client";

import { StudentProfileAvatar } from "@/components/common/avatar/StudentProfileAvatar";
import { LectureStudent } from "@/types/lectures";
import { formatPhoneNumber } from "@/utils/phone";

type LectureDetailStudentsEditableProps = {
  students?: LectureStudent[];
};

export function LectureDetailStudentsEditable({
  students,
}: LectureDetailStudentsEditableProps) {
  const total = students?.length ?? 0;

  if (!students || students.length === 0) {
    return (
      <div className="rounded-[16px] border border-[#f4f6fa] bg-[#f7f8fa] px-6 py-8 text-sm text-[#8b90a3]">
        등록된 학생이 없습니다.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center rounded-[12px] pl-6 pr-1 py-1">
        <span className="text-[14px] font-semibold leading-5 tracking-[-0.14px] text-[#6b6f80]">
          전체 {total}명
        </span>
      </div>

      <div className="max-h-[320px] space-y-3 overflow-y-auto pr-2 [scrollbar-width:thin] [scrollbar-color:#dadde3_transparent]">
        {students.map((student) => {
          const schoolGrade =
            student.school && student.schoolYear
              ? `${student.school} · ${student.schoolYear}`
              : student.school || student.schoolYear || "-";
          const studentPhone =
            formatPhoneNumber(student.phone) || student.phone || "-";
          const parentPhone =
            formatPhoneNumber(student.parentPhone) ||
            student.parentPhone ||
            "-";

          return (
            <div
              key={student.id}
              className="rounded-[16px] border border-[#f4f6fa] bg-[#f7f8fa] px-6 py-4"
            >
              <div className="flex flex-col gap-4 lg:grid lg:grid-cols-[minmax(0,1.15fr)_1px_minmax(0,1fr)_1px_minmax(0,1fr)] lg:items-center lg:gap-6">
                <div className="flex min-w-0 items-center gap-4">
                  <StudentProfileAvatar
                    sizePreset="Medium"
                    seedKey={student.id}
                    size={40}
                    label={`${student.name || "학생"} 프로필 이미지`}
                  />
                  <div className="min-w-0">
                    <p className="truncate text-[14px] font-semibold leading-5 tracking-[-0.14px] text-[#6b6f80]">
                      {student.name || "-"}
                    </p>
                    <p className="truncate text-[14px] font-medium leading-5 tracking-[-0.14px] text-[#8b90a3]">
                      {schoolGrade}
                    </p>
                  </div>
                </div>

                <div className="hidden h-10 w-px bg-[#eaecf2] lg:block" />

                <div>
                  <p className="text-[14px] font-semibold leading-5 tracking-[-0.14px] text-[#6b6f80]">
                    학생 연락처
                  </p>
                  <p className="text-[14px] font-medium leading-5 tracking-[-0.14px] text-[#8b90a3]">
                    {studentPhone}
                  </p>
                </div>

                <div className="hidden h-10 w-px bg-[#eaecf2] lg:block" />

                <div>
                  <p className="text-[14px] font-semibold leading-5 tracking-[-0.14px] text-[#6b6f80]">
                    학부모 연락처
                  </p>
                  <p className="text-[14px] font-medium leading-5 tracking-[-0.14px] text-[#8b90a3]">
                    {parentPhone}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
