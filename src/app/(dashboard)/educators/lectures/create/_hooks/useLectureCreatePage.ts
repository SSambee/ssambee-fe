"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useSetBreadcrumb } from "@/hooks/useBreadcrumb";
import { useCreateLecture } from "@/hooks/lectures/useCreateLecture";
import { useLectureCreateStore } from "@/stores/lectures";
import {
  lectureFormSchema,
  LectureFormInput,
} from "@/validation/lecture.validation";

import { useLectureCreateForm } from "./useLectureCreateForm";

const EMPTY_STUDENT = {
  name: "",
  phone: "",
  school: "",
  studentGrade: "",
  parentPhone: "",
  registrationDate: "",
};

export const useLectureCreatePage = () => {
  const router = useRouter();

  useSetBreadcrumb([
    { label: "수업 관리", href: "/educators/lectures" },
    { label: "수업 개설" },
  ]);

  const schedules = useLectureCreateStore((state) => state.schedules);
  const scheduleData = useLectureCreateStore((state) => state.scheduleData);
  const isSaved = useLectureCreateStore((state) => state.isSaved);
  const addSchedule = useLectureCreateStore((state) => state.addSchedule);
  const removeSchedule = useLectureCreateStore((state) => state.removeSchedule);
  const setScheduleData = useLectureCreateStore(
    (state) => state.setScheduleData
  );
  const setIsSaved = useLectureCreateStore((state) => state.setIsSaved);
  const resetCreateState = useLectureCreateStore((state) => state.reset);

  const lectureForm = useForm<LectureFormInput>({
    resolver: zodResolver(lectureFormSchema),
    mode: "onSubmit",
    defaultValues: {
      name: "",
      subject: "",
      schoolYear: "",
      startDate: "",
      status: "개강전",
      students: [EMPTY_STUDENT],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: lectureForm.control,
    name: "students",
  });

  useEffect(() => {
    return () => {
      resetCreateState();
    };
  }, [resetCreateState]);

  const createLectureMutation = useCreateLecture();
  const isSubmitting = createLectureMutation.isPending;

  const { handleSave, handleCancel } = useLectureCreateForm({
    lectureForm,
    schedules,
    scheduleData,
    createLecture: createLectureMutation,
    setIsSaved,
    resetCreateState,
    onSuccess: () => {
      setIsSaved(true);
      router.push("/educators/lectures");
    },
  });

  return {
    state: {
      isSaved,
      isSubmitting,
    },
    form: {
      lectureForm,
      fields,
    },
    schedule: {
      schedules,
      scheduleData,
    },
    actions: {
      save: handleSave,
      cancel: () => handleCancel(isSaved, () => router.back()),
      addSchedule: () => {
        if (isSaved) return;
        addSchedule();
      },
      removeSchedule: (id: number) => {
        if (isSaved) return;
        removeSchedule(id);
      },
      setScheduleData,
      appendStudent: () => append(EMPTY_STUDENT),
      removeStudent: remove,
    },
  };
};
