"use client";

import {
  createAssignmentCategoryAPI,
  deleteAssignmentCategoryAPI,
  updateAssignmentCategoryAPI,
} from "@/services/exams/assignment-categories.service";
import {
  createAssignmentAPI,
  deleteAssignmentAPI,
} from "@/services/exams/assignments.service";
import { updateExamReportAssignmentsAPI } from "@/services/exams/exam-report-assignments.service";
import type { Exam } from "@/types/exams";

import {
  getClassKey,
  type ExamsCategoryModalState,
  type ReportCategory,
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

  const handleCreateAssignment = async () => {
    const lectureId = state.selectedExam?.lectureId;
    const title = state.assignmentTitle.trim();

    if (!lectureId) {
      state.setCreateAssignmentError(
        "강의가 연결된 시험을 선택한 뒤 과제를 생성해주세요."
      );
      return;
    }

    if (!title) {
      state.setCreateAssignmentError("과제명을 입력해주세요.");
      return;
    }

    if (!state.assignmentCategoryId) {
      state.setCreateAssignmentError("카테고리를 선택해주세요.");
      return;
    }

    state.setIsCreatingAssignment(true);
    state.setCreateAssignmentError(null);

    try {
      const created = await createAssignmentAPI(lectureId, {
        title,
        categoryId: state.assignmentCategoryId,
      });

      const matchedCategory = state.categories.find(
        (category) => category.id === state.assignmentCategoryId
      );

      state.setAvailableAssignments((prev) => {
        const next = [
          ...prev.filter((assignment) => assignment.id !== created.id),
          {
            id: created.id,
            title: created.title,
            categoryId: created.categoryId,
            categoryName: matchedCategory?.name ?? "카테고리 미지정",
            presets: matchedCategory?.presets ?? [],
          },
        ];

        return next.sort((a, b) => a.title.localeCompare(b.title, "ko"));
      });

      if (state.effectiveExamId) {
        state.setExamAssignmentMap((prev) => ({
          ...prev,
          [state.effectiveExamId]: Array.from(
            new Set([...(prev[state.effectiveExamId] ?? []), created.id])
          ),
        }));
      }

      state.setAssignmentTitle("");
    } catch (error) {
      console.error("Failed to create assignment", error);
      state.setCreateAssignmentError(
        "과제 생성에 실패했습니다. 잠시 후 다시 시도해주세요."
      );
      showAlert({
        title: "오류",
        description: "과제 생성에 실패했습니다.",
      });
    } finally {
      state.setIsCreatingAssignment(false);
    }
  };

  const handleDeleteAssignment = async ({
    assignmentId,
    assignmentTitle,
  }: {
    assignmentId: string;
    assignmentTitle: string;
  }) => {
    const shouldDelete = await showConfirm({
      title: "과제를 삭제할까요?",
      description: `"${assignmentTitle}" 과제를 삭제하면 모든 시험 포함/결과 데이터에서 제거됩니다.`,
      confirmText: "삭제",
      cancelText: "취소",
    });

    if (!shouldDelete) return false;

    state.setIsDeletingAssignment(true);
    state.setDeletingAssignmentId(assignmentId);

    try {
      await deleteAssignmentAPI(assignmentId);

      state.setAvailableAssignments((prev) =>
        prev.filter((assignment) => assignment.id !== assignmentId)
      );

      const nextExamAssignmentMap = Object.fromEntries(
        Object.entries(state.examAssignmentMap).map(
          ([examId, assignmentIds]) => [
            examId,
            assignmentIds.filter((id) => id !== assignmentId),
          ]
        )
      );
      state.setExamAssignmentMap(nextExamAssignmentMap);
      state.setBaselineExamAssignmentMapSerialized(
        JSON.stringify(nextExamAssignmentMap)
      );

      return true;
    } catch (error) {
      console.error("Failed to delete assignment", error);
      showAlert({
        title: "오류",
        description: "과제 삭제에 실패했습니다.",
      });
      return false;
    } finally {
      state.setIsDeletingAssignment(false);
      state.setDeletingAssignmentId(null);
    }
  };

  const toggleIncluded = (id: string) => {
    if (!state.effectiveExamId) return;

    const categoryAssignmentIds = state.availableAssignments
      .filter((assignment) => assignment.categoryId === id)
      .map((assignment) => assignment.id);

    if (categoryAssignmentIds.length === 0) return;

    state.setExamAssignmentMap((prev) => {
      const current = prev[state.effectiveExamId] ?? [];
      const currentSet = new Set(current);
      const shouldExclude = categoryAssignmentIds.every((assignmentId) =>
        currentSet.has(assignmentId)
      );

      const nextSet = new Set(current);

      categoryAssignmentIds.forEach((assignmentId) => {
        if (shouldExclude) {
          nextSet.delete(assignmentId);
          return;
        }

        nextSet.add(assignmentId);
      });

      return {
        ...prev,
        [state.effectiveExamId]: Array.from(nextSet),
      };
    });
  };

  const handleUpdateCategory = async ({
    id,
    name,
    resultPresets,
  }: {
    id: string;
    name: string;
    resultPresets: string[];
  }) => {
    state.setIsUpdatingCategory(true);

    try {
      const updatedCategory = await updateAssignmentCategoryAPI(id, {
        name,
        resultPresets,
      });

      state.setCategories((prev) =>
        prev.map((category) =>
          category.id === id
            ? {
                id: updatedCategory.id,
                name: updatedCategory.name,
                presets: updatedCategory.resultPresets,
              }
            : category
        )
      );

      return true;
    } catch (error) {
      console.error("Failed to update category", error);
      showAlert({
        title: "오류",
        description: "카테고리 수정에 실패했습니다.",
      });
      return false;
    } finally {
      state.setIsUpdatingCategory(false);
    }
  };

  const handleDeleteCategory = async ({
    id,
    name,
  }: {
    id: string;
    name: string;
  }) => {
    const shouldDelete = await showConfirm({
      title: "카테고리를 삭제할까요?",
      description: `\"${name}\" 카테고리를 삭제하면 현재 시험 포함 설정에서도 제거됩니다.`,
      confirmText: "삭제",
      cancelText: "취소",
    });

    if (!shouldDelete) return false;

    state.setIsDeletingCategory(true);
    state.setDeletingCategoryId(id);

    try {
      await deleteAssignmentCategoryAPI(id);

      state.setCategories((prev) =>
        prev.filter((category) => category.id !== id)
      );

      const removedAssignmentIds = state.availableAssignments
        .filter((assignment) => assignment.categoryId === id)
        .map((assignment) => assignment.id);

      state.setAvailableAssignments((prev) =>
        prev.filter((assignment) => assignment.categoryId !== id)
      );

      if (removedAssignmentIds.length > 0) {
        const removedSet = new Set(removedAssignmentIds);
        const nextExamAssignmentMap = Object.fromEntries(
          Object.entries(state.examAssignmentMap).map(
            ([examId, assignmentIds]) => [
              examId,
              assignmentIds.filter(
                (assignmentId) => !removedSet.has(assignmentId)
              ),
            ]
          )
        );

        state.setExamAssignmentMap(nextExamAssignmentMap);
        state.setBaselineExamAssignmentMapSerialized(
          JSON.stringify(nextExamAssignmentMap)
        );
      }

      return true;
    } catch (error) {
      console.error("Failed to delete category", error);
      showAlert({
        title: "오류",
        description: "카테고리 삭제에 실패했습니다.",
      });
      return false;
    } finally {
      state.setIsDeletingCategory(false);
      state.setDeletingCategoryId(null);
    }
  };

  const resetDraftInputs = () => {
    state.setCategoryName("");
    state.setAssignmentTitle("");
    state.setPresetInput("");
    state.setPresetDrafts([]);
    state.setCreateError(null);
    state.setCreateAssignmentError(null);
    state.setClassSearchQuery("");
    state.setExamSearchQuery("");
    state.setShowIncludedOnly(false);
  };

  const toggleIncludedAssignment = (assignmentId: string) => {
    if (!state.effectiveExamId) return;

    state.setExamAssignmentMap((prev) => {
      const current = prev[state.effectiveExamId] ?? [];
      const exists = current.includes(assignmentId);

      return {
        ...prev,
        [state.effectiveExamId]: exists
          ? current.filter((value) => value !== assignmentId)
          : [...current, assignmentId],
      };
    });
  };

  const handleSaveModal = async (options?: { closeAfterSave?: boolean }) => {
    const closeAfterSave = options?.closeAfterSave ?? true;

    if (state.effectiveExamId && state.hasPendingAssignmentChanges) {
      state.setIsSavingAssignments(true);

      try {
        await updateExamReportAssignmentsAPI(state.effectiveExamId, {
          assignments: state.includedAssignmentIds,
        });

        const baselineMap = (() => {
          try {
            const parsed = JSON.parse(
              state.baselineExamAssignmentMapSerialized
            );
            if (!parsed || typeof parsed !== "object") {
              return {} as Record<string, string[]>;
            }
            return parsed as Record<string, string[]>;
          } catch {
            return {} as Record<string, string[]>;
          }
        })();

        state.setBaselineExamAssignmentMapSerialized(
          JSON.stringify({
            ...baselineMap,
            [state.effectiveExamId]:
              state.examAssignmentMap[state.effectiveExamId] ?? [],
          })
        );
      } catch (error) {
        console.error("Failed to save report assignments", error);
        showAlert({
          title: "오류",
          description: "시험별 포함 과제 저장에 실패했습니다.",
        });
        return false;
      } finally {
        state.setIsSavingAssignments(false);
      }
    }

    if (closeAfterSave) {
      state.setIsCategoryModalOpen(false);
      resetDraftInputs();
    }

    return true;
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
          "저장하지 않은 포함 설정 변경사항이 있습니다. 닫으시겠습니까?",
        confirmText: "닫기",
        cancelText: "계속 수정",
      });

      if (!shouldClose) return;
    }

    state.setIsCategoryModalOpen(false);
    resetDraftInputs();
  };

  const handleOpenModal = (preferredExamId?: string) => {
    if (exams.length > 0) {
      const fallbackExam =
        (preferredExamId
          ? exams.find((exam) => exam.id === preferredExamId)
          : undefined) ??
        (state.selectedExamId
          ? exams.find((exam) => exam.id === state.selectedExamId)
          : undefined) ??
        exams[0];

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
    handleCreateAssignment,
    handleDeleteAssignment,
    handleUpdateCategory,
    handleDeleteCategory,
    toggleIncluded,
    toggleIncludedAssignment,
    handleSaveModal,
    handleModalOpenChange,
    handleOpenModal,
  };
};
