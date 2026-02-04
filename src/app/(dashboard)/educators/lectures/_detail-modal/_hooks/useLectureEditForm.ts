"use client";

import { useCallback, useMemo, useState } from "react";

import { LectureStatus } from "@/types/lectures";
import {
  LECTURE_GRADES,
  LECTURE_STATUS_OPTIONS,
  LECTURE_SUBJECTS,
} from "@/constants/lectures.constants";

import type { LectureEditFormValues, SelectOption } from "./types";

type UseLectureEditFormParams = {
  initialValues?: Partial<LectureEditFormValues>;
};

export const useLectureEditForm = (params?: UseLectureEditFormParams) => {
  const initial = params?.initialValues;

  const [editTitle, setEditTitle] = useState(initial?.editTitle ?? "");
  const [editSubject, setEditSubject] = useState(initial?.editSubject ?? "");
  const [editSchoolYear, setEditSchoolYear] = useState(
    initial?.editSchoolYear ?? ""
  );
  const [editInstructor, setEditInstructor] = useState(
    initial?.editInstructor ?? ""
  );
  const [editStatus, setEditStatus] = useState<LectureStatus | "">(
    initial?.editStatus ?? ""
  );
  const [editStartDate, setEditStartDate] = useState(
    initial?.editStartDate ?? ""
  );

  const buildOptions = useCallback(
    (current: string, options: readonly string[]): SelectOption[] => {
      const unique = Array.from(new Set([current, ...options])).filter(Boolean);
      return unique.map((value) => ({ label: value, value }));
    },
    []
  );

  const subjectOptions = useMemo(
    () => buildOptions(editSubject, LECTURE_SUBJECTS),
    [buildOptions, editSubject]
  );
  const schoolYearOptions = useMemo(
    () => buildOptions(editSchoolYear, LECTURE_GRADES),
    [buildOptions, editSchoolYear]
  );
  const statusOptions = useMemo(() => [...LECTURE_STATUS_OPTIONS], []);

  const resetForm = useCallback((values: LectureEditFormValues) => {
    setEditTitle(values.editTitle);
    setEditSubject(values.editSubject);
    setEditSchoolYear(values.editSchoolYear);
    setEditInstructor(values.editInstructor);
    setEditStatus(values.editStatus);
    setEditStartDate(values.editStartDate);
  }, []);

  const getFormValues = useCallback(
    (): LectureEditFormValues => ({
      editTitle,
      editSubject,
      editSchoolYear,
      editStatus,
      editStartDate,
      editInstructor,
    }),
    [
      editTitle,
      editSubject,
      editSchoolYear,
      editStatus,
      editStartDate,
      editInstructor,
    ]
  );

  return {
    editTitle,
    editSubject,
    editSchoolYear,
    editStatus,
    editStartDate,
    editInstructor,
    setEditTitle,
    setEditSubject,
    setEditSchoolYear,
    setEditStatus,
    setEditStartDate,
    setEditInstructor,
    subjectOptions,
    schoolYearOptions,
    statusOptions,
    resetForm,
    getFormValues,
  };
};
