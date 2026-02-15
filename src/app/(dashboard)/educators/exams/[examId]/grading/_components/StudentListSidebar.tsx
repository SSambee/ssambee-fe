"use client";

import { useState, useMemo } from "react";
import { Check, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
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

  const getStudentStatus = (student: GradingStudent) => {
    if (student.isFinalSaved) return "saved";
    if (student.hasDraft) return "draft";
    return "pending";
  };

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
    <div className="w-80 flex flex-col h-full gap-4">
      <div className="space-y-4 flex-none">
        <div>
          <h2 className="text-lg font-semibold mb-1">학생 리스트</h2>
          <p className="text-sm text-muted-foreground">
            총 {students.length}명 / 검색 {filteredStudents.length}명
          </p>
        </div>

        <div className="space-y-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="이름 검색"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>

          <div className="flex gap-1">
            {(["all", "pending", "draft", "saved"] as const).map((status) => (
              <Button
                key={status}
                variant={statusFilter === status ? "default" : "outline"}
                className="flex-1 px-0 text-xs h-8"
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
            ))}
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="incomplete-first"
              checked={showIncompleteFirst}
              onCheckedChange={setShowIncompleteFirst}
            />
            <Label
              htmlFor="incomplete-first"
              className="text-sm cursor-pointer"
            >
              미완료 우선 정렬
            </Label>
          </div>
        </div>
      </div>

      <div
        className="overflow-y-auto min-h-0 space-y-2 pr-1"
        style={{ maxHeight: LIST_MAX_HEIGHT_PX }}
      >
        {filteredStudents.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground text-sm">
            검색 결과가 없습니다.
          </div>
        ) : (
          filteredStudents.map((student) => {
            const isSelected = selectedStudentId === student.id;
            const status = getStudentStatus(student);

            let statusBadgeClass = "bg-gray-100 text-gray-800";
            let statusText = "대기";

            if (status === "saved") {
              statusBadgeClass = "bg-green-100 text-green-800";
              statusText = `완료 (${student.score ?? 0}점)`;
            } else if (status === "draft") {
              statusBadgeClass = "bg-yellow-100 text-yellow-800";
              statusText = "임시 저장";
            }

            return (
              <Card
                key={student.id}
                style={{ height: ROW_HEIGHT_PX }}
                className={`transition-colors flex flex-col justify-center ${
                  disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"
                } ${isSelected ? "bg-primary/10 border-primary" : ""}`}
                onClick={() => {
                  if (disabled) return;
                  onSelectStudentAction?.(student.id);
                }}
              >
                <CardContent className="p-3">
                  <div className="flex justify-between items-start mb-1">
                    <p className="font-medium text-sm">{student.name}</p>
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${statusBadgeClass}`}
                    >
                      {statusText}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {student.lectureName}
                  </p>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      <div className="space-y-2 flex-none pt-2 border-t">
        <Button
          className="w-full"
          size="lg"
          disabled={isCompleteDisabled}
          onClick={onCompleteAction}
        >
          <Check className="h-4 w-4 mr-2" />
          전체 완료
        </Button>
        <Button
          variant="outline"
          className="w-full"
          disabled={disabled || !canViewResult}
          onClick={onOpenResultModalAction}
        >
          결과 보기
        </Button>
        <p className="text-xs text-muted-foreground text-center">
          모든 학생이 저장되면 활성화됩니다.
        </p>
      </div>
    </div>
  );
}
