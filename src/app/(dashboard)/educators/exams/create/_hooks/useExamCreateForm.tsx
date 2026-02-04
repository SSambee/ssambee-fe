"use client";

import { useRouter } from "next/navigation";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useModal } from "@/providers/ModalProvider";
import { CheckModal } from "@/components/common/modals/CheckModal";
import {
  examFormSchema,
  type ExamFormInput,
} from "@/validation/exam.validation";
import { EXAM_FORM_DEFAULTS } from "@/constants/exams.constants";

import { useExamSelectionState } from "./useExamSelectionState";
import { useExamQuestions } from "./useExamQuestions";
import { useExamSubmit } from "./useExamSubmit";

export const useExamCreateForm = () => {
  const router = useRouter();
  const { openModal } = useModal();

  const examForm = useForm<ExamFormInput>({
    resolver: zodResolver(examFormSchema),
    mode: "onChange",
    defaultValues: EXAM_FORM_DEFAULTS,
  });

  const { control } = examForm;
  const { fields, replace } = useFieldArray({
    control,
    name: "questions",
    keyName: "fieldId",
  });

  const selection = useExamSelectionState({
    form: examForm,
    replaceQuestions: replace,
  });

  const questions = useExamQuestions({
    form: examForm,
    replaceQuestions: replace,
  });

  const submit = useExamSubmit({
    form: examForm,
    isEditing: selection.isEditing,
    selectedExamId: selection.selectedExamId,
    activeLectureId: selection.activeLectureId,
  });

  const isExamDetailLoading =
    selection.isEditing && selection.isExamDetailPending;
  const isReadOnly = selection.isEditing && !selection.isEditMode;
  const isFormDisabled =
    submit.isSubmitting || isExamDetailLoading || isReadOnly;
  const isSelectDisabled = submit.isSubmitting || isExamDetailLoading;

  const openBackModal = () => {
    openModal(
      <CheckModal
        title="작성한 내용이 저장되지 않습니다."
        description="정말 뒤로가시겠어요?"
        confirmText="뒤로가기"
        cancelText="계속 작성"
        onConfirm={() => router.back()}
      />
    );
  };

  return {
    examForm,
    fields,
    lectures: selection.lectures,
    examsByLecture: selection.examsByLecture,
    activeLectureId: selection.activeLectureId,
    selectedExamId: selection.selectedExamId,
    isEditMode: selection.isEditMode,
    isEditing: selection.isEditing,
    isReadOnly,
    isSubmitting: submit.isSubmitting,
    isFormDisabled,
    isSelectDisabled,
    isLecturesPending: selection.isLecturesPending,
    isExamsByLecturePending: selection.isExamsByLecturePending,
    totalQuestions: questions.totalQuestions,
    totalScore: questions.totalScore,
    autoScore: questions.autoScore,
    questionsErrorMessage: questions.questionsErrorMessage,
    handleLectureSelection: selection.handleLectureSelection,
    handleExamSelection: selection.handleExamSelection,
    handleAddQuestion: questions.handleAddQuestion,
    handleRemoveQuestion: questions.handleRemoveQuestion,
    handleAutoScoreChange: questions.handleAutoScoreChange,
    handleManualScoreChange: questions.handleManualScoreChange,
    handleSave: submit.handleSave,
    openBackModal,
    startEdit: () => selection.setIsEditMode(true),
  };
};
