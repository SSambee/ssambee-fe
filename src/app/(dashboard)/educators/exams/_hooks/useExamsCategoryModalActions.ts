"use client";

import { createAssignmentCategoryAPI } from "@/services/exams/assignment-categories.service";
import {
  readReportCategoryStorageConfig,
  saveReportCategoryStorageConfig,
  type ReportCategory,
} from "@/services/exams/report-category-persistence.service";
import type { Exam } from "@/types/exams";

import {
  getClassKey,
  type ExamsCategoryModalState,
  type PresetSnippet,
} from "./useExamsCategoryModalState";

type AlertFn = (payload: {
  title: string;
  description: string;
}) => Promise<void> | void;
type ConfirmFn = (payload: {
  title: string;
  description: string;
  confirmText: string;
  cancelText: string;
}) => Promise<boolean>;

export const useExamsCategoryModalActions = ({
  exams,
  state,
  showAlert,
  showConfirm,
}: {
  exams: Exam[];
  state: ExamsCategoryModalState;
  showAlert: AlertFn;
  showConfirm: ConfirmFn;
}) => {
  const pushPresetDraft = () => {
    const nextPreset = state.presetInput.trim();

    if (!nextPreset) {
      state.setCreateError("프리셋 값을 입력해주세요.");
      return;
    }

    if (state.presetDrafts.includes(nextPreset)) {
      state.setCreateError("동일한 프리셋이 이미 추가되어 있습니다.");
      state.setPresetInput("");
      return;
    }

    state.setPresetDrafts((prev) => [...prev, nextPreset]);
    state.setPresetInput("");
    state.setCreateError(null);
  };

  const removePresetDraft = (preset: string) => {
    state.setPresetDrafts((prev) => prev.filter((value) => value !== preset));
    state.setCreateError(null);
  };

  const applySnippet = (snippet: PresetSnippet) => {
    state.setPresetDrafts((prev) => {
      const next = [...prev];
      snippet.values.forEach((value) => {
        if (!next.includes(value)) {
          next.push(value);
        }
      });
      return next;
    });
    state.setCreateError(null);
  };

  const handleCreateCategory = async () => {
    const pendingPreset = state.presetInput.trim();
    const nextPresetDrafts = [...state.presetDrafts];

    if (pendingPreset && !nextPresetDrafts.includes(pendingPreset)) {
      nextPresetDrafts.push(pendingPreset);
    }

    if (!state.normalizedCategoryName) {
      state.setCreateError("카테고리 이름을 입력해주세요.");
      return;
    }

    if (nextPresetDrafts.length === 0) {
      state.setCreateError("프리셋을 1개 이상 추가해주세요.");
      return;
    }

    if (state.duplicatedCategoryName) {
      state.setCreateError("같은 이름의 카테고리가 이미 있습니다.");
      return;
    }

    state.setIsCreatingCategory(true);
    state.setCreateError(null);
    try {
      const newCategory = await createAssignmentCategoryAPI({
        name: state.normalizedCategoryName,
        resultPresets: nextPresetDrafts,
      });

      const mappedCategory: ReportCategory = {
        id: newCategory.id,
        name: newCategory.name,
        presets: newCategory.resultPresets,
      };

      state.setCategories((prev) => [mappedCategory, ...prev]);

      if (state.effectiveExamId) {
        state.setExamCategoryMap((prev) => ({
          ...prev,
          [state.effectiveExamId]: [
            ...new Set([
              ...(prev[state.effectiveExamId] ?? []),
              mappedCategory.id,
            ]),
          ],
        }));
      }

      state.setCategoryName("");
      state.setPresetDrafts([]);
      state.setPresetInput("");
      state.setCreateError(null);
    } catch (error) {
      console.error("Failed to create category", error);
      state.setCreateError(
        "카테고리 생성에 실패했습니다. 잠시 후 다시 시도해주세요."
      );
      showAlert({
        title: "오류",
        description: "카테고리 생성에 실패했습니다.",
      });
    } finally {
      state.setIsCreatingCategory(false);
    }
  };

  const toggleIncluded = (id: string) => {
    if (!state.effectiveExamId) return;

    state.setExamCategoryMap((prev) => {
      const current = prev[state.effectiveExamId] ?? [];
      const exists = current.includes(id);
      return {
        ...prev,
        [state.effectiveExamId]: exists
          ? current.filter((value) => value !== id)
          : [...current, id],
      };
    });
  };

  const resetDraftInputs = () => {
    state.setCategoryName("");
    state.setPresetInput("");
    state.setPresetDrafts([]);
    state.setCreateError(null);
    state.setClassSearchQuery("");
    state.setExamSearchQuery("");
    state.setShowIncludedOnly(false);
  };

  const handleSaveModal = () => {
    saveReportCategoryStorageConfig({
      categories: state.categories,
      examCategoryMap: state.examCategoryMap,
      studentSelections: state.studentSelections,
    });
    state.setBaselineCategoriesSerialized(JSON.stringify(state.categories));
    state.setBaselineExamMapSerialized(JSON.stringify(state.examCategoryMap));

    state.setIsCategoryModalOpen(false);
    resetDraftInputs();
  };

  const handleModalOpenChange = async (nextOpen: boolean) => {
    if (nextOpen) {
      state.setIsCategoryModalOpen(true);
      return;
    }

    if (state.isBusy) return;

    if (state.hasPendingChanges) {
      const shouldClose = await showConfirm({
        title: "미저장 변경사항",
        description:
          "저장하지 않은 카테고리/포함 설정 변경사항이 있습니다. 닫으시겠습니까?",
        confirmText: "닫기",
        cancelText: "계속 수정",
      });

      if (!shouldClose) return;
    }

    state.setIsCategoryModalOpen(false);
    resetDraftInputs();
  };

  const handleOpenModal = () => {
    const latestStorage = readReportCategoryStorageConfig();

    state.setCategories(latestStorage.categories);
    state.setExamCategoryMap(latestStorage.examCategoryMap);
    state.setBaselineCategoriesSerialized(
      JSON.stringify(latestStorage.categories)
    );
    state.setBaselineExamMapSerialized(
      JSON.stringify(latestStorage.examCategoryMap)
    );

    if (exams.length > 0) {
      const fallbackExam =
        (state.selectedExamId
          ? exams.find((exam) => exam.id === state.selectedExamId)
          : undefined) ?? exams[0];

      state.setSelectedClassKey(getClassKey(fallbackExam));
      state.setSelectedExamId(fallbackExam.id);
    } else {
      state.setSelectedClassKey("");
      state.setSelectedExamId("");
    }

    resetDraftInputs();
    state.setIsCategoryModalOpen(true);
  };

  return {
    pushPresetDraft,
    removePresetDraft,
    applySnippet,
    handleCreateCategory,
    toggleIncluded,
    handleSaveModal,
    handleModalOpenChange,
    handleOpenModal,
  };
};
