"use client";

import { useState } from "react";
import { AlertCircle } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useModal } from "@/providers/ModalProvider";
import { Materials } from "@/types/materials.type";
import SelectBtn from "@/components/common/button/SelectBtn";
import { MOCK_STUDENTS, MOCK_CLASSES } from "@/data/communication.mock";
import { useAuthContext } from "@/providers/AuthProvider";

type ExportToNoticeModalProps = {
  material: Materials;
};

export function ExportToNoticeModal({ material }: ExportToNoticeModalProps) {
  const { isOpen, closeModal } = useModal();
  const [selectedClassId, setSelectedClassId] = useState<string>("");
  const [studentSearchQuery, setStudentSearchQuery] = useState("");
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
  const [message, setMessage] = useState("");

  const { user } = useAuthContext();
  const userName = user?.name || "";

  // 클래스 선택
  const handleClassSelect = (classId: string) => {
    setSelectedClassId(classId);
    setSelectedStudentIds([]);
  };

  // 필터링된 학생 목록
  const filteredStudents = MOCK_STUDENTS.filter((student) => {
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
    setSelectedStudentIds(
      selectedStudentIds.includes(studentId)
        ? selectedStudentIds.filter((id) => id !== studentId)
        : [...selectedStudentIds, studentId]
    );
  };

  // 전체 선택/해제
  const toggleAllStudents = () => {
    const allFilteredSelected = filteredStudents.every((s) =>
      selectedStudentIds.includes(s.id)
    );
    const filteredIds = filteredStudents.map((s) => s.id);
    if (allFilteredSelected) {
      setSelectedStudentIds(
        selectedStudentIds.filter((id) => !filteredIds.includes(id))
      );
    } else {
      setSelectedStudentIds([
        ...new Set([...selectedStudentIds, ...filteredIds]),
      ]);
    }
  };

  const handleExport = () => {
    if (selectedStudentIds.length === 0) {
      alert("알림을 받을 학생을 선택해주세요.");
      return;
    }

    if (!message.trim()) {
      alert("전송 메시지를 입력해주세요.");
      return;
    }

    // TODO: API
    console.log("공지 내보내기:", {
      materialId: material.id,
      materialTitle: material.title,
      studentIds: selectedStudentIds,
      message,
    });

    alert("학습 자료가 공지로 전송되었습니다.");
    handleClose();
  };

  const handleClose = () => {
    setSelectedClassId("");
    setStudentSearchQuery("");
    setSelectedStudentIds([]);
    setMessage("");
    closeModal();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">공지로 내보내기</DialogTitle>
          <DialogDescription>학습 자료를 전달합니다.</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* 발신자 */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">발신자</Label>
            <Input value={userName} disabled className="bg-gray-50 h-[58px]" />
          </div>

          {/* 클래스 선택 */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">클래스 선택</Label>
            <SelectBtn
              id="classSelect"
              value={selectedClassId}
              onChange={(value) => handleClassSelect(value)}
              placeholder="클래스를 선택하세요"
              optionSize="sm"
              className="text-base px-4 h-[58px] w-full"
              options={MOCK_CLASSES.map((cls) => ({
                label: cls.name,
                value: cls.id,
              }))}
            />
          </div>

          {/* 학생 검색 */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">학생 이름 검색</Label>
            <Input
              className="h-14 w-full p-4 text-base placeholder:text-base"
              placeholder="이름으로 검색해보세요"
              value={studentSearchQuery}
              onChange={(e) => setStudentSearchQuery(e.target.value)}
            />
          </div>

          {/* 학생 선택 */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">학생 선택</Label>
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

            <div className="max-h-[250px] overflow-y-auto space-y-1.5 border rounded-md p-2">
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
                          <span className="text-xs text-muted-foreground">
                            학생 {student.studentPhone}
                          </span>
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
              <p className="text-sm font-medium text-blue-600">
                {selectedStudentIds.length}명 선택됨
              </p>
            )}
          </div>

          {/* 전송 메시지 */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">전송 메시지</Label>
            <Textarea
              placeholder="학생들에게 전달할 메시지를 입력하세요"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground">
              * 이 메시지는 게시글의 상세 설명이 됩니다.
            </p>
          </div>

          {/* 주의사항 */}
          <div className="flex gap-2 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-sm font-medium text-amber-900">주의사항</p>
              <p className="text-xs text-amber-800">
                첨부 자료는 해당 공지의 상세 페이지에서 바로 확인할 수 있습니다.
                학부모는 전송 대상에서 제외됩니다.
              </p>
            </div>
          </div>

          {/* 버튼 */}
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="cursor-pointer"
            >
              닫기
            </Button>
            <Button
              onClick={handleExport}
              disabled={selectedStudentIds.length === 0 || !message.trim()}
              className={`cursor-pointer ${
                selectedStudentIds.length === 0 || !message.trim()
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
            >
              내보내기
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
