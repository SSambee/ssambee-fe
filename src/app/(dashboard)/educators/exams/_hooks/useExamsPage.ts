"use client";

import { useMemo, useState } from "react";

import { useLecturesList } from "@/hooks/lectures/useLecturesList";
import { useExamsByLecture } from "@/hooks/exams/useExamsByLecture";
import { mapExamApiToView } from "@/services/exams/exams.mapper";

export const useExamsPage = () => {
  const { data: lecturesData, isPending: isLecturesPending } = useLecturesList({
    page: 1,
    limit: 100,
  });
  const lectures = lecturesData?.lectures ?? [];

  const [selectedLectureId, setSelectedLectureId] = useState("");
  const activeLectureId =
    selectedLectureId &&
    lectures.some((lecture) => lecture.id === selectedLectureId)
      ? selectedLectureId
      : (lectures[0]?.id ?? "");

  const selectedLecture = lectures.find(
    (lecture) => lecture.id === activeLectureId
  );

  const { data: examsData = [], isPending: isExamsPending } =
    useExamsByLecture(activeLectureId);

  const exams = useMemo(() => {
    return examsData.map((exam) =>
      mapExamApiToView(exam, selectedLecture?.name ?? "수업 미지정")
    );
  }, [examsData, selectedLecture?.name]);

  return {
    lectures,
    exams,
    activeLectureId,
    setSelectedLectureId,
    isLoading: isLecturesPending || isExamsPending,
    isLecturesPending,
    isExamsPending,
  };
};
