"use client";

import { useState } from "react";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import SelectBtn from "@/components/common/button/SelectBtn";
import {
  NoticeType,
  ReadPermissionType,
  Student,
} from "@/types/communication.type";
import {
  NOTICE_TYPE_OPTIONS,
  READ_PERMISSION_OPTIONS,
} from "@/constants/communication.default";
import { MOCK_STUDENTS } from "@/data/communication.mock";
import { MOCK_CLASSES } from "@/data/communication.mock";

type PostSettingProps = {
  selectedStudentIds: string[];
  onStudentIdsChange: (ids: string[]) => void;
  recipientType: NoticeType;
  onRecipientTypeChange: (type: NoticeType) => void;
  readPermission: ReadPermissionType;
  onReadPermissionChange: (type: ReadPermissionType) => void;
};

export default function PostSetting({
  selectedStudentIds,
  onStudentIdsChange,
  recipientType,
  onRecipientTypeChange,
  readPermission,
  onReadPermissionChange,
}: PostSettingProps) {
  const [selectedClassId, setSelectedClassId] = useState<string>("");
  const [studentSearchQuery, setStudentSearchQuery] = useState("");

  // 클래스 선택
  const handleClassSelect = (classId: string) => {
    setSelectedClassId(classId);
    // 클래스 변경 시 선택된 학생 초기화
    onStudentIdsChange([]);
  };

  // 필터링된 학생 목록
  const filteredStudents = MOCK_STUDENTS.filter((student) => {
    // 전체 클래스 선택 시 모든 학생 표시
    const matchesClass =
      !selectedClassId || selectedClassId === "ALL"
        ? true
        : student.classId === selectedClassId;
    const matchesSearch = student.name
      .toLowerCase()
      .includes(studentSearchQuery.toLowerCase());
    return matchesClass && matchesSearch;
  });

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
    if (selectedStudentIds.length === filteredStudents.length) {
      onStudentIdsChange([]);
    } else {
      onStudentIdsChange(filteredStudents.map((s) => s.id));
    }
  };

  // 전화번호 표시 로직
  const renderPhoneNumbers = (student: Student) => {
    if (recipientType === "STUDENT") {
      return (
        <span className="text-xs text-muted-foreground">
          학생 {student.studentPhone}
        </span>
      );
    } else if (recipientType === "PARENT") {
      return (
        <span className="text-xs text-muted-foreground">
          학부모 {student.parentPhone}
        </span>
      );
    } else {
      // ALL
      return (
        <span className="text-xs text-muted-foreground">
          학생 {student.studentPhone} | 학부모 {student.parentPhone}
        </span>
      );
    }
  };

  return (
    <>
      <Card>
        <CardContent className="p-6 space-y-4">
          <h3 className="font-semibold text-lg">게시글 설정</h3>
          <p className="text-sm text-muted-foreground">
            게시글을 작성할 클래스와 알림을 받을 대상을 선택하세요.
          </p>

          {/* 클래스 선택 */}
          <div className="space-y-2">
            <Label className="text-base font-medium">클래스 선택</Label>
            <SelectBtn
              id="classSelect"
              value={selectedClassId}
              onChange={(value) => handleClassSelect(value)}
              placeholder="클래스를 선택하세요"
              optionSize="sm"
              className="text-base px-4 h-[58px] w-full my-2"
              options={MOCK_CLASSES.map((cls) => ({
                label: cls.name,
                value: cls.id,
              }))}
            />
            <p className="text-xs text-muted-foreground">
              * 선택한 클래스의 학생들만 게시글을 확인할 수 있습니다.
            </p>
          </div>

          {/* 열람 권한 */}
          <div className="space-y-2">
            <Label className="text-base font-medium">열람 권한</Label>
            <SelectBtn
              id="readPermissionSelect"
              value={readPermission}
              onChange={(value) =>
                onReadPermissionChange(value as ReadPermissionType)
              }
              placeholder="열람 권한 선택"
              optionSize="sm"
              className="h-[58px] w-full my-2"
              options={READ_PERMISSION_OPTIONS}
            />
            <p className="text-xs text-muted-foreground">
              * 게시글을 열람할 수 있는 대상을 설정합니다.
            </p>
          </div>

          {/* 알림 수신 대상 */}
          <div className="space-y-2">
            <Label className="text-base font-medium">알림 수신 대상</Label>
            <SelectBtn
              id="recipientSelect"
              value={recipientType}
              onChange={(value) => onRecipientTypeChange(value as NoticeType)}
              placeholder="알림 수신 대상 선택"
              optionSize="sm"
              className="h-[58px] w-full my-2"
              options={NOTICE_TYPE_OPTIONS}
            />
            <p className="text-xs text-muted-foreground">
              * 게시글 등록 알림을 받을 대상을 선택합니다.
            </p>
          </div>

          {/* 학생 검색 */}
          <div className="space-y-2">
            <Label className="text-base font-medium">학생 검색</Label>
            <Input
              className="h-14 w-full p-4 text-base placeholder:text-base my-2"
              placeholder="이름으로 검색해보세요"
              value={studentSearchQuery}
              onChange={(e) => setStudentSearchQuery(e.target.value)}
            />
          </div>

          {/* 학생 선택 */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-base font-medium">학생 선택</Label>
              {filteredStudents.length > 0 && (
                <Button
                  variant="outline"
                  onClick={toggleAllStudents}
                  className="h-auto py-1 px-2 text-xs"
                >
                  {selectedStudentIds.length === filteredStudents.length
                    ? "전체 해제"
                    : "전체 선택"}
                </Button>
              )}
            </div>

            <div className="max-h-[350px] overflow-y-auto space-y-1.5 border rounded-md p-2">
              {filteredStudents.length > 0 ? (
                <>
                  {filteredStudents.map((student) => (
                    <div
                      key={student.id}
                      className={`px-4 py-3 border border-neutral-200 rounded-md text-sm cursor-pointer transition-colors ${
                        selectedStudentIds.includes(student.id)
                          ? "bg-blue-50 border-blue-600 shadow-sm"
                          : "hover:bg-muted"
                      }`}
                      onClick={() => toggleStudent(student.id)}
                    >
                      <div className="flex flex-col justify-center">
                        <div className="flex items-center">
                          <p className="text-sm">{student.name}</p>
                          <p className="text-sm text-muted-foreground ml-2">
                            ({student.className} / {student.schoolYear})
                          </p>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {renderPhoneNumbers(student)}
                        </div>
                      </div>
                    </div>
                  ))}
                </>
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
    </>
  );
}
