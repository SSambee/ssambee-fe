"use client";

import { useState } from "react";

import DataTable from "@/components/common/table/DataTable";
import { MOCK_MATERIALS } from "@/data/materials.mock";
import { Materials } from "@/types/materials.type";
import { Pagination } from "@/components/common/pagination/Pagination";

import { MATERIALS_TABLE_COLUMNS } from "./MaterialsTableColumns";

export default function MaterialsTable() {
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);

  // 현재 화면에 있는 데이터 ID 추출
  const currentDataIds = MOCK_MATERIALS.map((m) => m.id);

  // 현재 화면의 데이터가 모두 선택되었는지 확인
  const isAllSelected =
    currentDataIds.length > 0 &&
    currentDataIds.every((id) => selectedMaterials.includes(id));

  const handleToggleAll = () => {
    if (isAllSelected) {
      // 현재 화면에 있는 ID들만 기존 선택 목록에서 제외
      setSelectedMaterials((prev) =>
        prev.filter((id) => !currentDataIds.includes(id))
      );
    } else {
      // 기존 선택에 현재 화면 ID들만 추가 (중복 제거)
      setSelectedMaterials((prev) =>
        Array.from(new Set([...prev, ...currentDataIds]))
      );
    }
  };

  const handleToggleMaterial = (material: Materials) => {
    setSelectedMaterials(
      (prev) =>
        prev.includes(material.id)
          ? prev.filter((id) => id !== material.id) // 이미 있으면 제거
          : [...prev, material.id] // 없으면 추가
    );
  };

  // 파일 다운로드 핸들러
  const handleDownload = (material: Materials) => {
    if (!material.file) {
      alert("다운로드할 파일이 없습니다.");
      return;
    }

    // TODO: 실제 API에서는 파일 URL을 받아서 다운로드
    const fileName = material.file.name || material.title;
    alert(`다운로드: ${fileName}`);
  };

  return (
    <div className="min-h-[550px]">
      <DataTable
        data={MOCK_MATERIALS}
        columns={MATERIALS_TABLE_COLUMNS({
          selectedMaterials,
          onToggleMaterial: handleToggleMaterial,
          onToggleAllMaterials: handleToggleAll,
          isCurrentPageAllSelected: isAllSelected,
          onDownload: handleDownload,
        })}
      />

      <Pagination
        pagination={{
          totalCount: MOCK_MATERIALS.length,
          totalPage: 1,
          currentPage: 1,
          limit: 10,
          hasNextPage: false,
          hasPrevPage: false,
        }}
        onPageChange={() => {}}
      />
    </div>
  );
}
