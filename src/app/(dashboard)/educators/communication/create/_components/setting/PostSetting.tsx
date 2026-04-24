"use client";

import { useState } from "react";
import { Check } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import SelectBtn from "@/components/common/button/SelectBtn";
import { TargetRole } from "@/types/communication/instructorPost";
import { NOTICE_TYPE_OPTIONS } from "@/constants/communication.default";
import { useInstructorPostTargets } from "@/hooks/useInstructorPost";
import { StudentProfileAvatar } from "@/components/common/avatar/StudentProfileAvatar";

type PostSettingProps = {
  selectedClassId: string;
  onClassIdChange: (id: string) => void;
  selectedStudentIds: string[];
  onStudentIdsChange: (ids: string[]) => void;
  targetRole: TargetRole;
  onTargetRoleChange: (role: TargetRole) => void;
};

export default function PostSetting({
  selectedClassId,
  onClassIdChange,
  selectedStudentIds,
  onStudentIdsChange,
  targetRole,
  onTargetRoleChange,
}: PostSettingProps) {
  const [studentSearchQuery, setStudentSearchQuery] = useState("");

  const { data, isLoading } = useInstructorPostTargets();

  // 클래스 선택
  const classOptions = [
    { label: "전체 클래스", value: "ALL" },
    ...(data?.lectures?.map((lex) => ({
      label: lex.lectureTitle,
      value: lex.lectureId,
    })) || []),
  ];

  // 필터링된 학생 목록
  const getFilteredStudents = () => {
    if (!data?.lectures) return [];

    const studentsMap = new Map(); // 중복 학생 제거용 (Map 사용 시 enrollmentId 기준)

    data.lectures.forEach((lecture) => {
      // 선택된 클래스가 'ALL'이거나 현재 루프의 강의 ID와 같을 때만 처리
      if (selectedClassId === "ALL" || lecture.lectureId === selectedClassId) {
        lecture.students.forEach((student) => {
          // 검색어 필터링
          if (
            student.studentName
              .toLowerCase()
              .includes(studentSearchQuery.toLowerCase())
          ) {
            if (!studentsMap.has(student.enrollmentId)) {
              studentsMap.set(student.enrollmentId, {
                ...student,
                lectureTitle: lecture.lectureTitle, // UI 표시용 강의명 추가
              });
            }
          }
        });
      }
    });

    return Array.from(studentsMap.values());
  };

  const filteredStudents = getFilteredStudents();

  // 학생 선택 토글
  const toggleStudent = (studentId: string) => {
    onStudentIdsChange(
      selectedStudentIds.includes(studentId)
        ? selectedStudentIds.filter((id) => id !== studentId)
        : [...selectedStudentIds, studentId]
    );
  };

  // 전체 선택/해제
  const toggleAllStudents = () => {
    const allFilteredIds = filteredStudents.map((s) => s.enrollmentId);
    const areAllSelected = allFilteredIds.every((id) =>
      selectedStudentIds.includes(id)
    );
    if (areAllSelected) {
      onStudentIdsChange(
        selectedStudentIds.filter((id) => !allFilteredIds.includes(id))
      );
    } else {
      onStudentIdsChange(
        Array.from(new Set([...selectedStudentIds, ...allFilteredIds]))
      );
    }
  };

  // 알림 수신 대상 표시
  const renderTargetRole = (targetRole: TargetRole) => {
    const targetRoleLabel = {
      STUDENT: "학생",
      PARENT: "학부모",
      ALL: "학생 및 학부모",
    };
    return targetRoleLabel[targetRole] || "";
  };

  if (isLoading)
    return <div className="p-10 text-center">데이터 로딩 중...</div>;

  return (
    <Card>
      <CardContent className="p-6 space-y-4">
        <h3 className="font-semibold text-lg">게시글 설정</h3>
        <p className="text-sm text-muted-foreground">
          게시글을 작성할 클래스와 알림을 받을 대상을 선택하세요.
        </p>

        <div className="space-y-2">
          <Label className="text-base font-medium">클래스 선택</Label>
          <SelectBtn
            id="classSelect"
            value={selectedClassId}
            onChange={(value) => onClassIdChange(value)}
            placeholder="클래스를 선택하세요"
            optionSize="lg"
            className="text-base px-4 h-[58px] w-full my-2"
            options={classOptions}
          />
          <p className="text-xs text-muted-foreground">
            * 선택한 클래스의 학생들만 게시글을 확인할 수 있습니다.
          </p>
        </div>

        <div className="space-y-2">
          <Label className="text-base font-medium">알림 수신 대상</Label>
          <SelectBtn
            id="recipientSelect"
            value={targetRole}
            onChange={(value) => onTargetRoleChange(value as TargetRole)}
            placeholder="알림 수신 대상 선택"
            optionSize="lg"
            className="h-[58px] w-full my-2"
            options={NOTICE_TYPE_OPTIONS}
          />
          <p className="text-xs text-muted-foreground">
            * 게시글 등록 알림을 받을 대상을 선택합니다.
          </p>
        </div>

        <div className="space-y-2">
          <Label className="text-base font-medium">학생 검색</Label>
          <Input
            className="h-14 w-full p-4 text-base placeholder:text-base my-2"
            placeholder="이름으로 검색해보세요"
            value={studentSearchQuery}
            onChange={(e) => setStudentSearchQuery(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-base font-medium">학생 선택</Label>
            {filteredStudents.length > 0 && (
              <Button
                variant="outline"
                onClick={toggleAllStudents}
                className="h-auto py-1 px-2 text-xs cursor-pointer"
              >
                {filteredStudents.every((s) =>
                  selectedStudentIds.includes(s.enrollmentId)
                )
                  ? "전체 해제"
                  : "전체 선택"}
              </Button>
            )}
          </div>

          <div className="max-h-[380px] overflow-y-auto space-y-2 rounded-xl border bg-slate-50/30 p-3 scrollbar-hide">
            {filteredStudents.length > 0 ? (
              filteredStudents.map((student) => {
                const isSelected = selectedStudentIds.includes(
                  student.enrollmentId
                );
                return (
                  <div
                    key={student.enrollmentId}
                    role="button"
                    onClick={() => toggleStudent(student.enrollmentId)}
                    className={`cursor-pointer group flex items-center justify-between p-3 rounded-xl border transition-all duration-200 ${
                      isSelected
                        ? "border-blue-200 shadow-sm"
                        : "bg-white hover:border-slate-300 hover:shadow-sm"
                    }`}
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div
                        className={`w-[40px] h-[40px] ${
                          isSelected
                            ? "bg-white border-blue-100"
                            : "bg-white border-slate-100"
                        }`}
                      >
                        <StudentProfileAvatar
                          sizePreset="Medium"
                          seedKey={student.enrollmentId}
                        />
                      </div>

                      <div className="flex flex-col overflow-hidden">
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-[14px] font-semibold ${isSelected ? "text-blue-900" : "text-slate-700"}`}
                          >
                            {student.studentName}
                          </span>
                          <span className="text-[11px] text-slate-400">
                            {student.school} • {student.schoolYear}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span
                            className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                              isSelected
                                ? "bg-blue-100 text-blue-600"
                                : "bg-slate-100 text-slate-500"
                            }`}
                          >
                            {renderTargetRole(targetRole)}
                          </span>
                          <span className="text-[11px] text-slate-400 truncate max-w-[150px]">
                            {student.lectureTitle}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div
                      className={`mr-1 h-5 w-5 rounded-full border flex items-center justify-center transition-all ${
                        isSelected
                          ? "bg-blue-600 border-blue-600"
                          : "bg-white border-slate-200 group-hover:border-slate-400"
                      }`}
                    >
                      {isSelected && (
                        <Check className="h-3 w-3 text-white stroke-[3px]" />
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                검색 결과가 없습니다.
              </p>
            )}
          </div>

          {selectedStudentIds.length > 0 && (
            <p className="text-xs text-muted-foreground">
              {selectedStudentIds.length}명 선택되었습니다.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
