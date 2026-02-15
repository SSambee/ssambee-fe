"use client";

import { useEffect } from "react";

import { fetchAssignmentCategoriesAPI } from "@/services/exams/assignment-categories.service";
import type { ReportCategory } from "@/services/exams/report-category-persistence.service";

import type { ExamsCategoryModalState } from "./useExamsCategoryModalState";

type AlertFn = (payload: {
  title: string;
  description: string;
}) => Promise<void> | void;

export const useExamsCategoryModalResources = ({
  state,
  showAlert,
}: {
  state: ExamsCategoryModalState;
  showAlert: AlertFn;
}) => {
  const {
    isCategoryModalOpen,
    setIsFetchingCategories,
    setCategories,
    setBaselineCategoriesSerialized,
  } = state;

  useEffect(() => {
    if (!isCategoryModalOpen) return;

    const loadCategories = async () => {
      setIsFetchingCategories(true);

      try {
        const data = await fetchAssignmentCategoriesAPI();
        const mappedCategories: ReportCategory[] = data.map((cat) => ({
          id: cat.id,
          name: cat.name,
          presets: cat.resultPresets,
        }));
        setCategories(mappedCategories);
        setBaselineCategoriesSerialized(JSON.stringify(mappedCategories));
      } catch (error) {
        console.error("Failed to fetch categories", error);
        showAlert({
          title: "오류",
          description: "카테고리 목록을 불러오는데 실패했습니다.",
        });
      } finally {
        setIsFetchingCategories(false);
      }
    };

    void loadCategories();
  }, [
    isCategoryModalOpen,
    setBaselineCategoriesSerialized,
    setCategories,
    setIsFetchingCategories,
    showAlert,
  ]);
};
