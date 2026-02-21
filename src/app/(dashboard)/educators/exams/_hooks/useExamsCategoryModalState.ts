"use client";

import { useEffect, useMemo, useState } from "react";

import type { Exam } from "@/types/exams";

export type PresetSnippet = {
  label: string;
  values: string[];
};

export type ReportCategory = {
  id: string;
  name: string;
  presets: string[];
};

type ClassOption = {
  key: string;
  name: string;
  examCount: number;
};

type ExamItemMap = Record<string, string[]>;

export type ReportAssignmentOption = {
  id: string;
  title: string;
  categoryId: string;
  categoryName: string;
  presets: string[];
};

export const PRESET_SNIPPETS: PresetSnippet[] = [
  { label: "O/X", values: ["O", "X"] },
  { label: "A/B/C/D", values: ["A", "B", "C", "D"] },
  { label: "상/중/하", values: ["상", "중", "하"] },
];

export const getClassKey = (exam: Pick<Exam, "lectureId" | "lectureName">) =>
  exam.lectureId ? `lecture:${exam.lectureId}` : `name:${exam.lectureName}`;

const isExamInClass = (exam: Exam, classKey: string) => {
  if (classKey.startsWith("lecture:")) {
    return `lecture:${exam.lectureId ?? ""}` === classKey;
  }

  return `name:${exam.lectureName}` === classKey;
};

