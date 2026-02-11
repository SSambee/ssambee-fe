"use client";

import { memo } from "react";
import { Check, Pencil, Trash2, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>분류 관리</DialogTitle>
        </DialogHeader>

        <div className="space-y-5">
          <div className="space-y-3 rounded-lg border border-dashed border-neutral-300 p-4">
            <div>
              <p className="text-sm font-semibold text-foreground">
                새 분류 추가
              </p>
              <p className="text-xs text-muted-foreground">
                이름과 색상을 입력해 바로 등록할 수 있습니다.
              </p>
            </div>
            <div className="grid gap-3 md:grid-cols-[1fr_auto]">
              <Input
                value={categoryCreateState.name}
                onChange={(event) =>
                  onCategoryCreateStateChange((prev) => ({
                    ...prev,
                    name: event.target.value,
                  }))
                }
                placeholder="예: 과제 제출"
                disabled={isCategoryActionLocked}
                className="h-10"
              />
              <div className="flex items-center gap-2">
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
                  className="h-9 w-9 cursor-pointer overflow-hidden rounded-full border p-0 [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:rounded-full [&::-webkit-color-swatch]:border-0 [&::-moz-color-swatch]:border-0"
                />
                <Button
                  type="button"
                  className="h-9 px-3 text-xs"
                  onClick={onCreateCategory}
                  disabled={isCategoryActionLocked}
                >
                  {isCategoryCreating ? "추가 중..." : "분류 추가"}
                </Button>
              </div>
            </div>
            {categoryCreateError ? (
              <p className="text-xs text-destructive">{categoryCreateError}</p>
            ) : null}
          </div>

          <div className="space-y-3">
            <div>
              <p className="text-sm font-semibold text-foreground">
                기존 분류 수정
              </p>
              <p className="text-xs text-muted-foreground">
                분류 이름/색상을 수정할 수 있습니다. (기타 분류 제외)
              </p>
            </div>

            <div className="space-y-2">
              {categories.map((category) => {
                const isEditing = editingCategoryId === category.id;
                const isReadonlyCategory = category.id === "other";
                const isDeleting = deletingCategoryId === category.id;

                return (
                  <div
                    key={category.id}
                    className="space-y-2 rounded-md border border-neutral-200 p-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2 text-sm font-medium text-foreground">
                        <span
                          className="h-2 w-2 rounded-full"
                          style={{ backgroundColor: category.color }}
                        />
                        {category.name}
                      </span>

                      {isReadonlyCategory ? (
                        <span className="text-xs text-muted-foreground">
                          고정 분류
                        </span>
                      ) : isEditing ? (
                        <div className="flex items-center gap-1">
                          <Button
                            type="button"
                            variant="outline"
                            size="default"
                            className="h-7 w-7 p-0"
                            onClick={onCancelCategoryEdit}
                            disabled={isCategoryActionLocked}
                            aria-label="분류 수정 취소"
                          >
                            <X className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="default"
                            className="h-7 w-7 p-0"
                            onClick={onUpdateCategory}
                            disabled={isCategoryActionLocked}
                            aria-label="분류 수정 저장"
                          >
                            <Check className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1">
                          <Button
                            type="button"
                            variant="outline"
                            size="default"
                            className="h-7 w-7 p-0"
                            onClick={() => onStartCategoryEdit(category)}
                            disabled={isCategoryActionLocked}
                            aria-label={`${category.name} 분류 수정`}
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="default"
                            className="h-7 w-7 p-0 text-destructive"
                            onClick={() => onDeleteCategory(category.id)}
                            disabled={isCategoryActionLocked}
                            aria-label={`${category.name} 분류 삭제`}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      )}
                    </div>

                    {isDeleting ? (
                      <p className="text-xs text-muted-foreground">
                        삭제 중...
                      </p>
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
                          className="h-9"
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
                            className="h-8 w-8 cursor-pointer overflow-hidden rounded-full border p-0 [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:rounded-full [&::-webkit-color-swatch]:border-0 [&::-moz-color-swatch]:border-0"
                          />
                        </div>
                        {categoryUpdateError ? (
                          <p className="text-xs text-destructive">
                            {categoryUpdateError}
                          </p>
                        ) : null}
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isCategoryActionLocked}
          >
            닫기
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export const ScheduleCategoryManageModal = memo(
  ScheduleCategoryManageModalComponent
);
ScheduleCategoryManageModal.displayName = "ScheduleCategoryManageModal";
