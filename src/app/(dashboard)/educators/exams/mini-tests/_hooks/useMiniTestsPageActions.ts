"use client";

import { upsertAssignmentResultsAPI } from "@/services/exams/assignment-results.service";
import type {
  IncludedAssignment,
  SelectionByStudent,
} from "@/types/exams/mini-tests";

type EditableCategory = {
  id: string;
  name: string;
  presets: string[];
};

type UseMiniTestsPageActionsParams = {
  selectedExamId?: string | null;
  isEditMode: boolean;
  isSaving: boolean;
  students: Array<{ id: string }>;
  includedAssignments: IncludedAssignment[];
  currentSelections: SelectionByStudent;
  assignmentSearchQuery: string;
  editingCategoryId: string | null;
  editingCategoryName: string;
  editingPresetInput: string;
  editingPresetDrafts: string[];
  categories: EditableCategory[];
  setIsSaving: (value: boolean) => void;
  setExamFinalizedMap: (
    updater: (prev: Record<string, boolean>) => Record<string, boolean>
  ) => void;
  setIsEditMode: (value: boolean) => void;
  setFeedbackMessage: (value: string | null) => void;
  setIsCategoryApplyFeedback: (value: boolean) => void;
  setAssignmentDataVersion: (updater: (prev: number) => number) => void;
  setResultSearchTerm: (value: string) => void;
  setShowOnlyMissingResults: (value: boolean) => void;
  setIsResultModalOpen: (value: boolean) => void;
  setSelectionsByExam: (
    updater: (
      prev: Record<string, SelectionByStudent>
    ) => Record<string, SelectionByStudent>
  ) => void;
  setAssignmentSearchQuery: (value: string) => void;
  setIsTargetSelectorOpen: (value: boolean) => void;
  setIsAdvancedCategoryOpen: (value: boolean) => void;
  setAssignmentTitle: (value: string) => void;
  setEditingCategoryId: (value: string | null) => void;
  setEditingCategoryName: (value: string) => void;
  setEditingPresetDrafts: (
    value: string[] | ((prev: string[]) => string[])
  ) => void;
  setEditingPresetInput: (value: string) => void;
  setEditingError: (value: string | null) => void;
  showConfirm: (options: {
    title: string;
    description: string;
    confirmText: string;
    cancelText: string;
  }) => Promise<boolean>;
  showAlert: (options: { title: string; description: string }) => Promise<void>;
  handleOpenModal: (examId?: string) => void;
  handleSaveModal: (options: { closeAfterSave: boolean }) => Promise<boolean>;
  handleUpdateCategory: (input: {
    id: string;
    name: string;
    resultPresets: string[];
  }) => Promise<boolean>;
  handleDeleteCategory: (input: {
    id: string;
    name: string;
  }) => Promise<boolean>;
};

