import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import {
  getResourceLibraryCategoryByMaterialsType,
  resourceCategoryOptions,
} from "@/constants/assistants.constants";
import { materialsService } from "@/services/materials.service";
import type { Materials } from "@/types/materials.type";
import type { ResourceLibraryItem } from "@/types/assistants";

const toResourceLibraryItem = (material: Materials): ResourceLibraryItem => ({
  id: material.id,
  title: material.title,
  category: getResourceLibraryCategoryByMaterialsType(material.type),
  updatedAt: material.date,
  sizeLabel: material.file?.name
    ? material.title
    : material.link?.trim()
      ? "링크 자료"
      : "파일 없음",
});

const getErrorMessage = (error: unknown) => {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return "자료실 목록을 불러오지 못했습니다.";
};

export const useResourceLibrarySelection = () => {
  const [isResourceLibraryModalOpen, setResourceLibraryModalOpen] =
    useState(false);
  const [attachedResourceIds, setAttachedResourceIds] = useState<string[]>([]);
  const [libraryDraftResourceIds, setLibraryDraftResourceIds] = useState<
    string[]
  >([]);
  const [resourceSearchKeyword, setResourceSearchKeyword] = useState("");
  const [resourceCategoryFilter, setResourceCategoryFilter] =
    useState<(typeof resourceCategoryOptions)[number]>("전체");

  const {
    data: materialsResponse,
    isLoading: isResourceLibraryLoading,
    error: resourceLibraryError,
  } = useQuery({
    queryKey: ["assistant-resource-library", "materials"],
    queryFn: () =>
      materialsService.getMaterials({
        page: 1,
        limit: 50,
        type: "ALL",
        sort: "latest",
      }),
    staleTime: 60 * 1000,
  });

  const resourceLibraryItems = useMemo(
    () => (materialsResponse?.materials ?? []).map(toResourceLibraryItem),
    [materialsResponse?.materials]
  );

  const attachedResources = useMemo(
    () =>
      resourceLibraryItems.filter((item) =>
        attachedResourceIds.includes(item.id)
      ),
    [attachedResourceIds, resourceLibraryItems]
  );

  const filteredResourceLibraryItems = useMemo(() => {
    const normalizedKeyword = resourceSearchKeyword.trim().toLowerCase();

    return resourceLibraryItems.filter((resource) => {
      const categoryMatched =
        resourceCategoryFilter === "전체" ||
        resource.category === resourceCategoryFilter;
      const keywordMatched =
        normalizedKeyword.length === 0 ||
        resource.title.toLowerCase().includes(normalizedKeyword) ||
        resource.category.toLowerCase().includes(normalizedKeyword);

      return categoryMatched && keywordMatched;
    });
  }, [resourceCategoryFilter, resourceLibraryItems, resourceSearchKeyword]);

  const openResourceLibraryModal = () => {
    setLibraryDraftResourceIds(attachedResourceIds);
    setResourceLibraryModalOpen(true);
  };

  const closeResourceLibraryModal = () => {
    setResourceLibraryModalOpen(false);
    setResourceSearchKeyword("");
    setResourceCategoryFilter("전체");
    setLibraryDraftResourceIds([]);
  };

  const toggleDraftResourceSelection = (resourceId: string) => {
    setLibraryDraftResourceIds((prev) =>
      prev.includes(resourceId)
        ? prev.filter((id) => id !== resourceId)
        : [...prev, resourceId]
    );
  };

  const applyDraftResourceSelection = () => {
    setAttachedResourceIds(libraryDraftResourceIds);
    return libraryDraftResourceIds.length;
  };

  const removeAttachedResource = (resourceId: string) => {
    setAttachedResourceIds((prev) => prev.filter((id) => id !== resourceId));
  };

  const resetResourceSelection = () => {
    setAttachedResourceIds([]);
    setLibraryDraftResourceIds([]);
    setResourceSearchKeyword("");
    setResourceCategoryFilter("전체");
    setResourceLibraryModalOpen(false);
  };

  return {
    isResourceLibraryModalOpen,
    resourceSearchKeyword,
    setResourceSearchKeyword,
    resourceCategoryFilter,
    resourceCategoryOptions,
    setResourceCategoryFilter,
    filteredResourceLibraryItems,
    libraryDraftResourceIds,
    attachedResourceIds,
    attachedResources,
    isResourceLibraryLoading,
    resourceLibraryError: resourceLibraryError
      ? getErrorMessage(resourceLibraryError)
      : null,
    openResourceLibraryModal,
    closeResourceLibraryModal,
    toggleDraftResourceSelection,
    applyDraftResourceSelection,
    removeAttachedResource,
    resetResourceSelection,
  };
};
