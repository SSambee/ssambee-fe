"use client";

import { memo } from "react";
import { Check, Pencil, Plus, Trash2, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type {
  ScheduleCategoryCreateState,
  ScheduleCategoryEditState,
  ScheduleCategoryOption,
} from "@/types/schedules";

type ScheduleCategoryManageModalProps = {
  open: boolean;
  categories: ScheduleCategoryOption[];
  isCategoryCreating: boolean;
  isCategoryUpdating: boolean;
  categoryCreateState: ScheduleCategoryCreateState;
  onCategoryCreateStateChange: (
    updater:
      | ScheduleCategoryCreateState
      | ((prev: ScheduleCategoryCreateState) => ScheduleCategoryCreateState)
  ) => void;
  categoryCreateError: string | null;
  onCreateCategory: () => void;
  deletingCategoryId: string | null;
  editingCategoryId: string | null;
  categoryEditState: ScheduleCategoryEditState;
  onCategoryEditStateChange: (
    updater:
      | ScheduleCategoryEditState
      | ((prev: ScheduleCategoryEditState) => ScheduleCategoryEditState)
  ) => void;
  categoryUpdateError: string | null;
  onStartCategoryEdit: (category: ScheduleCategoryOption) => void;
  onCancelCategoryEdit: () => void;
  onUpdateCategory: () => void;
  onDeleteCategory: (categoryId: string) => void;
  onOpenChange: (open: boolean) => void;
};

function ScheduleCategoryManageModalComponent({
  open,
  categories,
  isCategoryCreating,
  isCategoryUpdating,
  categoryCreateState,
  onCategoryCreateStateChange,
  categoryCreateError,
  onCreateCategory,
  deletingCategoryId,
  editingCategoryId,
  categoryEditState,
  onCategoryEditStateChange,
  categoryUpdateError,
  onStartCategoryEdit,
  onCancelCategoryEdit,
  onUpdateCategory,
  onDeleteCategory,
  onOpenChange,
}: ScheduleCategoryManageModalProps) {
  const isCategoryActionLocked =
    isCategoryCreating || isCategoryUpdating || deletingCategoryId !== null;

  const fieldLabelClass =
    "text-[16px] font-semibold leading-6 tracking-[-0.16px] text-[rgba(22,22,27,0.88)]";
  const fieldSubLabelClass =
    "text-[15px] font-medium leading-6 tracking-[-0.15px] text-[rgba(22,22,27,0.4)]";
  const fieldInputClass =
    "h-12 rounded-[12px] border-[#d6d9e0] bg-white px-4 text-[15px] font-medium leading-6 tracking-[-0.15px] text-[#2b2e3a] shadow-none placeholder:text-[#8b90a3] focus-visible:ring-0 md:text-[15px]";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showClose={false}
        className="w-[calc(100vw-32px)] max-h-[86vh] max-w-[610px] gap-5 overflow-y-auto border-none bg-white p-5 shadow-[0_0_14px_rgba(138,138,138,0.16)] sm:gap-6 sm:rounded-[24px] sm:p-6"
      >
        <DialogHeader className="flex-col items-stretch gap-3 space-y-0 sm:flex-row sm:items-center sm:justify-between sm:gap-0">
          <DialogTitle className="text-[22px] font-bold leading-8 tracking-[-0.24px] text-[#040405]">
            분류 관리
          </DialogTitle>
          <Button
            type="button"
            className="h-11 w-full rounded-[12px] bg-[#3863f6] px-6 text-[14px] font-semibold leading-5 tracking-[-0.14px] text-white shadow-[0_0_14px_rgba(138,138,138,0.08)] hover:bg-[#2f57e8] sm:w-auto"
            onClick={() => onOpenChange(false)}
            disabled={isCategoryActionLocked}
          >
            완료
          </Button>
        </DialogHeader>

        <div className="space-y-5">
          <section className="space-y-5 rounded-[20px] border border-[#e9ebf0] bg-[#f7f8fa] p-4 sm:p-5">
            <div className="space-y-[6px]">
              <p className={fieldLabelClass}>새 분류 추가</p>
              <p className={fieldSubLabelClass}>
                이름과 색상을 입력해 바로 등록할 수 있어요
              </p>
            </div>

            <div className="grid gap-2.5 lg:grid-cols-[1fr_auto]">
              <Input
                value={categoryCreateState.name}
                onChange={(event) =>
                  onCategoryCreateStateChange((prev) => ({
                    ...prev,
                    name: event.target.value,
                  }))
                }
                placeholder="분류 명칭을 입력해주세요"
                disabled={isCategoryActionLocked}
                className={fieldInputClass}
              />

              <div className="flex flex-wrap items-center justify-end gap-2">
                <Input
                  type="color"
                  value={categoryCreateState.color}
                  onChange={(event) =>
                    onCategoryCreateStateChange((prev) => ({
                      ...prev,
                      color: event.target.value,
                    }))
                  }
                  disabled={isCategoryActionLocked}
                  aria-label="새 분류 색상"
                  className="h-9 w-9 cursor-pointer overflow-hidden rounded-full border border-[#d6d9e0] bg-white p-0 [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:rounded-full [&::-webkit-color-swatch]:border-0 [&::-moz-color-swatch]:border-0"
                />
                <Button
                  type="button"
                  variant="outline"
                  className="h-12 w-full rounded-[12px] border-[#d6d9e0] bg-white px-4 text-[15px] font-semibold leading-6 tracking-[-0.15px] text-[#6b6f80] shadow-none hover:bg-[#eef2ff] sm:w-[128px]"
                  onClick={onCreateCategory}
                  disabled={isCategoryActionLocked}
                >
                  <Plus className="h-4 w-4" />
                  {isCategoryCreating ? "추가 중..." : "분류 추가"}
                </Button>
              </div>
            </div>

            {categoryCreateError ? (
              <p className="text-xs text-destructive">{categoryCreateError}</p>
            ) : null}
          </section>

          <section className="space-y-5 rounded-[20px] border border-[#e9ebf0] bg-[#f7f8fa] p-4 sm:p-5">
            <div className="space-y-[6px]">
              <p className={fieldLabelClass}>기존 분류 수정</p>
              <p className={fieldSubLabelClass}>
                분류 이름 및 색상을 수정할 수 있어요 (기타 분류 제외)
              </p>
            </div>

            <div className="space-y-3">
              {categories.map((category) => {
                const isEditing = editingCategoryId === category.id;
                const isReadonlyCategory = category.id === "other";
                const isDeleting = deletingCategoryId === category.id;

                return (
                  <div
                    key={category.id}
                    className="space-y-2.5 rounded-[14px] border border-[#e9ebf0] bg-[#fcfcfd] px-4 py-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-3">
                        <span
                          className="h-3.5 w-3.5 rounded-full"
                          style={{ backgroundColor: category.color }}
                        />
                        <span className="text-[16px] font-semibold leading-6 tracking-[-0.16px] text-[#4a4d5c]">
                          {category.name}
                        </span>
                      </span>

                      {isReadonlyCategory ? (
                        <span className="text-[15px] font-medium leading-6 tracking-[-0.15px] text-[rgba(22,22,27,0.4)]">
                          고정 분류
                        </span>
                      ) : isEditing ? (
                        <div className="flex items-center gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="default"
                            className="h-10 w-10 rounded-[10px] border-[#e1e7fe] bg-white p-0 text-[#6b6f80] shadow-none hover:bg-[#eef2ff]"
                            onClick={onCancelCategoryEdit}
                            disabled={isCategoryActionLocked}
                            aria-label="분류 수정 취소"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="default"
                            className="h-10 w-10 rounded-[10px] border-[#e1e7fe] bg-white p-0 text-[#6b6f80] shadow-none hover:bg-[#eef2ff]"
                            onClick={onUpdateCategory}
                            disabled={isCategoryActionLocked}
                            aria-label="분류 수정 저장"
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="default"
                            className="h-10 w-10 rounded-[10px] border-[#e1e7fe] bg-white p-0 text-[#6b6f80] shadow-none hover:bg-[#eef2ff]"
                            onClick={() => onStartCategoryEdit(category)}
                            disabled={isCategoryActionLocked}
                            aria-label={`${category.name} 분류 수정`}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="default"
                            className="h-10 w-10 rounded-[10px] border-[#e1e7fe] bg-white p-0 text-[#6b6f80] shadow-none hover:bg-[#eef2ff]"
                            onClick={() => onDeleteCategory(category.id)}
                            disabled={isCategoryActionLocked}
                            aria-label={`${category.name} 분류 삭제`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>

                    {isDeleting ? (
                      <p className="text-xs text-neutral-400">삭제 중...</p>
                    ) : null}

                    {isEditing ? (
                      <div className="space-y-2">
                        <Label
                          htmlFor={`category-name-${category.id}`}
                          className="sr-only"
                        >
                          분류 이름
                        </Label>
                        <Input
                          id={`category-name-${category.id}`}
                          value={categoryEditState.name}
                          onChange={(event) =>
                            onCategoryEditStateChange((prev) => ({
                              ...prev,
                              name: event.target.value,
                            }))
                          }
                          disabled={isCategoryActionLocked}
                          className={fieldInputClass}
                        />
                        <div className="flex items-center gap-2">
                          <Input
                            type="color"
                            value={categoryEditState.color}
                            onChange={(event) =>
                              onCategoryEditStateChange((prev) => ({
                                ...prev,
                                color: event.target.value,
                              }))
                            }
                            disabled={isCategoryActionLocked}
                            aria-label={`${category.name} 분류 색상`}
                            className="h-9 w-9 cursor-pointer overflow-hidden rounded-full border border-[#d6d9e0] bg-white p-0 [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:rounded-full [&::-webkit-color-swatch]:border-0 [&::-moz-color-swatch]:border-0"
                          />
                        </div>
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>

            {categoryUpdateError ? (
              <p className="text-xs text-destructive">{categoryUpdateError}</p>
            ) : null}
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export const ScheduleCategoryManageModal = memo(
  ScheduleCategoryManageModalComponent
);
ScheduleCategoryManageModal.displayName = "ScheduleCategoryManageModal";
