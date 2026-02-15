"use client";

import { Search } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useModal } from "@/providers/ModalProvider";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useDebounce } from "@/hooks/useDebounce";
import { useMaterials } from "@/hooks/useMaterials";
import { Materials, MaterialsType } from "@/types/materials.type";

type AddResourceModalProps = {
  initialSelected: Materials[];
  onChange: (materials: Materials[]) => void;
};

export default function AddResourceModal({
  initialSelected = [],
  onChange,
}: AddResourceModalProps) {
  const { isOpen, closeModal } = useModal();
  const [searchKeyword, setSearchKeyword] = useState("");
  const debouncedSearch = useDebounce(searchKeyword, 500);
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [tempSelected, setTempSelected] =
    useState<Materials[]>(initialSelected);

  // 자료실 목록 조회
  const { materialsQuery } = useMaterials({
    page: 1,
    limit: 50,
    type: categoryFilter as MaterialsType,
    sort: "latest",
    search: debouncedSearch || undefined,
  });
  const { data: attachmentsData, isLoading, error } = materialsQuery;
  const attachments = attachmentsData?.materials || [];

  const handleToggleSelection = (item: Materials) => {
    const isExist = tempSelected.some((m) => m.id === item.id);
    if (isExist) {
      setTempSelected((prev) => prev.filter((m) => m.id !== item.id));
    } else {
      setTempSelected((prev) => [...prev, item]);
    }
  };

  const handleApply = () => {
    onChange(tempSelected);
    closeModal();
  };

  return (
    <Dialog open={isOpen} onOpenChange={closeModal}>
      <DialogContent className="max-h-[90vh] max-w-4xl flex flex-col p-6 overflow-hidden">
        <DialogHeader className="text-left">
          <DialogTitle className="text-xl font-bold">
            자료실 검색 및 첨부 선택
          </DialogTitle>
          <DialogDescription>
            필요한 자료를 검색해 선택한 뒤 업무 지시에 첨부합니다.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 grid gap-3 md:grid-cols-[1fr_180px]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              placeholder="자료명 또는 분류로 검색"
              className="pl-9"
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {["ALL", "PAPER", "VIDEO", "OTHER"].map((opt) => (
                <SelectItem key={opt} value={opt}>
                  {opt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
          <span>
            {isLoading
              ? "검색 결과 로딩 중..."
              : `검색 결과 ${attachments.length}건`}
          </span>
          <span>선택 {tempSelected.length}건</span>
        </div>

        <div className="mt-2 flex-1 overflow-y-auto space-y-2 rounded-lg border bg-background p-2">
          {isLoading ? (
            <div className="rounded-md px-4 py-10 text-center text-sm text-muted-foreground">
              자료실 데이터를 불러오는 중입니다.
            </div>
          ) : error ? (
            <div className="rounded-md px-4 py-10 text-center text-sm text-destructive">
              데이터를 불러오는 중 에러가 발생했습니다.
            </div>
          ) : attachments.length === 0 ? (
            <div className="rounded-md px-4 py-10 text-center text-sm text-muted-foreground">
              검색 조건에 맞는 자료가 없습니다.
            </div>
          ) : (
            attachments.map((item) => {
              const isChecked = tempSelected.some((m) => m.id === item.id);

              return (
                <div
                  key={item.id}
                  role="button"
                  tabIndex={0}
                  aria-pressed={isChecked}
                  className={`flex w-full items-start gap-3 rounded-md border px-4 py-3 text-left transition outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                    isChecked
                      ? "border-primary/60 bg-primary/5"
                      : "border-transparent hover:border-muted hover:bg-muted/30"
                  }`}
                  onClick={() => handleToggleSelection(item)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handleToggleSelection(item);
                    }
                  }}
                >
                  <Checkbox
                    checked={isChecked}
                    className="pointer-events-none mt-0.5"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{item.title}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {item.type} | {item.writer} | {item.date}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <DialogFooter className="mt-6 gap-2">
          <Button
            type="button"
            variant="outline"
            className="rounded-full px-6"
            onClick={closeModal}
          >
            취소
          </Button>
          <Button
            type="button"
            className="rounded-full px-6"
            onClick={handleApply}
            disabled={isLoading || !!error}
          >
            선택 자료 첨부 ({tempSelected.length})
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
