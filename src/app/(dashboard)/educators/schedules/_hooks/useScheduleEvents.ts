"use client";

import {
  createElement,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { View } from "react-big-calendar";
import { isSameDay } from "date-fns";

import { CheckModal } from "@/components/common/modals/CheckModal";
import { useModal } from "@/app/providers/ModalProvider";
import {
  buildSchedulesRangeQuery,
  mapScheduleApiToCalendarEvent,
  normalizeScheduleCategories,
  OTHER_CATEGORY_KEY,
} from "@/services/schedules/schedules.mapper";
import {
  createScheduleCategoryAPI,
  deleteScheduleCategoryAPI,
  fetchScheduleCategoriesAPI,
  fetchSchedulesAPI,
  updateScheduleAPI,
  updateScheduleCategoryAPI,
} from "@/services/schedules/schedules.service";
import { useScheduleEditor } from "@/app/(dashboard)/educators/schedules/_hooks/useScheduleEditor";
import { useScheduleTimetable } from "@/app/(dashboard)/educators/schedules/_hooks/useScheduleTimetable";
import type {
  ScheduleApi,
  ScheduleCalendarEvent,
  ScheduleCategoryCreateState,
  ScheduleCategoryEditState,
  ScheduleCategoryOption,
  ScheduleFilters,
} from "@/types/schedules";

const HEX_COLOR_REGEX = /^#[0-9a-fA-F]{6}$/;
const DEFAULT_CATEGORY_COLOR = "#3863F6";

const CATEGORY_MIGRATION_RANGE = {
  startTime: "2000-01-01T00:00:00.000Z",
  endTime: "2100-12-31T23:59:59.999Z",
};

const CATEGORY_MIGRATION_BATCH_SIZE = 8;

const syncFiltersWithCategories = (
  prev: ScheduleFilters,
  categories: ScheduleCategoryOption[]
) => {
  const next: ScheduleFilters = {};

  categories.forEach((category) => {
    next[category.id] = prev[category.id] ?? true;
  });

  return next;
};

const getErrorMessage = (error: unknown) => {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return "일정을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.";
};

const getCategoryCreateErrorMessage = (error: unknown) => {
  const normalizedError = error as {
    response?: { data?: { message?: string } };
    message?: string;
  };

  if (typeof normalizedError.response?.data?.message === "string") {
    return normalizedError.response.data.message;
  }

  if (typeof normalizedError.message === "string" && normalizedError.message) {
    return normalizedError.message;
  }

  return "카테고리 생성에 실패했습니다. 잠시 후 다시 시도해 주세요.";
};

const getCategoryActionErrorMessage = (error: unknown) => {
  const normalizedError = error as {
    response?: { data?: { message?: string } };
    message?: string;
  };

  if (typeof normalizedError.response?.data?.message === "string") {
    return normalizedError.response.data.message;
  }

  if (typeof normalizedError.message === "string" && normalizedError.message) {
    return normalizedError.message;
  }

  return "카테고리 처리에 실패했습니다. 잠시 후 다시 시도해 주세요.";
};

const migrateSchedulesToOtherCategory = async (
  schedules: ScheduleApi[]
): Promise<string[]> => {
  const failedIds: string[] = [];

  for (
    let index = 0;
    index < schedules.length;
    index += CATEGORY_MIGRATION_BATCH_SIZE
  ) {
    const batch = schedules.slice(index, index + CATEGORY_MIGRATION_BATCH_SIZE);

    const batchResults = await Promise.allSettled(
      batch.map((schedule) => {
        return updateScheduleAPI(schedule.id, {
          categoryId: null,
        });
      })
    );

    batchResults.forEach((result, resultIndex) => {
      if (result.status === "rejected") {
        failedIds.push(batch[resultIndex].id);
      }
    });
  }

  return failedIds;
};

export function useScheduleEvents() {
  const { openModal } = useModal();
  const {
    timetableOpen,
    setTimetableOpen,
    timetableEntries,
    timetableMeta,
    isTimetableLoading,
    timetableError,
  } = useScheduleTimetable();

  const [events, setEvents] = useState<ScheduleCalendarEvent[]>([]);
  const [categories, setCategories] = useState<ScheduleCategoryOption[]>([]);
  const [view, setView] = useState<View>("month");
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isSchedulesLoading, setIsSchedulesLoading] = useState(false);

  const [isCategoryCreating, setIsCategoryCreating] = useState(false);
  const [isCategoryUpdating, setIsCategoryUpdating] = useState(false);
  const [isCategoryDeleting, setIsCategoryDeleting] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [deletingCategoryId, setDeletingCategoryId] = useState<string | null>(
    null
  );

  const [categoryCreateState, setCategoryCreateState] =
    useState<ScheduleCategoryCreateState>({
      name: "",
      color: DEFAULT_CATEGORY_COLOR,
    });
  const [categoryCreateError, setCategoryCreateError] = useState<string | null>(
    null
  );
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(
    null
  );
  const [categoryEditState, setCategoryEditState] =
    useState<ScheduleCategoryEditState>({
      name: "",
      color: DEFAULT_CATEGORY_COLOR,
    });
  const [categoryUpdateError, setCategoryUpdateError] = useState<string | null>(
    null
  );
  const [filters, setFilters] = useState<ScheduleFilters>({
    [OTHER_CATEGORY_KEY]: true,
  });

  const categoryMap = useMemo(
    () => new Map(categories.map((category) => [category.id, category])),
    [categories]
  );

  const categoryLabelMap = useMemo(() => {
    return categories.reduce<Record<string, string>>((acc, category) => {
      acc[category.id] = category.name;
      return acc;
    }, {});
  }, [categories]);

  const filteredEvents = useMemo(
    () =>
      events.filter(
        (event) =>
          filters[event.categoryKey] ?? filters[OTHER_CATEGORY_KEY] ?? true
      ),
    [events, filters]
  );

  const todayEvents = useMemo(() => {
    const today = new Date();

    return filteredEvents
      .filter((event) => isSameDay(event.start, today))
      .sort((a, b) => a.start.getTime() - b.start.getTime());
  }, [filteredEvents]);

  const loadSchedules = useCallback(async () => {
    setIsSchedulesLoading(true);

    try {
      const query = buildSchedulesRangeQuery(currentDate, view);
      const schedules = await fetchSchedulesAPI(query);

      const mappedEvents = schedules
        .map((schedule) => mapScheduleApiToCalendarEvent(schedule, categoryMap))
        .filter((event): event is ScheduleCalendarEvent => event !== null);

      setEvents(mappedEvents);
      setLoadError(null);
    } catch (error) {
      setEvents([]);
      setLoadError(getErrorMessage(error));
    } finally {
      setIsSchedulesLoading(false);
    }
  }, [categoryMap, currentDate, view]);

  const defaultCategoryId = useMemo(() => {
    return categories[0]?.id ?? OTHER_CATEGORY_KEY;
  }, [categories]);

  const {
    createOpen,
    scheduleModalMode,
    editingScheduleId,
    formError,
    setFormError,
    formState,
    setFormState,
    isScheduleCreating,
    isScheduleUpdating,
    isScheduleDeleting,
    openCreateScheduleModal,
    closeCreateScheduleModal,
    handleStartScheduleEdit,
    enableScheduleEdit,
    handleCreateSubmit,
    handleDeleteSchedule,
  } = useScheduleEditor({
    defaultCategoryId,
    isCategoryActionInProgress:
      isCategoryCreating || isCategoryUpdating || isCategoryDeleting,
    loadSchedules,
    onFocusDate: setCurrentDate,
  });

  const loadCategories = useCallback(async () => {
    try {
      const apiCategories = await fetchScheduleCategoriesAPI();
      const normalizedCategories = normalizeScheduleCategories(apiCategories);

      setCategories(normalizedCategories);
      setFilters((prev) =>
        syncFiltersWithCategories(prev, normalizedCategories)
      );
      setFormState((prev) => ({
        ...prev,
        categoryId: normalizedCategories.some(
          (category) => category.id === prev.categoryId
        )
          ? prev.categoryId
          : (normalizedCategories[0]?.id ?? OTHER_CATEGORY_KEY),
      }));
    } catch {
      const fallbackCategories: ScheduleCategoryOption[] = [
        {
          id: OTHER_CATEGORY_KEY,
          name: "기타",
          color: "#f59e0b",
        },
      ];

      setCategories(fallbackCategories);
      setFilters((prev) => syncFiltersWithCategories(prev, fallbackCategories));
      setFormState((prev) => ({
        ...prev,
        categoryId: fallbackCategories[0].id,
      }));
    }
  }, [setFormState]);

  useEffect(() => {
    void loadCategories();
  }, [loadCategories]);

  useEffect(() => {
    void loadSchedules();
  }, [loadSchedules]);

  const handleCreateCategory = useCallback(async () => {
    if (
      isCategoryCreating ||
      isCategoryUpdating ||
      isCategoryDeleting ||
      isScheduleCreating ||
      isScheduleUpdating ||
      isScheduleDeleting
    ) {
      return;
    }

    const name = categoryCreateState.name.trim();
    const color = categoryCreateState.color.toUpperCase();

    if (!name) {
      setCategoryCreateError("카테고리 이름을 입력해 주세요.");
      return;
    }

    if (!HEX_COLOR_REGEX.test(color)) {
      setCategoryCreateError("색상은 #RRGGBB 형식으로 입력해 주세요.");
      return;
    }

    setCategoryCreateError(null);
    setIsCategoryCreating(true);

    try {
      const created = await createScheduleCategoryAPI({ name, color });

      setCategories((prev) => {
        const exists = prev.some((category) => category.id === created.id);
        if (exists) {
          return prev;
        }

        const withoutOther = prev.filter(
          (category) => category.id !== OTHER_CATEGORY_KEY
        );
        const merged = [
          ...withoutOther,
          {
            id: created.id,
            name: created.name,
            color: created.color.toUpperCase(),
          },
        ].sort((a, b) => a.name.localeCompare(b.name, "ko"));

        return normalizeScheduleCategories(merged);
      });

      setFilters((prev) => ({
        ...prev,
        [created.id]: true,
      }));
      setFormState((prev) => ({
        ...prev,
        categoryId: created.id,
      }));
      setCategoryCreateState((prev) => ({
        ...prev,
        name: "",
      }));
      setCategoryCreateError(null);
      setCategoryUpdateError(null);
    } catch (error) {
      setCategoryCreateError(getCategoryCreateErrorMessage(error));
    } finally {
      setIsCategoryCreating(false);
    }
  }, [
    categoryCreateState.color,
    categoryCreateState.name,
    isCategoryCreating,
    isCategoryDeleting,
    isCategoryUpdating,
    isScheduleCreating,
    isScheduleDeleting,
    isScheduleUpdating,
    setFormState,
  ]);

  const handleStartCategoryEdit = useCallback(
    (category: ScheduleCategoryOption) => {
      if (category.id === OTHER_CATEGORY_KEY) {
        return;
      }

      setEditingCategoryId(category.id);
      setCategoryEditState({
        name: category.name,
        color: category.color,
      });
      setCategoryUpdateError(null);
    },
    []
  );

  const handleCancelCategoryEdit = useCallback(() => {
    setEditingCategoryId(null);
    setCategoryUpdateError(null);
    setCategoryEditState({
      name: "",
      color: DEFAULT_CATEGORY_COLOR,
    });
  }, []);

  const handleUpdateCategory = useCallback(async () => {
    if (
      !editingCategoryId ||
      isCategoryUpdating ||
      isCategoryCreating ||
      isCategoryDeleting
    ) {
      return;
    }

    const name = categoryEditState.name.trim();
    const color = categoryEditState.color.toUpperCase();

    if (!name) {
      setCategoryUpdateError("카테고리 이름을 입력해 주세요.");
      return;
    }

    if (!HEX_COLOR_REGEX.test(color)) {
      setCategoryUpdateError("색상은 #RRGGBB 형식으로 입력해 주세요.");
      return;
    }

    setCategoryUpdateError(null);
    setIsCategoryUpdating(true);

    try {
      const updated = await updateScheduleCategoryAPI(editingCategoryId, {
        name,
        color,
      });

      setCategories((prev) => {
        const updatedList = prev.map((category) =>
          category.id === updated.id
            ? {
                ...category,
                name: updated.name,
                color: updated.color.toUpperCase(),
              }
            : category
        );

        const withoutOther = updatedList.filter(
          (category) => category.id !== OTHER_CATEGORY_KEY
        );
        const merged = [...withoutOther].sort((a, b) =>
          a.name.localeCompare(b.name, "ko")
        );

        return normalizeScheduleCategories(merged);
      });

      handleCancelCategoryEdit();
      setCategoryCreateError(null);
      await loadSchedules();
    } catch (error) {
      setCategoryUpdateError(getCategoryActionErrorMessage(error));
    } finally {
      setIsCategoryUpdating(false);
    }
  }, [
    categoryEditState.color,
    categoryEditState.name,
    editingCategoryId,
    handleCancelCategoryEdit,
    isCategoryCreating,
    isCategoryDeleting,
    isCategoryUpdating,
    loadSchedules,
  ]);

  const handleDeleteCategory = useCallback(
    async (categoryId: string) => {
      if (
        categoryId === OTHER_CATEGORY_KEY ||
        isCategoryCreating ||
        isCategoryUpdating ||
        isCategoryDeleting
      ) {
        return;
      }

      openModal(
        createElement(CheckModal, {
          title: "분류를 삭제할까요?",
          description: "이 분류를 삭제하면 연결된 일정은 기타로 이동됩니다.",
          confirmText: isCategoryDeleting ? "삭제 중..." : "삭제",
          cancelText: "취소",
          confirmDisabled: isCategoryDeleting || isCategoryUpdating,
          onConfirm: async () => {
            setDeletingCategoryId(categoryId);
            setCategoryUpdateError(null);
            setIsCategoryDeleting(true);

            try {
              const schedulesToMigrate = await fetchSchedulesAPI({
                ...CATEGORY_MIGRATION_RANGE,
                category: categoryId,
              });

              if (schedulesToMigrate.length > 0) {
                const failedScheduleIds =
                  await migrateSchedulesToOtherCategory(schedulesToMigrate);

                if (failedScheduleIds.length > 0) {
                  throw new Error(
                    `일정 ${failedScheduleIds.length}건을 기타로 이동하지 못해 분류 삭제를 중단했습니다. 잠시 후 다시 시도해 주세요.`
                  );
                }
              }

              await deleteScheduleCategoryAPI(categoryId);

              const withoutTarget = categories.filter(
                (category) =>
                  category.id !== OTHER_CATEGORY_KEY &&
                  category.id !== categoryId
              );
              const nextCategories = normalizeScheduleCategories(withoutTarget);

              setCategories(nextCategories);

              setFilters((prev) => {
                const synced = syncFiltersWithCategories(prev, nextCategories);
                delete synced[categoryId];
                return synced;
              });

              const nextDefaultCategoryId =
                nextCategories[0]?.id ?? OTHER_CATEGORY_KEY;

              setFormState((prev) => ({
                ...prev,
                categoryId:
                  prev.categoryId === categoryId
                    ? nextDefaultCategoryId
                    : prev.categoryId,
              }));

              if (editingCategoryId === categoryId) {
                handleCancelCategoryEdit();
              }

              await loadSchedules();
            } catch (error) {
              setCategoryUpdateError(getCategoryActionErrorMessage(error));
            } finally {
              setDeletingCategoryId(null);
              setIsCategoryDeleting(false);
            }
          },
        })
      );
    },
    [
      openModal,
      categories,
      editingCategoryId,
      handleCancelCategoryEdit,
      isCategoryCreating,
      isCategoryDeleting,
      isCategoryUpdating,
      loadSchedules,
      setFormState,
    ]
  );

  const openCreateCategoryModal = useCallback(() => {
    setEditingCategoryId(null);
    setDeletingCategoryId(null);
    setCategoryCreateState({
      name: "",
      color: DEFAULT_CATEGORY_COLOR,
    });
    setCategoryCreateError(null);
    setCategoryUpdateError(null);
    setIsCategoryModalOpen(true);
  }, []);

  const closeCategoryModal = useCallback(() => {
    setIsCategoryModalOpen(false);
    setDeletingCategoryId(null);
    setCategoryCreateError(null);
    setCategoryUpdateError(null);
    setCategoryCreateState((prev) => ({
      ...prev,
      name: "",
    }));
    handleCancelCategoryEdit();
  }, [handleCancelCategoryEdit]);

  return {
    view,
    currentDate,
    events,
    filteredEvents,
    todayEvents,
    categories,
    categoryLabelMap,
    filters,
    isSchedulesLoading,
    isScheduleCreating,
    isScheduleUpdating,
    isScheduleDeleting,
    isCategoryCreating,
    isCategoryUpdating,
    isCategoryDeleting,
    isCategoryModalOpen,
    loadError,
    setView,
    setCurrentDate,
    setFilters,
    createOpen,
    editingScheduleId,
    scheduleModalMode,
    timetableOpen,
    setTimetableOpen,
    timetableEntries,
    timetableMeta,
    isTimetableLoading,
    timetableError,
    formState,
    categoryCreateState,
    deletingCategoryId,
    editingCategoryId,
    categoryEditState,
    setFormState,
    setCategoryCreateState,
    setCategoryEditState,
    formError,
    categoryCreateError,
    categoryUpdateError,
    setFormError,
    setCategoryCreateError,
    openCreateScheduleModal,
    closeCreateScheduleModal,
    enableScheduleEdit,
    handleStartScheduleEdit,
    handleCreateSubmit,
    handleDeleteSchedule,
    handleCreateCategory,
    handleStartCategoryEdit,
    handleCancelCategoryEdit,
    handleUpdateCategory,
    handleDeleteCategory,
    openCreateCategoryModal,
    closeCategoryModal,
  };
}
