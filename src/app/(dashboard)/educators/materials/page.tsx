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
      <div className="flex items-center justify-between gap-4">
        <Title
          title="학습 자료실"
          description="수업 보조 자료와 심화 학습 콘텐츠를 검색하고 다운로드하세요."
        />

        <Button
          variant="outline"
          className="max-w-[180px] h-[50px] w-full rounded-lg text-base cursor-pointer"
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
  );
}
