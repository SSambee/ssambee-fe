"use client";

import { useExamsAll } from "@/hooks/exams/useExamsAll";
import { useExamsByLecture } from "@/hooks/exams/useExamsByLecture";
import { useClinicsList } from "@/hooks/clinics/useClinicsList";
import { useUpdateClinics } from "@/hooks/clinics/useUpdateClinics";
import { useLecturesList } from "@/hooks/lectures/useLecturesList";

import type { ClinicPageState } from "./useClinicPageState";

export const useClinicPageResources = ({
  activeLectureId,
  activeExamId,
}: Pick<ClinicPageState, "activeLectureId" | "activeExamId">) => {
  const lecturesQuery = useLecturesList({ page: 1, limit: 100 });
  const examsAllQuery = useExamsAll(activeLectureId === undefined);
  const examsByLectureQuery = useExamsByLecture(activeLectureId);
  const clinicsQuery = useClinicsList({
    lectureId: activeLectureId,
    examId: activeExamId,
  });
  const updateClinicsMutation = useUpdateClinics();

  return {
    lecturesQuery,
    examsAllQuery,
    examsByLectureQuery,
    clinicsQuery,
    updateClinicsMutation,
  };
};

export type ClinicPageResources = ReturnType<typeof useClinicPageResources>;
