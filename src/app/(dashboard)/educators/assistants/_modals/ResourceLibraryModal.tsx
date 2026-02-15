import {
  type ResourceLibraryItem,
  type ResourceLibraryCategory,
} from "@/types/assistants";
import CommonResourceLibraryModal, {
  type ResourceLibraryModalItem,
} from "@/components/common/modals/ResourceLibraryModal";

type ResourceLibraryModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  resourceSearchKeyword: string;
  onChangeResourceSearchKeyword: (keyword: string) => void;
  resourceCategoryFilter: "전체" | ResourceLibraryCategory;
  resourceCategoryOptions: readonly [
    "전체",
    "수업자료",
    "평가자료",
    "운영문서",
  ];
  onChangeResourceCategoryFilter: (
    category: "전체" | ResourceLibraryCategory
  ) => void;
  filteredResourceLibraryItems: ResourceLibraryItem[];
  isLoading: boolean;
  errorMessage: string | null;
  libraryDraftResourceIds: string[];
  onToggleDraftResourceSelection: (resourceId: string) => void;
  onCancel: () => void;
  onApply: () => void;
};

export default function ResourceLibraryModal({
  open,
  onOpenChange,
  resourceSearchKeyword,
  onChangeResourceSearchKeyword,
  resourceCategoryFilter,
  resourceCategoryOptions,
  onChangeResourceCategoryFilter,
  filteredResourceLibraryItems,
  isLoading,
  errorMessage,
  libraryDraftResourceIds,
  onToggleDraftResourceSelection,
  onCancel,
  onApply,
}: ResourceLibraryModalProps) {
  const items: ResourceLibraryModalItem[] = filteredResourceLibraryItems.map(
    (resource) => ({
      id: resource.id,
      title: resource.title,
      meta: `${resource.category} · ${resource.updatedAt} · ${resource.sizeLabel}`,
    })
  );

  return (
    <CommonResourceLibraryModal
      open={open}
      onOpenChange={onOpenChange}
      searchKeyword={resourceSearchKeyword}
      onChangeSearchKeyword={onChangeResourceSearchKeyword}
      categoryFilter={resourceCategoryFilter}
      categoryOptions={resourceCategoryOptions}
      onChangeCategoryFilter={(category) =>
        onChangeResourceCategoryFilter(
          category as "전체" | ResourceLibraryCategory
        )
      }
      items={items}
      isLoading={isLoading}
      errorMessage={errorMessage}
      selectedIds={libraryDraftResourceIds}
      onToggleSelection={onToggleDraftResourceSelection}
      onCancel={onCancel}
      onApply={onApply}
    />
  );
}
