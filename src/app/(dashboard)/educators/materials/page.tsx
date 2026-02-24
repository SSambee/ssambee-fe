"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import Title from "@/components/common/header/Title";
import { useModal } from "@/providers/ModalProvider";
import { MaterialsType } from "@/types/materials.type";

import MaterialsFilter from "./_components/filter/MaterialsFilter";
import MaterialsTable from "./_components/table/MaterialsTable";
import { CreateMaterialsModal } from "./_components/modal/CreateMaterialsModal";

export default function MaterialsPage() {
  const { openModal } = useModal();
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedType, setSelectedType] = useState<MaterialsType | "ALL">(
    "ALL"
  );
  const [selectedSort, setSelectedSort] = useState<"latest" | "oldest">(
    "latest"
  );

  const handleOpenCreateModal = () => {
    openModal(<CreateMaterialsModal />);
  };

  return (
    <div className="container mx-auto space-y-8 p-6">
      <Title
        title="학습 자료실"
        description="수업 보조 자료와 심화 학습 콘텐츠를 검색하고 다운로드하세요."
      />

      <div className="space-y-8">
        <div className="flex flex-wrap items-center justify-end gap-3">
          <Button
            variant="default"
            className="h-14 w-[140px] gap-2.5 rounded-xl border border-[#3863f6] bg-[#3863f6] px-0 text-base font-semibold tracking-[-0.01em] text-white shadow-[0_0_14px_rgba(138,138,138,0.08)] hover:bg-[#2f57e8]"
            onClick={handleOpenCreateModal}
          >
            등록하기
          </Button>
        </div>

        <MaterialsFilter
          searchKeyword={searchKeyword}
          selectedType={selectedType}
          selectedSort={selectedSort}
          onSearchChange={setSearchKeyword}
          onTypeChange={setSelectedType}
          onSortChange={setSelectedSort}
        />

        <MaterialsTable
          searchKeyword={searchKeyword}
          selectedType={selectedType}
          selectedSort={selectedSort}
        />
      </div>
    </div>
  );
}
