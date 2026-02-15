"use client";

import { useEffect, useMemo, useState } from "react";

import type {
  ExamCategoryMap,
  ReportCategory,
  ReportStudentSelections,
} from "@/services/exams/report-category-persistence.service";
import type { Exam } from "@/types/exams";

export type PresetSnippet = {
  label: string;
  values: string[];
};

type ClassOption = {
  key: string;
  name: string;
  examCount: number;
};

export type ReportCategoryModalStorage = {
  categories: ReportCategory[];
  examCategoryMap: ExamCategoryMap;
  studentSelections: ReportStudentSelections;
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

export const useExamsCategoryModalState = ({
  exams,
  initialStorage,
}: {
  exams: Exam[];
  initialStorage: ReportCategoryModalStorage;
}) => {
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isFetchingCategories, setIsFetchingCategories] = useState(false);
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const [categories, setCategories] = useState<ReportCategory[]>(
    initialStorage.categories
  );
  const [examCategoryMap, setExamCategoryMap] = useState<ExamCategoryMap>(
    initialStorage.examCategoryMap
  );
  const [studentSelections] = useState<ReportStudentSelections>(
    initialStorage.studentSelections
  );
  const [selectedClassKey, setSelectedClassKey] = useState<string>("");
  const [classSearchQuery, setClassSearchQuery] = useState("");
  const [selectedExamId, setSelectedExamId] = useState<string>("");
  const [examSearchQuery, setExamSearchQuery] = useState("");
  const [showIncludedOnly, setShowIncludedOnly] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [presetInput, setPresetInput] = useState("");
  const [presetDrafts, setPresetDrafts] = useState<string[]>([]);
  const [createError, setCreateError] = useState<string | null>(null);
  const [baselineCategoriesSerialized, setBaselineCategoriesSerialized] =
    useState(() => JSON.stringify(initialStorage.categories));
  const [baselineExamMapSerialized, setBaselineExamMapSerialized] = useState(
    () => JSON.stringify(initialStorage.examCategoryMap)
  );

  const normalizedCategoryName = categoryName.trim();
  const canCreateCategory =
    normalizedCategoryName.length > 0 &&
    (presetDrafts.length > 0 || presetInput.trim().length > 0);

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

  const includedCategoryIds = useMemo(
    () =>
      effectiveExamId.length > 0
        ? (examCategoryMap[effectiveExamId] ?? [])
        : [],
    [effectiveExamId, examCategoryMap]
  );

  const visibleCategories = useMemo(
    () =>
      showIncludedOnly
        ? categories.filter((category) =>
            includedCategoryIds.includes(category.id)
          )
        : categories,
    [categories, includedCategoryIds, showIncludedOnly]
  );

  const currentCategoriesSerialized = useMemo(
    () => JSON.stringify(categories),
    [categories]
  );
  const currentExamMapSerialized = useMemo(
    () => JSON.stringify(examCategoryMap),
    [examCategoryMap]
  );
  const hasPendingChanges =
    currentCategoriesSerialized !== baselineCategoriesSerialized ||
    currentExamMapSerialized !== baselineExamMapSerialized;
  const isBusy = isFetchingCategories || isCreatingCategory;

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

  return {
    isCategoryModalOpen,
    setIsCategoryModalOpen,
    isFetchingCategories,
    setIsFetchingCategories,
    isCreatingCategory,
    setIsCreatingCategory,
    categories,
    setCategories,
    examCategoryMap,
    setExamCategoryMap,
    studentSelections,
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
    presetInput,
    setPresetInput,
    presetDrafts,
    setPresetDrafts,
    createError,
    setCreateError,
    baselineCategoriesSerialized,
    setBaselineCategoriesSerialized,
    baselineExamMapSerialized,
    setBaselineExamMapSerialized,
    canCreateCategory,
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
    hasPendingChanges,
    isBusy,
    duplicatedCategoryName,
    normalizedCategoryName,
  };
};

export type ExamsCategoryModalState = ReturnType<
  typeof useExamsCategoryModalState
>;
