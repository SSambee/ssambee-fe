"use client";

import { useState, useMemo } from "react";
import { AlertTriangle, Eye, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { StudentProfileAvatar } from "@/components/common/avatar/StudentProfileAvatar";
import { cn } from "@/lib/utils";
import { GradingStudent } from "@/types/grading";

const ROW_HEIGHT_PX = 72;
const VISIBLE_ROW_COUNT = 7;
const GAP_PX = 8; // space-y-2 is 0.5rem = 8px
const LIST_MAX_HEIGHT_PX =
  ROW_HEIGHT_PX * VISIBLE_ROW_COUNT + GAP_PX * (VISIBLE_ROW_COUNT - 1);

type StudentListSidebarProps = {
  students: GradingStudent[];
  selectedStudentId?: string;
  onSelectStudentAction?: (studentId: string) => void;
  onCompleteAction?: () => void;
  onOpenResultModalAction?: () => void;
  disableComplete?: boolean;
  disabled?: boolean;
  canViewResult?: boolean;
};

const getStudentStatus = (student: GradingStudent) => {
  if (student.isFinalSaved) return "saved";
  if (student.hasDraft) return "draft";
  return "pending";
};

export function StudentListSidebar({
  students,
  selectedStudentId,
  onSelectStudentAction,
  onCompleteAction,
  onOpenResultModalAction,
  disableComplete = false,
  disabled = false,
  canViewResult = false,
}: StudentListSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "pending" | "draft" | "saved"
  >("all");
  const [showIncompleteFirst, setShowIncompleteFirst] = useState(false);

  const isAllSaved =
    students.length > 0 && students.every((student) => student.isFinalSaved);
  const isCompleteDisabled = disableComplete || !isAllSaved;

  const filteredStudents = useMemo(() => {
    let result = students;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter((s) => s.name.toLowerCase().includes(query));
    }

    if (statusFilter !== "all") {
      result = result.filter((s) => getStudentStatus(s) === statusFilter);
    }

    if (showIncompleteFirst) {
      result = [...result].sort((a, b) => {
        const statusPriority = { pending: 0, draft: 1, saved: 2 };
        return (
          statusPriority[getStudentStatus(a)] -
          statusPriority[getStudentStatus(b)]
        );
      });
    }

    return result;
  }, [students, searchQuery, statusFilter, showIncompleteFirst]);

  return (
    <aside className="w-full shrink-0 space-y-4 xl:w-[320px]">
      <Card className="rounded-[20px] border border-[#eaecf2] bg-white shadow-none">
        <CardContent className="space-y-4 p-5">
          <div>
            <h2 className="text-[18px] font-semibold tracking-[-0.18px] text-[#4a4d5c]">
              학생 리스트
            </h2>
            <p className="mt-1 text-[13px] font-medium text-[#8b90a3]">
              총 {students.length}명 / 검색 {filteredStudents.length}명
            </p>
          </div>

          <div className="space-y-2.5">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#b0b4c2]" />
              <Input
                placeholder="이름 검색"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                className="h-10 rounded-[12px] border-[#e9ebf0] bg-[#fcfcfd] pl-9 text-[13px] font-medium tracking-[-0.13px] placeholder:text-[#8b90a3]"
              />
            </div>

            <div className="flex gap-1.5">
              {(["all", "pending", "draft", "saved"] as const).map((status) => {
                const isActive = statusFilter === status;

                return (
                  <Button
                    key={status}
                    variant="outline"
                    className={cn(
                      "h-8 flex-1 rounded-full px-0 text-[11px] font-semibold",
                      isActive
                        ? "border-[#3863f6] bg-[#3863f6] text-white hover:bg-[#2f57e8] hover:text-white"
                        : "border-[#d6d9e0] bg-white text-[#6b6f80] hover:bg-[#fcfcfd] hover:text-[#5e6275]"
                    )}
                    onClick={() => setStatusFilter(status)}
                  >
                    {status === "all"
                      ? "전체"
                      : status === "pending"
                        ? "대기"
                        : status === "draft"
                          ? "임시"
                          : "완료"}
                  </Button>
                );
              })}
            </div>

            <div className="flex items-center gap-2 rounded-[10px] bg-[#f8f9fc] px-3 py-2">
              <Switch
                id="incomplete-first"
                checked={showIncompleteFirst}
                onCheckedChange={setShowIncompleteFirst}
              />
              <Label
                htmlFor="incomplete-first"
                className="cursor-pointer text-[12px] font-semibold text-[#6b6f80]"
              >
                미완료 우선 정렬
              </Label>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-[20px] border border-[#eaecf2] bg-white shadow-none">
        <CardContent
          className="overflow-y-auto space-y-2.5 p-3.5"
          style={{ maxHeight: LIST_MAX_HEIGHT_PX + 14 }}
        >
          {filteredStudents.length === 0 ? (
            <div className="py-10 text-center text-[13px] font-medium text-[#8b90a3]">
              검색 결과가 없습니다.
            </div>
          ) : (
            filteredStudents.map((student) => {
              const isSelected = selectedStudentId === student.id;
              const status = getStudentStatus(student);

              let statusBadgeClass = "bg-[#f4f6fb] text-[#8b90a3]";
              let statusText = "대기";

              if (status === "saved") {
                statusBadgeClass = "bg-[#ecf8ef] text-[#1f8b4d]";
                statusText = `완료 (${student.score ?? 0}점)`;
              } else if (status === "draft") {
                statusBadgeClass = "bg-[#fff7e8] text-[#c27a16]";
                statusText = "임시 저장";
              }

              return (
                <Card
                  key={student.id}
                  style={{ height: ROW_HEIGHT_PX }}
                  className={cn(
                    "border-[#eaecf2] shadow-none transition-colors",
                    disabled
                      ? "cursor-not-allowed opacity-60"
                      : "cursor-pointer hover:bg-[#fcfcfd]",
                    isSelected ? "border-[#dce4ff] bg-[#f4f7ff]" : "bg-white"
                  )}
                  onClick={() => {
                    if (disabled) return;
                    onSelectStudentAction?.(student.id);
                  }}
                >
                  <CardContent className="p-3">
                    <div className="mb-1 flex items-start justify-between gap-2">
                      <div className="flex min-w-0 items-center gap-2">
                        <StudentProfileAvatar
                          size={28}
                          seedKey={student.id}
                          label={`${student.name || "학생"} 프로필 이미지`}
                        />
                        <p className="truncate text-[13px] font-semibold text-[#4a4d5c]">
                          {student.name}
                        </p>
                      </div>
                      <span
                        className={cn(
                          "rounded-full px-2 py-1 text-[10px] font-semibold",
                          statusBadgeClass
                        )}
                      >
                        {statusText}
                      </span>
                    </div>
                    <p className="text-[11px] font-medium text-[#8b90a3]">
                      {student.lectureName}
                    </p>
                  </CardContent>
                </Card>
              );
            })
          )}
        </CardContent>
      </Card>

      <Card className="rounded-[20px] border border-[#eaecf2] bg-white shadow-none">
        <CardContent className="space-y-2.5 p-4">
          <Button
            variant="outline"
            className={cn(
              "h-10 w-full rounded-[12px] text-[13px] font-semibold",
              isCompleteDisabled
                ? "border-[#d6d9e0] bg-white text-[#a1a6b8] hover:bg-white hover:text-[#a1a6b8]"
                : "border-[#f3c28d] bg-[#fff7ed] text-[#b45309] hover:bg-[#ffedd5] hover:text-[#9a3412]"
            )}
            disabled={isCompleteDisabled}
            onClick={onCompleteAction}
          >
            <AlertTriangle className="mr-2 h-4 w-4" />
            채점 최종 완료
          </Button>
          <Button
            variant="outline"
            className="h-10 w-full rounded-[12px] border-[#d6d9e0] bg-white text-[13px] font-semibold text-[#6b6f80] hover:bg-[#fcfcfd] hover:text-[#5e6275]"
            disabled={disabled || !canViewResult}
            onClick={onOpenResultModalAction}
          >
            <Eye className="mr-2 h-4 w-4" />
            채점 결과 보기
          </Button>
          <p className="text-center text-[11px] font-medium text-[#8b90a3]">
            {isCompleteDisabled
              ? "모든 학생 저장 후 최종 완료가 가능합니다."
              : "최종 완료 시 클리닉 대상이 자동 생성됩니다."}
          </p>
          <p className="text-center text-[11px] font-medium text-[#8b90a3]">
            {canViewResult
              ? "채점 결과 통계를 확인할 수 있습니다."
              : "완료 이후 결과 보기 버튼이 활성화됩니다."}
          </p>
        </CardContent>
      </Card>
    </aside>
  );
}
