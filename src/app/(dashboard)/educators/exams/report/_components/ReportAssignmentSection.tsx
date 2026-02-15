"use client";

import { ListChecks } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useReportAssignmentSection } from "../_hooks/useReportAssignmentSection";

export function ReportAssignmentSection() {
  const {
    selectedExamId,
    selectedStudentId,
    selectedStudent,
    includedCategories,
    includedCategoryNames,
    isInputReady,
    hasSavedSelection,
    draftMissingCount,
    draftSelections,
    isModalOpen,
    handleOpenModal,
    handleModalOpenChange,
    handleSelectPreset,
    handleSaveDraft,
    backendAssignmentRows,
  } = useReportAssignmentSection();

  return (
    <>
      <Button
        onClick={handleOpenModal}
        disabled={!selectedExamId}
        className={`w-full gap-2 ${hasSavedSelection ? "bg-green-600 hover:bg-green-700" : ""}`}
      >
        <ListChecks className="h-4 w-4" />
        {hasSavedSelection
          ? "과제/카테고리 입력 수정"
          : "과제/카테고리 입력 작성"}
      </Button>
      {(!isInputReady || !hasSavedSelection) && (
        <p className="mt-1 text-xs text-muted-foreground">
          {!isInputReady
            ? "시험/학생 선택 후 입력할 수 있습니다."
            : "상태: 미작성"}
        </p>
      )}

      <Dialog open={isModalOpen} onOpenChange={handleModalOpenChange}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>과제/카테고리 입력</DialogTitle>
            <DialogDescription>
              현재 시험에서 포함된 카테고리를 학생별로 입력합니다.
            </DialogDescription>
          </DialogHeader>

          <Card className="bg-muted/30">
            <CardContent className="space-y-3 py-4">
              {!selectedExamId ? (
                <p className="text-sm text-muted-foreground">
                  먼저 시험을 선택해주세요.
                </p>
              ) : includedCategories.length === 0 &&
                backendAssignmentRows.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  이 시험에 포함된 카테고리가 없습니다. 시험관리 화면에서 포함
                  설정을 해주세요.
                </p>
              ) : !selectedStudentId ? (
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    학생을 선택하면 아래 카테고리별 결과를 입력할 수 있습니다.
                  </p>
                  <div className="rounded-md border bg-background p-3 text-xs text-muted-foreground">
                    <p>입력 대상: {includedCategoryNames.join(", ")}</p>
                    <p className="mt-1">
                      입력 방식: 각 항목에서 결과 1개를 선택
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="rounded-md border bg-background p-3 text-xs text-muted-foreground">
                    <p>
                      현재 학생:{" "}
                      <span className="font-medium">
                        {selectedStudent?.name ?? "-"}
                      </span>
                    </p>
                    <p className="mt-1">
                      입력 대상: {includedCategoryNames.join(", ")}
                    </p>
                    <p className="mt-1">미입력 항목: {draftMissingCount}개</p>
                    <p className="mt-1">
                      저장 방법: 모달 하단 <strong>임시저장</strong> 후 상단{" "}
                      <strong>현재 학생 최종저장</strong> 클릭
                    </p>
                  </div>

                  <div className="space-y-3">
                    {includedCategories.map((category) => (
                      <div
                        key={category.id}
                        className="rounded-md border bg-background p-3"
                      >
                        <p className="text-sm font-medium">{category.name}</p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {category.presets.map((preset) => {
                            const active =
                              draftSelections[category.id] === preset;
                            return (
                              <button
                                key={`${category.id}-${preset}`}
                                type="button"
                                onClick={() =>
                                  handleSelectPreset(category.id, preset)
                                }
                                className={`rounded-full border px-3 py-1.5 text-xs transition-colors ${
                                  active
                                    ? "border-primary bg-primary text-primary-foreground"
                                    : "bg-muted/40 hover:bg-muted"
                                }`}
                              >
                                {preset}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>

                  <p className="text-xs text-muted-foreground">
                    현재 단계는 UI 스켈레톤이며, 입력값은 로컬 브라우저에 임시
                    저장됩니다.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                void handleModalOpenChange(false);
              }}
            >
              닫기
            </Button>
            <Button onClick={handleSaveDraft} disabled={!isInputReady}>
              임시저장
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
