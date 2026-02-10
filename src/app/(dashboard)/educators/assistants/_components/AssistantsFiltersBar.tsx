import { Search } from "lucide-react";

import { ACTIVE_STATUS_FILTER_OPTIONS } from "@/app/(dashboard)/educators/assistants/_constants/assistants.constants";
import type { ActiveStatusFilter } from "@/app/(dashboard)/educators/assistants/_types/assistants.page.types";
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
};

export default function AssistantsFiltersBar({
  activeStatusFilter,
  onChangeActiveStatusFilter,
}: AssistantsFiltersBarProps) {
  return (
    <Card>
      <CardContent className="space-y-4 pt-6">
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="조교 이름 또는 연락처 검색" className="pl-9" />
          </div>

          <div className="w-[140px]">
            <Select
              value={activeStatusFilter}
              onValueChange={(value) =>
                onChangeActiveStatusFilter(value as ActiveStatusFilter)
              }
            >
              <SelectTrigger>
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