export const useExamsCategoryModalState = ({ exams }: { exams: Exam[] }) => {
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isFetchingCategories, setIsFetchingCategories] = useState(false);
  const [isFetchingAssignments, setIsFetchingAssignments] = useState(false);
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const [isCreatingAssignment, setIsCreatingAssignment] = useState(false);
  const [isUpdatingCategory, setIsUpdatingCategory] = useState(false);
  const [isDeletingCategory, setIsDeletingCategory] = useState(false);
  const [isDeletingAssignment, setIsDeletingAssignment] = useState(false);
  const [deletingAssignmentId, setDeletingAssignmentId] = useState<
    string | null
  >(null);
  const [isSavingAssignments, setIsSavingAssignments] = useState(false);
  const [categories, setCategories] = useState<ReportCategory[]>([]);
  const [availableAssignments, setAvailableAssignments] = useState<
    ReportAssignmentOption[]
  >([]);
  const [examAssignmentMap, setExamAssignmentMap] = useState<ExamItemMap>({});
  const [selectedClassKey, setSelectedClassKey] = useState<string>("");
  const [classSearchQuery, setClassSearchQuery] = useState("");
  const [selectedExamId, setSelectedExamId] = useState<string>("");
  const [examSearchQuery, setExamSearchQuery] = useState("");
  const [showIncludedOnly, setShowIncludedOnly] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [assignmentTitle, setAssignmentTitle] = useState("");
  const [assignmentCategoryId, setAssignmentCategoryId] = useState("");
  const [presetInput, setPresetInput] = useState("");
  const [presetDrafts, setPresetDrafts] = useState<string[]>([]);
  const [createError, setCreateError] = useState<string | null>(null);
  const [createAssignmentError, setCreateAssignmentError] = useState<
    string | null
  >(null);
  const [
    baselineExamAssignmentMapSerialized,
    setBaselineExamAssignmentMapSerialized,
  ] = useState(() => JSON.stringify({}));

  const normalizedCategoryName = categoryName.trim();
  const normalizedAssignmentTitle = assignmentTitle.trim();
  const canCreateCategory =
    normalizedCategoryName.length > 0 &&
    (presetDrafts.length > 0 || presetInput.trim().length > 0);
  const canCreateAssignment =
    normalizedAssignmentTitle.length > 0 && assignmentCategoryId.length > 0;

  const classOptions = useMemo<ClassOption[]>(() => {
    const map = new Map<string, ClassOption>();

    exams.forEach((exam) => {
      const key = getClassKey(exam);
      const current = map.get(key);

      if (current) {
        map.set(key, { ...current, examCount: current.examCount + 1 });
        return;
      }

      map.set(key, {
        key,
        name: exam.lectureName || "수업 미지정",
        examCount: 1,
      });
    });

    return Array.from(map.values()).sort((a, b) =>
      a.name.localeCompare(b.name, "ko")
    );
  }, [exams]);

  const effectiveClassKey = selectedClassKey || classOptions[0]?.key || "";
  const normalizedClassSearchQuery = classSearchQuery.trim().toLowerCase();
  const filteredClassOptions = useMemo(
    () =>
      classOptions.filter((option) =>
        option.name.toLowerCase().includes(normalizedClassSearchQuery)
      ),
    [classOptions, normalizedClassSearchQuery]
  );

  const examsInSelectedClass = useMemo(
    () =>
      effectiveClassKey
        ? exams.filter((exam) => isExamInClass(exam, effectiveClassKey))
        : [],
    [effectiveClassKey, exams]
  );
  const normalizedExamSearchQuery = examSearchQuery.trim().toLowerCase();
  const filteredExamsInSelectedClass = useMemo(
    () =>
      examsInSelectedClass.filter((exam) =>
        [exam.name, exam.registrationDate]
          .join(" ")
          .toLowerCase()
          .includes(normalizedExamSearchQuery)
      ),
    [examsInSelectedClass, normalizedExamSearchQuery]
  );
  const classSelectValue = filteredClassOptions.some(
    (option) => option.key === effectiveClassKey
  )
    ? effectiveClassKey
    : undefined;

  const selectedExam = useMemo(
    () =>
      examsInSelectedClass.find((exam) => exam.id === selectedExamId) ??
      examsInSelectedClass[0] ??
      null,
    [examsInSelectedClass, selectedExamId]
  );

  const effectiveExamId = selectedExam?.id ?? "";
  const examSelectValue = filteredExamsInSelectedClass.some(
    (exam) => exam.id === effectiveExamId
  )
    ? effectiveExamId
    : undefined;

  const includedAssignmentIds = useMemo(
    () =>
      effectiveExamId.length > 0
        ? (examAssignmentMap[effectiveExamId] ?? [])
        : [],
    [effectiveExamId, examAssignmentMap]
  );

  const includedCategoryIds = useMemo(() => {
    if (effectiveExamId.length === 0) return [];

    const includedSet = new Set(includedAssignmentIds);

    return Array.from(
      new Set(
        availableAssignments
          .filter((assignment) => includedSet.has(assignment.id))
          .map((assignment) => assignment.categoryId)
      )
    );
  }, [availableAssignments, effectiveExamId, includedAssignmentIds]);

  const visibleCategories = useMemo(
    () =>
      showIncludedOnly
        ? categories.filter((category) =>
            includedCategoryIds.includes(category.id)
          )
        : categories,
    [categories, includedCategoryIds, showIncludedOnly]
  );

  const visibleAssignments = useMemo(
    () =>
      showIncludedOnly
        ? availableAssignments.filter((assignment) =>
            includedAssignmentIds.includes(assignment.id)
          )
        : availableAssignments,
    [availableAssignments, includedAssignmentIds, showIncludedOnly]
  );

  const currentExamAssignmentMapSerialized = useMemo(
    () => JSON.stringify(examAssignmentMap),
    [examAssignmentMap]
  );
  const baselineExamAssignmentMap = useMemo<ExamItemMap>(() => {
    try {
      const parsed = JSON.parse(baselineExamAssignmentMapSerialized);
      if (!parsed || typeof parsed !== "object") return {};
      return parsed as ExamItemMap;
    } catch {
      return {};
    }
  }, [baselineExamAssignmentMapSerialized]);
  const hasPendingAssignmentChanges =
    currentExamAssignmentMapSerialized !== baselineExamAssignmentMapSerialized;
  const pendingAssignmentDeltaCount = useMemo(() => {
    if (!effectiveExamId) return 0;

    const currentSet = new Set(examAssignmentMap[effectiveExamId] ?? []);
    const baselineSet = new Set(
      baselineExamAssignmentMap[effectiveExamId] ?? []
    );
    let delta = 0;

    currentSet.forEach((id) => {
      if (!baselineSet.has(id)) delta += 1;
    });
    baselineSet.forEach((id) => {
      if (!currentSet.has(id)) delta += 1;
    });

    return delta;
  }, [baselineExamAssignmentMap, effectiveExamId, examAssignmentMap]);
  const hasPendingChanges = hasPendingAssignmentChanges;
  const isBusy =
    isFetchingCategories ||
    isFetchingAssignments ||
    isCreatingCategory ||
    isCreatingAssignment ||
    isUpdatingCategory ||
    isDeletingCategory ||
    isDeletingAssignment ||
    isSavingAssignments;

  const duplicatedCategoryName = useMemo(
    () =>
      categories.some(
        (category) =>
          category.name.trim().toLowerCase() ===
          normalizedCategoryName.toLowerCase()
      ),
    [categories, normalizedCategoryName]
  );

  useEffect(() => {
    if (!isCategoryModalOpen) return;

    if (classOptions.length === 0) {
      if (selectedClassKey || selectedExamId) {
        queueMicrotask(() => {
          setSelectedClassKey("");
          setSelectedExamId("");
        });
      }
      return;
    }

    const hasSelectedClass = classOptions.some(
      (option) => option.key === effectiveClassKey
    );

    if (!hasSelectedClass) {
      queueMicrotask(() => {
        setSelectedClassKey(classOptions[0].key);
      });
    }
  }, [
    classOptions,
    effectiveClassKey,
    isCategoryModalOpen,
    selectedClassKey,
    selectedExamId,
  ]);

  useEffect(() => {
    if (!isCategoryModalOpen) return;

    if (examsInSelectedClass.length === 0) {
      if (selectedExamId) {
        queueMicrotask(() => {
          setSelectedExamId("");
        });
      }
      return;
    }

    const hasSelectedExam = examsInSelectedClass.some(
      (exam) => exam.id === selectedExamId
    );

    if (!hasSelectedExam) {
      queueMicrotask(() => {
        setSelectedExamId(examsInSelectedClass[0].id);
      });
    }
  }, [examsInSelectedClass, isCategoryModalOpen, selectedExamId]);

  useEffect(() => {
    if (!isCategoryModalOpen) return;

    if (categories.length === 0) {
      if (assignmentCategoryId.length > 0) {
        queueMicrotask(() => {
          setAssignmentCategoryId("");
        });
      }
      return;
    }

    const hasSelectedCategory = categories.some(
      (category) => category.id === assignmentCategoryId
    );

    if (!hasSelectedCategory) {
      queueMicrotask(() => {
        setAssignmentCategoryId(categories[0].id);
      });
    }
  }, [assignmentCategoryId, categories, isCategoryModalOpen]);

  return {
    isCategoryModalOpen,
    setIsCategoryModalOpen,
    isFetchingCategories,
    setIsFetchingCategories,
    isFetchingAssignments,
    setIsFetchingAssignments,
    isCreatingCategory,
    setIsCreatingCategory,
    isCreatingAssignment,
    setIsCreatingAssignment,
    isUpdatingCategory,
    setIsUpdatingCategory,
    isDeletingCategory,
    setIsDeletingCategory,
    isDeletingAssignment,
    setIsDeletingAssignment,
    deletingAssignmentId,
    setDeletingAssignmentId,
    isSavingAssignments,
    setIsSavingAssignments,
    categories,
    setCategories,
    availableAssignments,
    setAvailableAssignments,
    examAssignmentMap,
    setExamAssignmentMap,
    selectedClassKey,
    setSelectedClassKey,
    classSearchQuery,
    setClassSearchQuery,
    selectedExamId,
    setSelectedExamId,
    examSearchQuery,
    setExamSearchQuery,
    showIncludedOnly,
    setShowIncludedOnly,
    categoryName,
    setCategoryName,
    assignmentTitle,
    setAssignmentTitle,
    assignmentCategoryId,
    setAssignmentCategoryId,
    presetInput,
    setPresetInput,
    presetDrafts,
    setPresetDrafts,
    createError,
    setCreateError,
    createAssignmentError,
    setCreateAssignmentError,
    baselineExamAssignmentMapSerialized,
    setBaselineExamAssignmentMapSerialized,
    canCreateCategory,
    canCreateAssignment,
    classOptions,
    classSelectValue,
    filteredClassOptions,
    examsInSelectedClass,
    examSelectValue,
    filteredExamsInSelectedClass,
    selectedExam,
    effectiveExamId,
    includedCategoryIds,
    visibleCategories,
    includedAssignmentIds,
    visibleAssignments,
    hasPendingChanges,
    hasPendingAssignmentChanges,
    pendingAssignmentDeltaCount,
    isBusy,
    duplicatedCategoryName,
    normalizedCategoryName,
  };
};

export type ExamsCategoryModalState = ReturnType<
  typeof useExamsCategoryModalState
>;
