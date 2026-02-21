"use client";

import { useMemo } from "react";
import Link from "next/link";
import { Loader2, Plus, X } from "lucide-react";

import Title from "@/components/common/header/Title";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Exam } from "@/types/exams";

import { useExamsCategoryModal } from "../_hooks/useExamsCategoryModal";

type ExamsHeaderProps = {
  exams: Exam[];
};

export function ExamsHeader({ exams }: ExamsHeaderProps) {
  const {
    presetSnippets,
    isCategoryModalOpen,
    isFetchingCategories,
    isCreatingCategory,
    isBusy,
    categories,
    availableAssignments,
    selectedExam,
    classOptions,
    classSearchQuery,
    setClassSearchQuery,
    classSelectValue,
    filteredClassOptions,
    setSelectedClassKey,
    examSearchQuery,
    setExamSearchQuery,
    examsInSelectedClass,
    examSelectValue,
    filteredExamsInSelectedClass,
    setSelectedExamId,
    categoryName,
    setCategoryName,
    presetInput,
    setPresetInput,
    presetDrafts,
    createError,
    setCreateError,
    canCreateCategory,
    duplicatedCategoryName,
    showIncludedOnly,
    setShowIncludedOnly,
    effectiveExamId,
    includedCategoryIds,
    visibleCategories,
    hasPendingChanges,
    pushPresetDraft,
    removePresetDraft,
    applySnippet,
    handleCreateCategory,
    toggleIncluded,
    handleSaveModal,
    handleModalOpenChange,
  } = useExamsCategoryModal(exams);

  const assignmentCountByCategory = useMemo(() => {
    return availableAssignments.reduce<Record<string, number>>((acc, row) => {
      acc[row.categoryId] = (acc[row.categoryId] ?? 0) + 1;
      return acc;
    }, {});
  }, [availableAssignments]);

  return (
    <>
      <div className="space-y-6">
        <Title
          title="시험 및 과제 관리"
          description="학생 평가를 생성, 채점 및 관리합니다."
        />

        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" className="rounded-full">
            시험 관리
          </Button>
          <Button variant="outline" className="rounded-full" asChild>
            <Link href="/educators/exams/create">시험 등록/수정</Link>
          </Button>
          <Button variant="outline" className="rounded-full" asChild>
            <Link href="/educators/exams/clinic">클리닉</Link>
          </Button>
          <Button variant="outline" className="rounded-full" asChild>
            <Link href="/educators/exams/mini-tests">미니테스트</Link>
          </Button>
          <Button className="rounded-full" asChild>
            <Link href="/educators/exams/report">성적표 발송</Link>
          </Button>
        </div>
      </div>

      <Dialog
        open={isCategoryModalOpen}
        onOpenChange={(nextOpen) => {
          void handleModalOpenChange(nextOpen);
        }}
      >
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>카테고리 등록</DialogTitle>
            <DialogDescription>
              카테고리는 분류/프리셋 라이브러리이며, 성적표 포함은 과제 단위로
              설정합니다.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-5 xl:grid-cols-12">
            <div className="space-y-3 rounded-lg border border-dashed bg-muted/20 p-4 xl:col-span-5">
              <div className="space-y-1">
                <p className="text-sm font-semibold">새 카테고리 추가</p>
                <p className="text-xs text-muted-foreground">
                  카테고리 생성 후 해당 카테고리 과제를 만들어야 포함 설정
                  목록에 표시됩니다.
                </p>
              </div>

              <Input
                value={categoryName}
                onChange={(event) => {
                  setCategoryName(event.target.value);
                  setCreateError(null);
                }}
                placeholder="예: 단어 테스트, 복습 퀴즈, 과제 수행"
                disabled={isBusy}
              />

              <div className="flex flex-col gap-2 sm:flex-row">
                <Input
                  value={presetInput}
                  onChange={(event) => {
                    setPresetInput(event.target.value);
                    setCreateError(null);
                  }}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      pushPresetDraft();
                    }
                  }}
                  placeholder="프리셋 입력 후 Enter (예: O, X, A, B, C, D)"
                  disabled={isBusy}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={pushPresetDraft}
                  disabled={isBusy}
                >
                  추가
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
                {presetSnippets.map((snippet) => (
                  <Button
                    key={snippet.label}
                    type="button"
                    variant="outline"
                    className="h-8 px-3 text-xs"
                    onClick={() => applySnippet(snippet)}
                    disabled={isBusy}
                  >
                    {snippet.label}
                  </Button>
                ))}
              </div>

              <div className="flex flex-wrap gap-2 rounded-md border bg-background p-2">
                {presetDrafts.length === 0 ? (
                  <span className="text-xs text-muted-foreground">
                    프리셋을 1개 이상 추가해주세요.
                  </span>
                ) : (
                  presetDrafts.map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      className="inline-flex items-center gap-1 rounded-full border px-2 py-1 text-xs"
                      onClick={() => removePresetDraft(preset)}
                    >
                      {preset}
                      <X className="h-3 w-3" />
                    </button>
                  ))
                )}
              </div>

              {createError ? (
                <p className="text-xs text-destructive">{createError}</p>
              ) : null}

              <Button
                type="button"
                onClick={handleCreateCategory}
                disabled={
                  !canCreateCategory || duplicatedCategoryName || isBusy
                }
                className="w-full gap-2"
              >
                {isCreatingCategory ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Plus className="h-4 w-4" />
                )}
                카테고리 추가
              </Button>
            </div>

            <div className="space-y-4 rounded-lg border p-4 xl:col-span-7">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-semibold">
                  시험별 성적표 포함 설정 (과제 단위)
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">
                    선택한 과제만 성적표 발송 화면에 노출됩니다.
                  </span>
                  <Button
                    type="button"
                    variant={showIncludedOnly ? "default" : "outline"}
                    className="h-8 px-3 text-xs"
                    onClick={() => setShowIncludedOnly((prev) => !prev)}
                    disabled={
                      !effectiveExamId || isBusy || categories.length === 0
                    }
                  >
                    {showIncludedOnly ? "전체 보기" : "포함만 보기"}
                  </Button>
                </div>
              </div>

              {classOptions.length === 0 ? (
                <p className="text-xs text-muted-foreground">
                  시험 목록이 없습니다. 시험을 먼저 등록해주세요.
                </p>
              ) : (
                <div className="space-y-3">
                  <div className="grid gap-3 md:grid-cols-2">
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-muted-foreground">
                        클래스 선택
                      </p>
                      <Input
                        value={classSearchQuery}
                        onChange={(event) => {
                          setClassSearchQuery(event.target.value);
                        }}
                        placeholder="클래스명 검색"
                        disabled={isBusy}
                      />
                      <Select
                        value={classSelectValue}
                        onValueChange={setSelectedClassKey}
                        disabled={isBusy || filteredClassOptions.length === 0}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="클래스 선택" />
                        </SelectTrigger>
                        <SelectContent>
                          {filteredClassOptions.map((option) => (
                            <SelectItem key={option.key} value={option.key}>
                              {option.name} ({option.examCount})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {filteredClassOptions.length === 0 ? (
                        <p className="text-xs text-muted-foreground">
                          검색된 클래스가 없습니다.
                        </p>
                      ) : null}
                    </div>

                    <div className="space-y-1">
                      <p className="text-xs font-medium text-muted-foreground">
                        시험 선택
                      </p>
                      <Input
                        value={examSearchQuery}
                        onChange={(event) => {
                          setExamSearchQuery(event.target.value);
                        }}
                        placeholder="시험명 검색"
                        disabled={isBusy}
                      />

                      {examsInSelectedClass.length === 0 ? (
                        <p className="rounded-md border bg-muted/20 px-3 py-2 text-xs text-muted-foreground">
                          선택한 클래스에 연결된 시험이 없습니다.
                        </p>
                      ) : (
                        <>
                          <Select
                            value={examSelectValue}
                            onValueChange={setSelectedExamId}
                            disabled={
                              isBusy ||
                              filteredExamsInSelectedClass.length === 0
                            }
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="시험 선택" />
                            </SelectTrigger>
                            <SelectContent>
                              {filteredExamsInSelectedClass.map((exam) => (
                                <SelectItem key={exam.id} value={exam.id}>
                                  {exam.name} ({exam.registrationDate})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {filteredExamsInSelectedClass.length === 0 ? (
                            <p className="text-xs text-muted-foreground">
                              검색된 시험이 없습니다.
                            </p>
                          ) : null}
                        </>
                      )}
                    </div>
                  </div>

                  <div className="rounded-md border bg-muted/30 px-3 py-2 text-xs text-muted-foreground">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span>
                        현재 클래스: {selectedExam?.lectureName ?? "미선택"}
                      </span>
                      <span>
                        현재 시험: {selectedExam?.name ?? "시험 미선택"}
                      </span>
                      <span>
                        표시 {visibleCategories.length}/{categories.length} ·
                        과제 {availableAssignments.length}개 · 포함 카테고리{" "}
                        {includedCategoryIds.length}개
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <div className="max-h-[420px] space-y-2 overflow-y-auto pr-1">
                {isFetchingCategories && categories.length === 0 ? (
                  <div className="flex justify-center py-4">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                ) : visibleCategories.length === 0 ? (
                  <p className="rounded-md border bg-muted/20 px-3 py-2 text-xs text-muted-foreground">
                    {showIncludedOnly
                      ? "현재 시험에 포함된 카테고리가 없습니다. 전체 보기로 전환해 추가해주세요."
                      : "등록된 카테고리가 없습니다. 좌측에서 새 카테고리를 추가해주세요."}
                  </p>
                ) : (
                  visibleCategories.map((category) => {
                    const included = includedCategoryIds.includes(category.id);
                    const linkedCount =
                      assignmentCountByCategory[category.id] ?? 0;
                    const isSelectable = linkedCount > 0;

                    return (
                      <div
                        key={category.id}
                        className="flex items-center justify-between rounded-md border px-3 py-2"
                      >
                        <div className="space-y-1">
                          <p className="text-sm font-medium">{category.name}</p>
                          <p className="text-[10px] text-muted-foreground">
                            연결 과제 {linkedCount}개
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {category.presets.map((preset) => (
                              <span
                                key={`${category.id}-${preset}`}
                                className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground"
                              >
                                {preset}
                              </span>
                            ))}
                          </div>
                        </div>

                        <Button
                          type="button"
                          variant={included ? "default" : "outline"}
                          onClick={() => toggleIncluded(category.id)}
                          disabled={!effectiveExamId || isBusy || !isSelectable}
                          title={
                            isSelectable
                              ? undefined
                              : "연결된 과제가 없어 포함할 수 없습니다. 과제를 먼저 생성해주세요."
                          }
                          className="min-w-[88px]"
                        >
                          {included ? "제외하기" : "포함하기"}
                        </Button>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          <DialogFooter>
            <p className="mr-auto text-xs text-muted-foreground">
              포함 설정 변경 후 <strong>포함 설정 저장</strong>을 눌러
              반영하세요.
            </p>
            <Button
              variant="outline"
              type="button"
              onClick={() => {
                void handleModalOpenChange(false);
              }}
              disabled={isBusy}
            >
              닫기
            </Button>
            <Button
              type="button"
              onClick={() => {
                void handleSaveModal();
              }}
              disabled={isBusy || !hasPendingChanges}
            >
              포함 설정 저장
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
