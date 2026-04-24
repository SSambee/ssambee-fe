"use client";

import { Plus, Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type SearchBarWithActionProps = {
  searchValue: string;
  onSearchChangeAction: (value: string) => void;
  placeholder?: string;
  actionLabel: string;
  onAction: () => void;
};

export function SearchBarWithAction({
  searchValue,
  onSearchChangeAction,
  placeholder = "검색어를 입력하세요",
  actionLabel,
  onAction,
}: SearchBarWithActionProps) {
  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-4">
      <div className="relative flex-1">
        <Input
          type="text"
          placeholder={placeholder}
          className="h-16 rounded-[12px] border-[#e9ebf0] bg-[#fcfcfd] pl-[50px] pr-3 text-base font-medium tracking-[-0.16px] placeholder:text-[#8b90a3] focus-visible:ring-0"
          value={searchValue}
          onChange={(event) => onSearchChangeAction(event.target.value)}
        />
        <Search
          aria-hidden="true"
          className="pointer-events-none absolute left-4 top-1/2 h-6 w-6 -translate-y-1/2 text-[#b0b4c2]"
        />
      </div>
      <Button
        className="h-16 gap-3 rounded-[14px] bg-[#3863f6] pl-[30px] pr-10 text-[18px] font-semibold leading-[26px] tracking-[-0.18px] text-white shadow-[0_0_14px_rgba(138,138,138,0.08)] hover:bg-[#2f57e8]"
        onClick={onAction}
      >
        <Plus className="h-6 w-6" />
        {actionLabel}
      </Button>
    </div>
  );
}
