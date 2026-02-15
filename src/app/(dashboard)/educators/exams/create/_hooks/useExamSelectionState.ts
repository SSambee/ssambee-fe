"use client";

import { useEffect, useRef, useState } from "react";
import type { UseFormReturn } from "react-hook-form";

import { useLecturesList } from "@/hooks/lectures/useLecturesList";
import { useExamsByLecture } from "@/hooks/exams/useExamsByLecture";
import { useExamDetail } from "@/hooks/exams/useExamDetail";
import { useDialogAlert } from "@/hooks/useDialogAlert";
import { mapExamDetailToFormInput } from "@/services/exams/exams.mapper";
import { EXAM_FORM_DEFAULTS } from "@/constants/exams.constants";
import type { ExamFormInput } from "@/validation/exam.validation";

type UseExamSelectionStateParams = {
  form: UseFormReturn<ExamFormInput>;
  replaceQuestions: (value: ExamFormInput["questions"]) => void;
};

export const useExamSelectionState = ({
  form,
  replaceQuestions,
}: UseExamSelectionStateParams) => {
  const [selectedLectureId, setSelectedLectureId] = useState<string>("");
  const [selectedExamId, setSelectedExamId] = useState<string>("new");
  const [isEditMode, setIsEditMode] = useState(true);
  const { showConfirm } = useDialogAlert();
  const lastSyncedRef = useRef<{ examId?: string; lectureSubject?: string }>(
    {}
  );

  const { data: lecturesData, isPending: isLecturesPending } = useLecturesList({
    page: 1,
    limit: 100,
  });
  const lectures = lecturesData?.lectures ?? [];
  const activeLectureId = selectedLectureId || lectures[0]?.id || "";
  const isEditing = selectedExamId !== "new";

  useEffect(() => {
    if (!activeLectureId || isEditing) return;
    const currentLectureId = form.getValues("lectureId");
    if (currentLectureId !== activeLectureId) {
      form.setValue("lectureId", activeLectureId, {
        shouldValidate: true,
      });
    }
  }, [activeLectureId, form, isEditing]);

  const { data: examsByLecture = [], isPending: isExamsByLecturePending } =
    useExamsByLecture(activeLectureId);

  const { data: examDetail, isPending: isExamDetailPending } = useExamDetail(
    selectedExamId,
    isEditing
  );

  useEffect(() => {
    if (!isEditing || !examDetail || isEditMode) return;

    const lectureList = lecturesData?.lectures ?? [];
    const lectureSubject =
      lectureList.find((lecture) => lecture.id === examDetail.lectureId)
        ?.subject ?? "";
    const lastSynced = lastSyncedRef.current;
    const shouldSync =
      lastSynced.examId !== examDetail.id ||
      (lectureSubject && lectureSubject !== lastSynced.lectureSubject);

    if (!shouldSync) return;

    lastSyncedRef.current = {
      examId: examDetail.id,
      lectureSubject,
    };

    const mapped = mapExamDetailToFormInput(examDetail, {
      lectureSubject: lectureSubject || form.getValues("subject") || "",
      isAutoClinic: form.getValues("isAutoClinic"),
      autoScore: form.getValues("autoScore"),
      category: form.getValues("category"),
      examDate: form.getValues("examDate"),
    });

    form.reset(mapped, { keepDefaultValues: true });
    form.setValue("name", mapped.name);
    form.setValue("subject", mapped.subject);
    form.setValue("category", mapped.category ?? "");
    form.setValue("examDate", mapped.examDate);
    form.setValue("lectureId", mapped.lectureId);
    form.setValue("source", mapped.source ?? "");
    form.setValue("passScore", mapped.passScore);
    form.setValue("isAutoClinic", mapped.isAutoClinic);
    replaceQuestions(mapped.questions);
  }, [examDetail, form, isEditing, isEditMode, lecturesData, replaceQuestions]);

  const handleLectureSelection = async (value: string) => {
    if (!value || value === activeLectureId) return;
    if (form.formState.isDirty) {
      const confirmed = await showConfirm({
        title: "수업 변경 확인",
        description:
          "작성 중인 내용이 있습니다. 수업을 변경하면 내용이 초기화됩니다. 계속할까요?",
        confirmText: "변경",
        cancelText: "취소",
      });
      if (!confirmed) return;
    }

    setSelectedLectureId(value);
    setSelectedExamId("new");
    setIsEditMode(true);
    lastSyncedRef.current = {};
    form.reset({
      ...EXAM_FORM_DEFAULTS,
      lectureId: value,
    });
    replaceQuestions([]);
  };

  const handleExamSelection = (value: string) => {
    if (value === "new") {
      setSelectedExamId("new");
      setIsEditMode(true);
      lastSyncedRef.current = {};
      const lectureId = activeLectureId;
      form.reset({
        ...EXAM_FORM_DEFAULTS,
        lectureId,
      });
      replaceQuestions([]);
      return;
    }

    setSelectedExamId(value);
    setIsEditMode(false);
  };

  return {
    lectures,
    examsByLecture,
    activeLectureId,
    selectedExamId,
    isEditMode,
    isEditing,
    setIsEditMode,
    isLecturesPending,
    isExamsByLecturePending,
    isExamDetailPending,
    handleLectureSelection,
    handleExamSelection,
  };
};
