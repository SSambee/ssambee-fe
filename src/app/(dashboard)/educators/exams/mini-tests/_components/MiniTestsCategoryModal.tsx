"use client";

import {
  Check,
  Loader2,
  MoreHorizontal,
  Pencil,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MAX_INCLUDED_ASSIGNMENTS } from "@/constants/exams.constants";
import { cn } from "@/lib/utils";

import type { useMiniTestsPage } from "../_hooks/useMiniTestsPage";

type MiniTestsCategoryModalProps = {
  vm: ReturnType<typeof useMiniTestsPage>;
};

export function MiniTestsCategoryModal({ vm }: MiniTestsCategoryModalProps) {
  return (
    <Dialog
      open={vm.isCategoryModalOpen}
      onOpenChange={vm.handleModalOpenChange}
    >
      <DialogContent className="max-h-[94vh] max-w-6xl overflow-y-auto rounded-[24px] border border-[#eaecf2] p-5 text-base sm:p-7">
        <DialogHeader className="border-b border-[#eaecf2] pb-4">
          <DialogTitle className="text-[22px] font-bold tracking-[-0.22px] text-[#040405]">
            카테고리
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-5 py-1 lg:grid-cols-[1.3fr_1fr]">
          <div className="space-y-4 lg:order-2">
            <div className="flex items-center justify-between rounded-[14px] border border-[#eaecf2] bg-[#fcfcfd] px-4 py-3">
              <div className="space-y-0.5">
                <h3 className="text-[16px] font-semibold tracking-[-0.16px] text-[#4a4d5c]">
                  고급 설정
                </h3>
              </div>
              <Button
                type="button"
                variant="outline"
                className="h-9 rounded-[10px] border-[#d6d9e0] px-4 text-[13px] font-semibold text-[#6b6f80] hover:bg-[#fcfcfd] hover:text-[#5e6275]"
                onClick={() => vm.setIsAdvancedCategoryOpen((prev) => !prev)}
              >
                {vm.isAdvancedCategoryOpen
                  ? "고급 설정 닫기"
                  : "고급 설정 열기"}
              </Button>
            </div>

            {!vm.isAdvancedCategoryOpen ? (
              <p className="rounded-[12px] border border-dashed border-[#d6d9e0] px-3 py-2 text-[13px] font-medium text-[#8b90a3]">
                기본 작업은 우측 &quot;시험에 과제 추가&quot; 영역에서
                완료됩니다.
              </p>
            ) : null}

            {vm.isAdvancedCategoryOpen ? (
              <>
                <div className="space-y-3 rounded-[14px] border border-dashed border-[#d6d9e0] bg-[#fcfcfd] p-4">
                  <Input
                    value={vm.categoryName}
                    onChange={(event) => {
                      vm.setCategoryName(event.target.value);
                      vm.setCreateError(null);
                    }}
                    placeholder="카테고리명 (예: 단어 테스트)"
                    disabled={vm.isBusy}
                    className="h-10 rounded-[10px] border-[#e9ebf0] bg-white text-[14px] font-medium placeholder:text-[#8b90a3]"
                  />

                  <div className="flex gap-2">
                    <Input
                      value={vm.presetInput}
                      onChange={(event) => {
                        vm.setPresetInput(event.target.value);
                        vm.setCreateError(null);
                      }}
                      onKeyDown={(event) => {
                        if (event.key === "Enter") {
                          event.preventDefault();
                          vm.pushPresetDraft();
                        }
                      }}
                      placeholder="프리셋 입력 후 Enter"
                      disabled={vm.isBusy}
                      className="h-10 rounded-[10px] border-[#e9ebf0] bg-white text-[14px] font-medium placeholder:text-[#8b90a3]"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className="h-10 rounded-[10px] border-[#d6d9e0] px-4 text-[13px] font-semibold text-[#6b6f80] hover:bg-[#fcfcfd] hover:text-[#5e6275]"
                      onClick={vm.pushPresetDraft}
                      disabled={vm.isBusy}
                    >
                      추가
                    </Button>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {vm.presetSnippets.map((snippet) => (
                      <Button
                        key={snippet.label}
                        type="button"
                        variant="outline"
                        className="h-8 rounded-[10px] border-[#d6d9e0] px-3 text-[12px] font-semibold text-[#6b6f80] hover:bg-[#fcfcfd] hover:text-[#5e6275]"
                        onClick={() => vm.applySnippet(snippet)}
                        disabled={vm.isBusy}
                      >
                        {snippet.label}
                      </Button>
                    ))}
                  </div>

                  <div className="flex min-h-[36px] flex-wrap gap-1.5 rounded-[12px] border border-[#eaecf2] bg-white p-2">
                    {vm.presetDrafts.length === 0 ? (
                      <span className="text-[13px] font-medium text-[#8b90a3]">
                        프리셋을 추가해주세요.
                      </span>
                    ) : (
                      vm.presetDrafts.map((preset) => (
                        <button
                          key={preset}
                          type="button"
                          className="inline-flex items-center gap-1 rounded-full border border-[#d6d9e0] bg-[#fcfcfd] px-2 py-0.5 text-[12px] font-medium text-[#6b6f80]"
                          onClick={() => vm.removePresetDraft(preset)}
                        >
                          {preset}
                          <X className="h-3 w-3" />
                        </button>
                      ))
                    )}
                  </div>

                  {vm.createError ? (
                    <p className="text-[13px] font-medium text-[#dc2626]">
                      {vm.createError}
                    </p>
                  ) : null}

                  <Button
                    type="button"
                    onClick={vm.handleCreateCategory}
                    disabled={
                      !vm.canCreateCategory ||
                      vm.duplicatedCategoryName ||
                      vm.isBusy
                    }
                    className="h-10 w-full gap-2 rounded-[10px] bg-[#3863f6] text-[13px] font-semibold text-white hover:bg-[#2f57e8]"
                  >
                    {vm.isCreatingCategory ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Plus className="h-4 w-4" />
                    )}
                    카테고리 생성
                  </Button>
                </div>

                <div className="space-y-2">
                  <p className="text-[16px] font-semibold tracking-[-0.16px] text-[#4a4d5c]">
                    등록된 카테고리 ({vm.categories.length})
                  </p>
                  {vm.isCategoryMutationBlocked ? (
                    <p className="text-[13px] font-medium text-amber-700">
                      임시 안내: BE ID validation 핫픽스 후 카테고리 수정/삭제가
                      활성화됩니다.
                    </p>
                  ) : null}
                  <div className="max-h-[200px] space-y-2 overflow-y-auto pr-1">
                    {vm.isFetchingCategories && vm.categories.length === 0 ? (
                      <div className="flex justify-center py-4">
                        <Loader2 className="h-5 w-5 animate-spin text-[#8b90a3]" />
                      </div>
                    ) : vm.categories.length === 0 ? (
                      <p className="rounded-[12px] border border-dashed border-[#d6d9e0] py-4 text-center text-[13px] font-medium text-[#8b90a3]">
                        등록된 카테고리가 없습니다.
                      </p>
                    ) : (
                      vm.categories.map((category) => (
                        <div
                          key={category.id}
                          className="flex flex-col gap-2 rounded-[12px] border border-[#eaecf2] bg-white p-2.5"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className="text-[14px] font-semibold text-[#4a4d5c]">
                                {category.name}
                              </p>
                              <p className="text-[13px] font-medium text-[#8b90a3]">
                                연결 과제{" "}
                                {vm.assignmentCountByCategory[category.id] ?? 0}
                                개
                              </p>
                            </div>
                            {vm.editingCategoryId !== category.id ? (
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    type="button"
                                    variant="outline"
                                    className="h-8 w-8 rounded-[10px] border-[#d6d9e0] p-0 text-[#6b6f80] hover:bg-[#fcfcfd] hover:text-[#5e6275]"
                                    disabled={
                                      vm.isBusy || vm.isCategoryMutationBlocked
                                    }
                                    aria-label="카테고리 관리 메뉴"
                                  >
                                    <MoreHorizontal className="h-3.5 w-3.5" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                  align="end"
                                  className="w-28"
                                >
                                  <DropdownMenuItem
                                    onClick={() =>
                                      vm.handleStartEditCategory(category)
                                    }
                                    disabled={
                                      vm.isBusy || vm.isCategoryMutationBlocked
                                    }
                                  >
                                    <Pencil className="mr-1 h-3.5 w-3.5" />
                                    수정
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    className="text-destructive"
                                    onClick={() =>
                                      void vm.handleClickDeleteCategory({
                                        id: category.id,
                                        name: category.name,
                                      })
                                    }
                                    disabled={
                                      vm.isBusy || vm.isCategoryMutationBlocked
                                    }
                                  >
                                    {vm.isDeletingCategory &&
                                    vm.deletingCategoryId === category.id ? (
                                      <Loader2 className="mr-1 h-3.5 w-3.5 animate-spin" />
                                    ) : (
                                      <Trash2 className="mr-1 h-3.5 w-3.5" />
                                    )}
                                    삭제
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            ) : null}
                          </div>

                          {vm.editingCategoryId === category.id ? (
                            <div className="space-y-2 rounded-[10px] border border-dashed border-[#d6d9e0] p-2.5">
                              <Input
                                value={vm.editingCategoryName}
                                onChange={(event) => {
                                  vm.setEditingCategoryName(event.target.value);
                                  vm.setEditingError(null);
                                }}
                                disabled={vm.isBusy}
                                className="h-9 rounded-[10px] border-[#e9ebf0] bg-white text-[13px] font-medium"
                              />

                              <div className="flex gap-1">
                                <Input
                                  value={vm.editingPresetInput}
                                  onChange={(event) => {
                                    vm.setEditingPresetInput(
                                      event.target.value
                                    );
                                    vm.setEditingError(null);
                                  }}
                                  onKeyDown={(event) => {
                                    if (event.key === "Enter") {
                                      event.preventDefault();
                                      vm.handlePushEditPreset();
                                    }
                                  }}
                                  placeholder="프리셋 입력 후 Enter"
                                  disabled={vm.isBusy}
                                  className="h-9 rounded-[10px] border-[#e9ebf0] bg-white text-[13px] font-medium placeholder:text-[#8b90a3]"
                                />
                                <Button
                                  type="button"
                                  variant="outline"
                                  className="h-9 rounded-[10px] border-[#d6d9e0] px-2 text-[12px] font-semibold text-[#6b6f80] hover:bg-[#fcfcfd] hover:text-[#5e6275]"
                                  onClick={vm.handlePushEditPreset}
                                  disabled={vm.isBusy}
                                >
                                  추가
                                </Button>
                              </div>

                              <div className="flex flex-wrap gap-1">
                                {vm.editingPresetDrafts.map((preset) => (
                                  <button
                                    key={`${category.id}-edit-${preset}`}
                                    type="button"
                                    className="inline-flex items-center gap-1 rounded-full border border-[#d6d9e0] bg-[#fcfcfd] px-2 py-0.5 text-[11px] font-medium text-[#6b6f80]"
                                    onClick={() =>
                                      vm.handleRemoveEditPreset(preset)
                                    }
                                  >
                                    {preset}
                                    <X className="h-3 w-3" />
                                  </button>
                                ))}
                              </div>

                              {vm.editingError ? (
                                <p className="text-[13px] font-medium text-[#dc2626]">
                                  {vm.editingError}
                                </p>
                              ) : null}

                              <div className="flex justify-end gap-1">
                                <Button
                                  type="button"
                                  variant="outline"
                                  className="h-9 rounded-[10px] border-[#d6d9e0] px-3 text-[13px] font-semibold text-[#6b6f80] hover:bg-[#fcfcfd] hover:text-[#5e6275]"
                                  onClick={vm.handleCancelEditCategory}
                                  disabled={vm.isBusy}
                                >
                                  취소
                                </Button>
                                <Button
                                  type="button"
                                  className="h-9 rounded-[10px] bg-[#3863f6] px-3 text-[13px] font-semibold text-white hover:bg-[#2f57e8]"
                                  onClick={() =>
                                    void vm.handleSubmitEditCategory()
                                  }
                                  disabled={vm.isBusy}
                                >
                                  {vm.isUpdatingCategory ? (
                                    <Loader2 className="h-3 w-3 animate-spin" />
                                  ) : null}
                                  수정 저장
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex flex-wrap gap-1">
                              {category.presets.map((preset) => (
                                <span
                                  key={`${category.id}-${preset}`}
                                  className="rounded-full border border-[#d6d9e0] bg-[#fcfcfd] px-2 py-0.5 text-[11px] font-medium text-[#8b90a3]"
                                >
                                  {preset}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </>
            ) : null}
          </div>

          <div className="space-y-4 lg:order-1">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="space-y-1">
                <h3 className="text-[18px] font-semibold tracking-[-0.18px] text-[#4a4d5c]">
                  시험에 과제 추가 (과제 단위)
                </h3>
              </div>
              <div className="flex flex-wrap items-center gap-1.5">
                <Button
                  type="button"
                  variant="outline"
                  className="h-9 rounded-[10px] border-[#d6d9e0] px-3 text-[13px] font-semibold text-[#6b6f80] hover:bg-[#fcfcfd] hover:text-[#5e6275]"
                  onClick={() => vm.setIsTargetSelectorOpen((prev) => !prev)}
                  disabled={!vm.effectiveExamId || vm.isBusy}
                >
                  {vm.isTargetSelectorOpen ? "대상 선택 닫기" : "대상 변경"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className={cn(
                    "h-9 rounded-[10px] px-3 text-[13px] font-semibold",
                    vm.showIncludedOnly
                      ? "border-[#3863f6] bg-[#3863f6] text-white hover:bg-[#2f57e8] hover:text-white"
                      : "border-[#d6d9e0] bg-white text-[#6b6f80] hover:bg-[#fcfcfd] hover:text-[#5e6275]"
                  )}
                  onClick={() => vm.setShowIncludedOnly((prev) => !prev)}
                  disabled={
                    !vm.effectiveExamId ||
                    vm.isBusy ||
                    vm.availableAssignments.length === 0
                  }
                >
                  {vm.showIncludedOnly ? "전체 보기" : "포함 항목만"}
                </Button>
              </div>
            </div>

            {vm.isTargetSelectorOpen ? (
              <div className="grid gap-3 rounded-[14px] border border-[#eaecf2] bg-[#fcfcfd] p-3 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <span className="text-[13px] font-semibold text-[#8b90a3]">
                    클래스 선택
                  </span>
                  <Select
                    value={vm.classSelectValue}
                    onValueChange={vm.setSelectedClassKey}
                    disabled={vm.isBusy || vm.filteredClassOptions.length === 0}
                  >
                    <SelectTrigger className="h-10 rounded-[10px] border-[#e9ebf0] bg-white text-[14px] font-medium">
                      <SelectValue placeholder="클래스 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      {vm.filteredClassOptions.map((option) => (
                        <SelectItem
                          key={option.key}
                          value={option.key}
                          className="text-sm"
                        >
                          {option.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <span className="text-[13px] font-semibold text-[#8b90a3]">
                    시험 선택
                  </span>
                  <Select
                    value={vm.examSelectValue}
                    onValueChange={vm.setModalSelectedExamId}
                    disabled={
                      vm.isBusy || vm.filteredExamsInSelectedClass.length === 0
                    }
                  >
                    <SelectTrigger className="h-10 rounded-[10px] border-[#e9ebf0] bg-white text-[14px] font-medium">
                      <SelectValue placeholder="시험 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      {vm.filteredExamsInSelectedClass.map((exam) => (
                        <SelectItem
                          key={exam.id}
                          value={exam.id}
                          className="text-sm"
                        >
                          {exam.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            ) : null}

            <div
              className={cn(
                "rounded-[14px] border border-[#eaecf2] bg-[#fcfcfd] p-3",
                vm.isModalTargetMismatch
                  ? "border-amber-300/60 bg-amber-50/60 ring-1 ring-amber-500/40"
                  : ""
              )}
            >
              <div className="flex flex-wrap items-center justify-between gap-2 text-[13px]">
                <div className="flex flex-wrap gap-3">
                  <span className="font-medium text-[#8b90a3]">
                    현재 적용 대상:
                  </span>
                  <span className="font-medium text-[#8b90a3]">
                    클래스:{" "}
                    <span className="font-semibold text-[#4a4d5c]">
                      {vm.modalSelectedExam?.lectureName ?? "-"}
                    </span>
                  </span>
                  <span className="font-medium text-[#8b90a3]">
                    시험:{" "}
                    <span className="font-semibold text-[#4a4d5c]">
                      {vm.modalSelectedExam?.name ?? "-"}
                    </span>
                  </span>
                </div>
                <span className="font-semibold text-[#3863f6]">
                  과제 {vm.availableAssignments.length}개 중 포함{" "}
                  {vm.includedAssignmentIds.length}개
                </span>
              </div>
              {vm.isModalTargetMismatch ? (
                <p className="mt-2 text-[13px] font-medium text-amber-700">
                  주의: 현재 페이지 선택 시험(
                  {vm.selectedExamMeta?.examName ?? "미선택"})과 모달 적용 시험(
                  {vm.modalSelectedExam?.name ?? "미선택"})이 다릅니다.
                </p>
              ) : null}
              {vm.includeLimitReached ? (
                <p className="mt-1 text-[13px] font-medium text-amber-700">
                  현재 시험은 포함 가능한 과제 최대 개수(
                  {MAX_INCLUDED_ASSIGNMENTS}
                  개)에 도달했습니다.
                </p>
              ) : null}
            </div>

            <div className="space-y-2 rounded-[14px] border border-dashed border-[#d6d9e0] bg-[#fcfcfd] p-3">
              <div className="flex items-center justify-between gap-2">
                <p className="text-[14px] font-semibold text-[#4a4d5c]">
                  새 과제 만들기 + 현재 시험 포함
                </p>
                {!vm.canCreateAssignmentForSelectedExam ? (
                  <span className="text-[12px] font-medium text-amber-700">
                    강의가 연결된 시험에서만 생성 가능
                  </span>
                ) : null}
              </div>

              <Input
                value={vm.assignmentTitle}
                onChange={(event) => {
                  vm.setAssignmentTitle(event.target.value);
                }}
                placeholder="과제명 (예: 단어 1회차)"
                disabled={vm.isBusy}
                className="h-10 rounded-[10px] border-[#e9ebf0] bg-white text-[14px] font-medium placeholder:text-[#8b90a3]"
              />

              <div className="grid gap-2 sm:grid-cols-[1fr_auto]">
                <Select
                  value={vm.assignmentCategoryId || undefined}
                  onValueChange={vm.setAssignmentCategoryId}
                  disabled={vm.isBusy || vm.categories.length === 0}
                >
                  <SelectTrigger className="h-10 rounded-[10px] border-[#e9ebf0] bg-white text-[14px] font-medium">
                    <SelectValue placeholder="카테고리 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    {vm.categories.map((category) => (
                      <SelectItem
                        key={`assignment-category-${category.id}`}
                        value={category.id}
                        className="text-sm"
                      >
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  type="button"
                  onClick={() => void vm.handleCreateAssignment()}
                  disabled={
                    !vm.canCreateAssignment ||
                    !vm.canCreateAssignmentForSelectedExam ||
                    vm.isBusy
                  }
                  className="h-10 gap-1.5 rounded-[10px] bg-[#3863f6] px-3 text-[13px] font-semibold text-white hover:bg-[#2f57e8]"
                >
                  {vm.isCreatingAssignment ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Plus className="h-3.5 w-3.5" />
                  )}
                  만들기
                </Button>
              </div>

              {vm.createAssignmentError ? (
                <p className="text-[13px] font-medium text-[#dc2626]">
                  {vm.createAssignmentError}
                </p>
              ) : null}
            </div>

            <div className="space-y-1.5">
              <span className="text-[13px] font-semibold text-[#8b90a3]">
                포함 과제 검색
              </span>
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#b0b4c2]" />
                <Input
                  value={vm.assignmentSearchQuery}
                  onChange={(event) =>
                    vm.setAssignmentSearchQuery(event.target.value)
                  }
                  placeholder="과제명/카테고리 검색"
                  className="h-10 rounded-[10px] border-[#e9ebf0] bg-white pl-9 text-[14px] font-medium placeholder:text-[#8b90a3]"
                  disabled={vm.isBusy || vm.visibleAssignments.length === 0}
                />
              </div>
              {vm.canSuggestCreateFromSearch ? (
                <Button
                  type="button"
                  variant="outline"
                  className="h-9 rounded-[10px] border-[#d6d9e0] px-3 text-[13px] font-semibold text-[#6b6f80] hover:bg-[#fcfcfd] hover:text-[#5e6275]"
                  onClick={vm.handlePrefillAssignmentTitleFromSearch}
                  disabled={vm.isBusy}
                >
                  &quot;{vm.assignmentSearchQuery.trim()}&quot; 새 과제 만들기
                </Button>
              ) : null}
            </div>

            <div className="max-h-[300px] space-y-2 overflow-y-auto pr-1">
              {vm.filteredVisibleAssignments.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-[14px] border border-dashed border-[#d6d9e0] bg-[#fcfcfd] py-8">
                  <p className="text-[13px] font-medium text-[#8b90a3]">
                    {vm.normalizedAssignmentSearchQuery
                      ? "검색 결과가 없습니다. 다른 검색어를 시도해주세요."
                      : vm.showIncludedOnly
                        ? "포함된 과제가 없습니다."
                        : "표시할 과제가 없습니다. 이 클래스에 과제가 없거나 카테고리에 연결된 과제가 없습니다."}
                  </p>
                  {!vm.showIncludedOnly &&
                  !vm.normalizedAssignmentSearchQuery ? (
                    <div className="mt-2 flex flex-col items-center gap-2">
                      <p className="text-[13px] font-medium text-[#8b90a3]">
                        카테고리 생성 후, 해당 카테고리의 과제를 먼저 생성하면
                        포함 목록에 표시됩니다.
                      </p>
                      <Button
                        type="button"
                        variant="outline"
                        className="h-9 rounded-[10px] border-[#d6d9e0] px-3 text-[13px] font-semibold text-[#6b6f80] hover:bg-[#fcfcfd] hover:text-[#5e6275]"
                        onClick={() =>
                          void vm.handleOpenAssignmentCreationGuide()
                        }
                      >
                        과제 생성 안내
                      </Button>
                    </div>
                  ) : null}
                </div>
              ) : (
                vm.filteredVisibleAssignments.map((assignment) => {
                  const included = vm.includedAssignmentIds.includes(
                    assignment.id
                  );
                  return (
                    <div
                      key={assignment.id}
                      className="flex flex-col gap-2 rounded-[12px] border border-[#eaecf2] bg-white p-3 transition-colors hover:bg-[#fcfcfd] sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="space-y-0.5">
                        <p className="text-[14px] font-semibold text-[#4a4d5c]">
                          {assignment.title}
                        </p>
                        <p className="text-[13px] font-medium text-[#8b90a3]">
                          {assignment.categoryName}
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {assignment.presets.map((p) => (
                            <span
                              key={`${assignment.id}-${p}`}
                              className="rounded bg-[#f4f6fa] px-1.5 py-0.5 text-[11px] font-medium text-[#8b90a3]"
                            >
                              {p}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          className={cn(
                            "h-9 min-w-[96px] rounded-[10px] px-3 text-[13px] font-semibold",
                            included
                              ? "border-[#3863f6] bg-[#3863f6] text-white hover:bg-[#2f57e8]"
                              : "border-[#d6d9e0] bg-white text-[#6b6f80] hover:bg-[#fcfcfd] hover:text-[#5e6275]"
                          )}
                          variant="outline"
                          onClick={() =>
                            vm.toggleIncludedAssignment(assignment.id)
                          }
                          disabled={
                            !vm.effectiveExamId ||
                            vm.isBusy ||
                            (!included && vm.includeLimitReached)
                          }
                          title={
                            !included && vm.includeLimitReached
                              ? `시험당 최대 ${MAX_INCLUDED_ASSIGNMENTS}개까지만 포함할 수 있습니다.`
                              : undefined
                          }
                        >
                          {included ? (
                            <span className="flex items-center gap-1">
                              <X className="h-3 w-3" /> 제외하기
                            </span>
                          ) : (
                            <span className="flex items-center gap-1">
                              <Check className="h-3 w-3" /> 포함하기
                            </span>
                          )}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          className="h-9 w-9 rounded-[10px] border-[#d6d9e0] p-0 text-[#ef4444] hover:bg-[#fff1f2] hover:text-[#dc2626]"
                          onClick={() =>
                            void vm.handleDeleteAssignment({
                              assignmentId: assignment.id,
                              assignmentTitle: assignment.title,
                            })
                          }
                          disabled={vm.isBusy}
                          aria-label={`${assignment.title} 과제 삭제`}
                          title="과제 삭제"
                        >
                          {vm.isDeletingAssignment &&
                          vm.deletingAssignmentId === assignment.id ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            <Trash2 className="h-3 w-3" />
                          )}
                        </Button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        <DialogFooter className="flex flex-wrap items-center justify-end gap-2 border-t border-[#eaecf2] pt-4">
          <p className="mr-auto w-full text-[13px] font-medium text-[#8b90a3] sm:w-auto">
            {vm.hasPendingChanges
              ? `포함 변경 ${vm.pendingAssignmentDeltaCount}건이 아직 저장되지 않았습니다.`
              : ""}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="h-9 rounded-[10px] border-[#d6d9e0] px-3 text-[13px] font-semibold text-[#6b6f80] hover:bg-[#fcfcfd] hover:text-[#5e6275]"
              onClick={() => vm.handleModalOpenChange(false)}
            >
              취소
            </Button>
            <Button
              onClick={() => void vm.handleQuickSaveModal()}
              disabled={vm.isBusy || !vm.hasPendingChanges}
              className="h-9 rounded-[10px] bg-[#3863f6] px-6 text-[13px] font-semibold text-white hover:bg-[#2f57e8]"
            >
              {vm.isSavingAssignments ? (
                <Loader2 className="mr-2 h-3 w-3 animate-spin" />
              ) : null}
              저장
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
