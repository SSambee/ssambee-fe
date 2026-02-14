import { Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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

export type ResourceLibraryModalItem = {
  id: string;
  title: string;
  meta: string;
};

type ResourceLibraryModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  searchKeyword: string;
  onChangeSearchKeyword: (keyword: string) => void;
  searchPlaceholder?: string;
  categoryFilter?: string;
  categoryOptions?: readonly string[];
  onChangeCategoryFilter?: (category: string) => void;
  items: ResourceLibraryModalItem[];
  isLoading: boolean;
  loadingText?: string;
  errorMessage: string | null;
  emptyText?: string;
  selectedIds: string[];
  onToggleSelection: (resourceId: string) => void;
  onCancel: () => void;
  onApply: () => void;
  cancelLabel?: string;
  applyLabel?: (selectedCount: number) => string;
  applyDisabled?: boolean;
};

export default function ResourceLibraryModal({
  open,
  onOpenChange,
  title = "자료실 검색 및 첨부 선택",
  description = "필요한 자료를 검색해 선택한 뒤 업무 지시에 첨부합니다.",
  searchKeyword,
  onChangeSearchKeyword,
  searchPlaceholder = "자료명 또는 분류로 검색",
  categoryFilter,
  categoryOptions,
  onChangeCategoryFilter,
  items,
  isLoading,
  loadingText = "자료실 데이터를 불러오는 중입니다.",
  errorMessage,
  emptyText = "검색 조건에 맞는 자료가 없습니다.",
  selectedIds,
  onToggleSelection,
  onCancel,
  onApply,
  cancelLabel = "취소",
  applyLabel = (selectedCount) => `선택 자료 첨부 (${selectedCount})`,
  applyDisabled,
}: ResourceLibraryModalProps) {
  const shouldShowCategoryFilter =
    typeof categoryFilter === "string" &&
    Array.isArray(categoryOptions) &&
    categoryOptions.length > 0 &&
    typeof onChangeCategoryFilter === "function";
  const isApplyDisabled =
    typeof applyDisabled === "boolean"
      ? applyDisabled
      : isLoading || Boolean(errorMessage);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
        <DialogHeader className="text-left">
          <DialogTitle className="text-xl font-bold">{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        {shouldShowCategoryFilter ? (
          <div className="grid gap-3 md:grid-cols-[1fr_180px]">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={searchKeyword}
                onChange={(event) => onChangeSearchKeyword(event.target.value)}
                placeholder={searchPlaceholder}
                className="pl-9"
              />
            </div>

            <Select
              value={categoryFilter}
              onValueChange={onChangeCategoryFilter}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categoryOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ) : (
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchKeyword}
              onChange={(event) => onChangeSearchKeyword(event.target.value)}
              placeholder={searchPlaceholder}
              className="pl-9"
            />
          </div>
        )}

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>
            {isLoading ? "검색 결과 로딩 중..." : `검색 결과 ${items.length}건`}
          </span>
          <span>선택 {selectedIds.length}건</span>
        </div>

        <div className="space-y-2 rounded-lg border bg-background p-2">
          {isLoading ? (
            <div className="rounded-md px-4 py-10 text-center text-sm text-muted-foreground">
              {loadingText}
            </div>
          ) : errorMessage ? (
            <div className="rounded-md px-4 py-10 text-center text-sm text-destructive">
              {errorMessage}
            </div>
          ) : items.length === 0 ? (
            <div className="rounded-md px-4 py-10 text-center text-sm text-muted-foreground">
              {emptyText}
            </div>
          ) : (
            items.map((item) => {
              const checked = selectedIds.includes(item.id);

              return (
                <div
                  key={item.id}
                  role="button"
                  tabIndex={0}
                  aria-pressed={checked}
                  className={`flex w-full items-start gap-3 rounded-md border px-4 py-3 text-left transition ${
                    checked
                      ? "border-primary/60 bg-primary/5"
                      : "border-transparent hover:border-muted"
                  }`}
                  onClick={() => onToggleSelection(item.id)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      onToggleSelection(item.id);
                    }
                  }}
                >
                  <Checkbox
                    checked={checked}
                    className="pointer-events-none mt-0.5"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{item.title}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {item.meta}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button
            type="button"
            variant="outline"
            className="rounded-full"
            onClick={onCancel}
          >
            {cancelLabel}
          </Button>
          <Button
            type="button"
            className="rounded-full"
            onClick={onApply}
            disabled={isApplyDisabled}
          >
            {applyLabel(selectedIds.length)}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
