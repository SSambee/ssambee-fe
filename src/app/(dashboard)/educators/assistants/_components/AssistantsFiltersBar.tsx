import { Search } from "lucide-react";

import { ACTIVE_STATUS_FILTER_OPTIONS } from "@/constants/assistants.constants";
import type { ActiveStatusFilter } from "@/types/assistants";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type AssistantsFiltersBarProps = {
  activeStatusFilter: ActiveStatusFilter;
  onChangeActiveStatusFilter: (status: ActiveStatusFilter) => void;
  searchKeyword: string;
  onChangeSearchKeyword: (value: string) => void;
};

export default function AssistantsFiltersBar({
  activeStatusFilter,
  onChangeActiveStatusFilter,
  searchKeyword,
  onChangeSearchKeyword,
}: AssistantsFiltersBarProps) {
  return (
    <Card className="rounded-[24px] border-[#eaecf2] bg-white shadow-none">
      <CardContent className="space-y-4 pt-5 sm:pt-6">
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8b90a3]" />
            <Input
              value={searchKeyword}
              onChange={(event) => onChangeSearchKeyword(event.target.value)}
              placeholder="조교 이름 또는 연락처 검색"
              className="h-10 rounded-[12px] border-[#e9ebf0] bg-[#fcfcfd] pl-9 text-[16px] placeholder:text-[#8b90a3]"
            />
          </div>

          <div className="w-[140px]">
            <Select
              value={activeStatusFilter}
              onValueChange={(value) =>
                onChangeActiveStatusFilter(value as ActiveStatusFilter)
              }
            >
              <SelectTrigger className="h-10 rounded-[12px] border-[#e9ebf0] bg-[#fcfcfd] text-[16px] text-[#6b6f80]">
                <SelectValue placeholder="상태" />
              </SelectTrigger>
              <SelectContent>
                {ACTIVE_STATUS_FILTER_OPTIONS.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
