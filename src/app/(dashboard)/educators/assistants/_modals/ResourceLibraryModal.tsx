import { Search } from "lucide-react";

import {
  type ResourceLibraryItem,
  type ResourceLibraryCategory,
} from "@/types/assistants";
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

type ResourceLibraryModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  resourceSearchKeyword: string;
  onChangeResourceSearchKeyword: (keyword: string) => void;
  resourceCategoryFilter: "전체" | ResourceLibraryCategory;
  resourceCategoryOptions: readonly [
    "전체",
    "수업자료",
    "평가자료",
    "운영문서",
  ];
  onChangeResourceCategoryFilter: (
    category: "전체" | ResourceLibraryCategory
  ) => void;
  filteredResourceLibraryItems: ResourceLibraryItem[];
  libraryDraftResourceIds: string[];
  onToggleDraftResourceSelection: (resourceId: string) => void;
  onCancel: () => void;
  onApply: () => void;
};

export default function ResourceLibraryModal({
  open,
  onOpenChange,
  resourceSearchKeyword,
  onChangeResourceSearchKeyword,
  resourceCategoryFilter,
  resourceCategoryOptions,
  onChangeResourceCategoryFilter,
  filteredResourceLibraryItems,
  libraryDraftResourceIds,
  onToggleDraftResourceSelection,
  onCancel,
  onApply,
}: ResourceLibraryModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
        <DialogHeader className="text-left">
          <DialogTitle className="text-xl font-bold">
            자료실 검색 및 첨부 선택
          </DialogTitle>
          <DialogDescription>
            필요한 자료를 검색해 선택한 뒤 업무 지시에 첨부합니다.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-3 md:grid-cols-[1fr_180px]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={resourceSearchKeyword}
              onChange={(event) =>
                onChangeResourceSearchKeyword(event.target.value)
              }
              placeholder="자료명 또는 분류로 검색"
              className="pl-9"
            />
          </div>
          <Select
            value={resourceCategoryFilter}
            onValueChange={onChangeResourceCategoryFilter}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {resourceCategoryOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>검색 결과 {filteredResourceLibraryItems.length}건</span>
          <span>선택 {libraryDraftResourceIds.length}건</span>
        </div>

        <div className="space-y-2 rounded-lg border bg-background p-2">
          {filteredResourceLibraryItems.length === 0 ? (
            <div className="rounded-md px-4 py-10 text-center text-sm text-muted-foreground">
              검색 조건에 맞는 자료가 없습니다.
            </div>
          ) : (
            filteredResourceLibraryItems.map((resource) => {
              const checked = libraryDraftResourceIds.includes(resource.id);
              return (
                <div
                  key={resource.id}
                  role="button"
                  tabIndex={0}
                  aria-pressed={checked}
                  className={`flex w-full items-start gap-3 rounded-md border px-4 py-3 text-left transition ${
                    checked
                      ? "border-primary/60 bg-primary/5"
                      : "border-transparent hover:border-muted"
                  }`}
                  onClick={() => onToggleDraftResourceSelection(resource.id)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      onToggleDraftResourceSelection(resource.id);
                    }
                  }}
                >
                  <Checkbox
                    checked={checked}
                    className="pointer-events-none mt-0.5"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{resource.title}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {resource.category} · {resource.updatedAt} ·{" "}
                      {resource.sizeLabel}
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
            취소
          </Button>
          <Button type="button" className="rounded-full" onClick={onApply}>
            선택 자료 첨부 ({libraryDraftResourceIds.length})
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