export const useMiniTestsPageActions = ({
  selectedExamId,
  isEditMode,
  isSaving,
  students,
  includedAssignments,
  currentSelections,
  assignmentSearchQuery,
  editingCategoryId,
  editingCategoryName,
  editingPresetInput,
  editingPresetDrafts,
  categories,
  setIsSaving,
  setExamFinalizedMap,
  setIsEditMode,
  setFeedbackMessage,
  setIsCategoryApplyFeedback,
  setAssignmentDataVersion,
  setResultSearchTerm,
  setShowOnlyMissingResults,
  setIsResultModalOpen,
  setSelectionsByExam,
  setAssignmentSearchQuery,
  setIsTargetSelectorOpen,
  setIsAdvancedCategoryOpen,
  setAssignmentTitle,
  setEditingCategoryId,
  setEditingCategoryName,
  setEditingPresetDrafts,
  setEditingPresetInput,
  setEditingError,
  showConfirm,
  showAlert,
  handleOpenModal,
  handleSaveModal,
  handleUpdateCategory,
  handleDeleteCategory,
}: UseMiniTestsPageActionsParams) => {
  const handleQuickEdit = () => {
    if (!isEditMode) return;

    setAssignmentSearchQuery("");
    setIsTargetSelectorOpen(false);
    setIsAdvancedCategoryOpen(false);
    handleOpenModal(selectedExamId || undefined);
  };

  const handlePrefillAssignmentTitleFromSearch = () => {
    const nextTitle = assignmentSearchQuery.trim();
    if (!nextTitle) return;

    setAssignmentTitle(nextTitle);
    setAssignmentSearchQuery("");
  };

  const handleOpenResultModal = () => {
    setResultSearchTerm("");
    setShowOnlyMissingResults(false);
    setIsResultModalOpen(true);
  };

  const handleSelectionChange = (
    studentId: string,
    assignmentId: string,
    resultIndex: number | null
  ) => {
    if (!selectedExamId || !isEditMode) return;

    setSelectionsByExam((prev) => ({
      ...prev,
      [selectedExamId]: {
        ...(prev[selectedExamId] ?? {}),
        [studentId]: {
          ...(prev[selectedExamId]?.[studentId] ?? {}),
          [assignmentId]: resultIndex,
        },
      },
    }));
  };

  const handleSaveAll = async () => {
    if (isSaving || !isEditMode) return;

    const shouldSave = await showConfirm({
      title: "최종 저장하시겠습니까?",
      description: "현재 입력한 미니테스트 결과를 저장합니다.",
      confirmText: "확인",
      cancelText: "취소",
    });

    if (!shouldSave) return;

    setIsSaving(true);
    try {
      const items = students.flatMap((student) =>
        includedAssignments.map((assignment) => ({
          assignmentId: assignment.id,
          lectureEnrollmentId: student.id,
          resultIndex: currentSelections[student.id]?.[assignment.id] ?? null,
        }))
      );

      await upsertAssignmentResultsAPI({
        options: { strict: true },
        items,
      });

      if (selectedExamId) {
        setExamFinalizedMap((prev) => ({
          ...prev,
          [selectedExamId]: true,
        }));
      }

      setIsEditMode(false);
      setFeedbackMessage(
        "최종 저장이 완료되었습니다. 수정 버튼으로 다시 편집할 수 있습니다."
      );
      setIsCategoryApplyFeedback(true);
    } catch (error) {
      console.error("Failed to save mini test results", error);
      setFeedbackMessage("저장에 실패했습니다. 잠시 후 다시 시도해주세요.");
      setIsCategoryApplyFeedback(true);
      await showAlert({
        title: "저장 실패",
        description: "미니테스트 결과 저장 중 오류가 발생했습니다.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleQuickSaveModal = async () => {
    const saved = await handleSaveModal({ closeAfterSave: true });
    if (!saved) return;

    setFeedbackMessage("포함 과제 설정이 적용되었습니다.");
    setIsCategoryApplyFeedback(true);
    setAssignmentDataVersion((prev) => prev + 1);
  };

  const handleOpenAssignmentCreationGuide = async () => {
    await showAlert({
      title: "과제 생성 안내",
      description:
        "여기서 과제를 바로 만들 수 있어요.\n만든 과제는 현재 시험에 바로 추가됩니다.\n마지막으로 아래 저장 버튼을 누르면 완료됩니다.",
    });
  };

  const handleEnableEditMode = () => {
    if (selectedExamId) {
      setExamFinalizedMap((prev) => ({
        ...prev,
        [selectedExamId]: false,
      }));
    }
    setIsEditMode(true);
    setFeedbackMessage("수정 모드가 활성화되었습니다.");
    setIsCategoryApplyFeedback(true);
  };

  const handleStartEditCategory = (category: EditableCategory) => {
    setEditingCategoryId(category.id);
    setEditingCategoryName(category.name);
    setEditingPresetDrafts(category.presets);
    setEditingPresetInput("");
    setEditingError(null);
  };

  const handleCancelEditCategory = () => {
    setEditingCategoryId(null);
    setEditingCategoryName("");
    setEditingPresetInput("");
    setEditingPresetDrafts([]);
    setEditingError(null);
  };

  const handlePushEditPreset = () => {
    const nextPreset = editingPresetInput.trim();

    if (!nextPreset) {
      setEditingError("프리셋 값을 입력해주세요.");
      return;
    }

    if (editingPresetDrafts.includes(nextPreset)) {
      setEditingError("동일한 프리셋이 이미 추가되어 있습니다.");
      setEditingPresetInput("");
      return;
    }

    setEditingPresetDrafts((prev) => [...prev, nextPreset]);
    setEditingPresetInput("");
    setEditingError(null);
  };

  const handleRemoveEditPreset = (preset: string) => {
    setEditingPresetDrafts((prev) => prev.filter((value) => value !== preset));
    setEditingError(null);
  };

  const handleSubmitEditCategory = async () => {
    if (!editingCategoryId) return;

    const normalizedName = editingCategoryName.trim();
    const pendingPreset = editingPresetInput.trim();
    const nextPresetDrafts = [...editingPresetDrafts];

    if (pendingPreset && !nextPresetDrafts.includes(pendingPreset)) {
      nextPresetDrafts.push(pendingPreset);
    }

    if (!normalizedName) {
      setEditingError("카테고리 이름을 입력해주세요.");
      return;
    }

    if (nextPresetDrafts.length === 0) {
      setEditingError("프리셋을 1개 이상 추가해주세요.");
      return;
    }

    const duplicatedCategoryName = categories.some(
      (category) =>
        category.id !== editingCategoryId &&
        category.name.trim().toLowerCase() === normalizedName.toLowerCase()
    );

    if (duplicatedCategoryName) {
      setEditingError("같은 이름의 카테고리가 이미 있습니다.");
      return;
    }

    const updated = await handleUpdateCategory({
      id: editingCategoryId,
      name: normalizedName,
      resultPresets: nextPresetDrafts,
    });

    if (!updated) return;

    handleCancelEditCategory();
  };

  const handleClickDeleteCategory = async ({
    id,
    name,
  }: {
    id: string;
    name: string;
  }) => {
    const deleted = await handleDeleteCategory({ id, name });

    if (!deleted) return;

    if (editingCategoryId === id) {
      handleCancelEditCategory();
    }
  };

  return {
    handleQuickEdit,
    handlePrefillAssignmentTitleFromSearch,
    handleOpenResultModal,
    handleSelectionChange,
    handleSaveAll,
    handleQuickSaveModal,
    handleOpenAssignmentCreationGuide,
    handleEnableEditMode,
    handleStartEditCategory,
    handleCancelEditCategory,
    handlePushEditPreset,
    handleRemoveEditPreset,
    handleSubmitEditCategory,
    handleClickDeleteCategory,
  };
};
