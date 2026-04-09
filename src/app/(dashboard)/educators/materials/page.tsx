"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import Title from "@/components/common/header/Title";
import { useModal } from "@/app/providers/ModalProvider";
import { MaterialsType, Materials } from "@/types/materials.type";
import DataTable from "@/components/common/table/DataTable";
import { Pagination } from "@/components/common/pagination/Pagination";
import { useMaterials } from "@/hooks/useMaterials";
import { materialsService } from "@/services/materials.service";
import { useDialogAlert } from "@/hooks/useDialogAlert";

import MaterialsFilter from "./_components/filter/MaterialsFilter";
import { CreateMaterialsModal } from "./_components/modal/CreateMaterialsModal";
import { MATERIALS_TABLE_COLUMNS } from "./_components/table/MaterialsTableColumns";

export default function MaterialsPage() {
  const router = useRouter();
  const { openModal } = useModal();
  const { showAlert } = useDialogAlert();
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedType, setSelectedType] = useState<MaterialsType | "ALL">(
    "ALL"
  );
  const [selectedSort, setSelectedSort] = useState<"latest" | "oldest">(
    "latest"
  );
  const [page, setPage] = useState(1);
  const limit = 10;

  const [prevFilters, setPrevFilters] = useState({
    selectedType,
    selectedSort,
  });

  // 필터 바뀌면 페이지 리셋
  if (
    prevFilters.selectedType !== selectedType ||
    prevFilters.selectedSort !== selectedSort
  ) {
    setPrevFilters({ selectedType, selectedSort });
    setPage(1);
  }

  // 실제 데이터 Fetching
  const { materialsQuery } = useMaterials({
    page,
    limit,
    type: selectedType,
    sort: selectedSort,
  });

  const { data, isLoading } = materialsQuery;

  // TODO: 서버에 검색 기능 요청
  // 검색 필터링
  const materials = data?.materials || [];
  const filteredMaterials = searchKeyword.trim()
    ? materials.filter((material) =>
        material.title.toLowerCase().includes(searchKeyword.toLowerCase())
      )
    : materials;

  const handleDownload = async (material: Materials) => {
    try {
      const response = await materialsService.getDownloadUrl(material.id);

      // 파일이든 YouTube든 새 탭에서 열기
      window.open(response.data.url, "_blank");
    } catch {
      await showAlert({
        description: "다운로드 링크를 가져오는데 실패했습니다.",
      });
    }
  };

  const handleNavigate = (id: string) => {
    router.push(`/educators/materials/${id}`);
  };

  const handleOpenCreateModal = () => {
    openModal(<CreateMaterialsModal />);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto space-y-8 p-6">
        <Title
          title="학습 자료실"
          description="수업 보조 자료와 심화 학습 콘텐츠를 검색하고 다운로드하세요."
        />
        <div className="min-h-[500px] flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

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

        <div>
          <DataTable
            data={filteredMaterials}
            columns={MATERIALS_TABLE_COLUMNS({
              onDownload: handleDownload,
            })}
            emptyMessage="검색 결과가 없습니다."
            onRowClick={(row) => handleNavigate(row.id)}
          />

          <Pagination
            pagination={{
              totalCount: data?.pagination.totalCount || 0,
              totalPage: data?.pagination.totalPage || 0,
              currentPage: data?.pagination.currentPage || 1,
              limit: data?.pagination.limit || limit,
              hasNextPage: data?.pagination.hasNextPage || false,
              hasPrevPage: data?.pagination.hasPrevPage || false,
            }}
            onPageChange={(page) => setPage(page)}
          />
        </div>
      </div>
    </div>
  );
}
