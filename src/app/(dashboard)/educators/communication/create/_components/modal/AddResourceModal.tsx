"use client";

import { FileText, Search, Check } from "lucide-react";
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
import SelectBtn from "@/components/common/button/SelectBtn";
import { useDebounce } from "@/hooks/useDebounce";
import { useMaterials } from "@/hooks/useMaterials";
import { Materials, MaterialsType } from "@/types/materials.type";
import {
  MATERIALS_TYPE_OPTIONS,
  MATERIALS_TYPE_LABEL,
  MATERIALS_ICONS,
} from "@/constants/communication.default";

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

  if (!isOpen && tempSelected.length !== initialSelected.length) {
    setTempSelected(initialSelected);
    setSearchKeyword("");
    setCategoryFilter("ALL");
  }

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

  const handleCancel = () => {
    setTempSelected(initialSelected);
    closeModal();
  };

  return (
    <Dialog open={isOpen} onOpenChange={closeModal}>
      <DialogContent className="max-h-[90vh] max-w-4xl flex flex-col overflow-hidden p-[32px]">
        <DialogHeader className="text-left space-y-1">
          <DialogTitle className="text-[24px] font-bold text-label-normal">
            자료실 검색 및 첨부 선택
          </DialogTitle>
          <DialogDescription className="text-[18px] font-medium text-label-alternative">
            필요한 자료를 검색해 첨부해보세요.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 grid gap-3 md:grid-cols-[1fr_180px]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <Input
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              placeholder="자료명 또는 분류로 검색"
              className="h-14 pl-11 pr-4 text-base placeholder:text-base rounded-[12px] shadow-none border"
            />
          </div>
          <SelectBtn
            value={categoryFilter}
            onChange={setCategoryFilter}
            placeholder="분류 선택"
            options={MATERIALS_TYPE_OPTIONS}
            className="h-14 text-base"
            optionSize="lg"
          />
        </div>

        <div className="mt-4 flex items-center justify-between text-sm text-slate-500 font-medium">
          <span>
            {isLoading
              ? "검색 결과 로딩 중..."
              : `검색 결과 ${attachments.length}건`}
          </span>
          <span>선택 {tempSelected.length}건</span>
        </div>

        <div className="mt-2 flex-1 overflow-y-auto space-y-2 rounded-xl border border-slate-200 bg-slate-50/30 p-3 scrollbar-hide">
          {isLoading ? (
            <div className="rounded-xl px-4 py-10 text-center text-base text-slate-500">
              자료실 데이터를 불러오는 중입니다.
            </div>
          ) : error ? (
            <div className="rounded-xl px-4 py-10 text-center text-base text-red-500">
              데이터를 불러오는 중 에러가 발생했습니다.
            </div>
          ) : attachments.length === 0 ? (
            <div className="rounded-xl px-4 py-10 text-center text-base text-slate-500">
              검색 조건에 맞는 자료가 없습니다.
            </div>
          ) : (
            attachments.map((item) => {
              const isChecked = tempSelected.some((m) => m.id === item.id);

              const IconComponent =
                MATERIALS_ICONS[item.type as keyof typeof MATERIALS_ICONS] ||
                FileText;

              return (
                <div
                  key={item.id}
                  role="button"
                  tabIndex={0}
                  aria-pressed={isChecked}
                  onClick={() => handleToggleSelection(item)}
                  className={`group flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${
                    isChecked
                      ? "bg-white border-blue-200 shadow-sm"
                      : "bg-white border-transparent hover:bg-slate-50/80 hover:border-slate-200"
                  }`}
                >
                  <div className="flex items-center gap-4 overflow-hidden">
                    <div
                      className={`p-2.5 rounded-lg border transition-colors ${
                        isChecked
                          ? "bg-white border-blue-100"
                          : "bg-slate-50 border-slate-100"
                      }`}
                    >
                      <IconComponent
                        className={`h-5 w-5 ${isChecked ? "text-blue-500" : "text-slate-400"}`}
                      />
                    </div>

                    <div className="flex flex-col overflow-hidden">
                      <span
                        className={`text-[15px] font-semibold truncate ${isChecked ? "text-blue-900" : "text-slate-700"}`}
                      >
                        {item.title}
                      </span>
                      <div className="flex items-center gap-2 mt-1">
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                            isChecked
                              ? "bg-blue-100 text-blue-600"
                              : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          {MATERIALS_TYPE_LABEL[
                            item.type as keyof typeof MATERIALS_TYPE_LABEL
                          ] || item.type}
                        </span>
                        <span className="text-xs text-slate-400">
                          {item.writer} • {item.date}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div
                    className={`mr-1 h-5 w-5 rounded-full border flex items-center justify-center transition-all ${
                      isChecked
                        ? "bg-blue-600 border-blue-600"
                        : "bg-white border-slate-200 group-hover:border-slate-400"
                    }`}
                  >
                    {isChecked && (
                      <Check className="h-3 w-3 text-white stroke-[3px]" />
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        <DialogFooter className="mt-4 gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            className="h-14 w-[140px] gap-2.5 rounded-xl border-neutral-200 px-0 text-base font-semibold tracking-[-0.01em] text-neutral-500 shadow-none hover:border-brand-500 hover:text-brand-500 transition-colors cursor-pointer"
          >
            취소
          </Button>
          <Button
            type="button"
            onClick={handleApply}
            disabled={isLoading || !!error}
            className="h-14 w-auto min-w-[140px] gap-2.5 rounded-xl border border-[#3863f6] bg-[#3863f6] px-6 text-base font-semibold tracking-[-0.01em] text-white shadow-[0_0_14px_rgba(138,138,138,0.08)] hover:bg-[#2f57e8] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            선택 자료 첨부 ({tempSelected.length})
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
