import { Input } from "@/components/ui/input";
import SelectBtn from "@/components/common/button/SelectBtn";
import {
  MATERIALS_TYPE_OPTIONS,
  SORT_OPTIONS,
} from "@/constants/materials.default";
import { MaterialsType } from "@/types/materials.type";

type MaterialsFilterProps = {
  searchKeyword: string;
  selectedType: MaterialsType | "ALL";
  selectedSort: "latest" | "oldest";
  onSearchChange: (keyword: string) => void;
  onTypeChange: (type: MaterialsType | "ALL") => void;
  onSortChange: (sort: "latest" | "oldest") => void;
};

export default function MaterialsFilter({
  searchKeyword,
  selectedType,
  selectedSort,
  onSearchChange,
  onTypeChange,
  onSortChange,
}: MaterialsFilterProps) {
  return (
    <div className="w-full bg-surface-normal-light">
      <div className="flex flex-wrap gap-4 w-full items-center">
        <div className="w-full xl:flex-1 min-w-[300px]">
          <Input
            className="h-14 w-full px-5 rounded-[12px] shadow-none border-neutral-200 text-base text-neutral-700 placeholder:text-neutral-300 focus:border-brand-500 focus:ring-brand-500 transition-all"
            placeholder="제목으로 검색해보세요"
            value={searchKeyword}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap md:flex-nowrap gap-3 w-full xl:w-auto items-center">
          <div className="flex gap-2 w-full">
            <SelectBtn
              className="flex-1 w-full lg:w-[140px] h-14 text-base font-semibold border-neutral-200 rounded-[12px] text-neutral-500 hover:bg-surface-elevated-light transition-colors"
              optionSize="sm"
              value={selectedType}
              placeholder="자료 유형"
              options={MATERIALS_TYPE_OPTIONS}
              onChange={(value: string) =>
                onTypeChange(value as MaterialsType | "ALL")
              }
            />
            <SelectBtn
              className="flex-1 w-full lg:w-[140px] h-14 text-base font-semibold border-neutral-200 rounded-[12px] text-neutral-500 hover:bg-surface-elevated-light transition-colors"
              optionSize="sm"
              value={selectedSort}
              placeholder="최신 순"
              options={SORT_OPTIONS}
              onChange={(value: string) =>
                onSortChange(value as "latest" | "oldest")
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}
