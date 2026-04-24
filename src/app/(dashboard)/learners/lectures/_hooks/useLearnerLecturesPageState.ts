"use client";

import { useCallback, useState } from "react";

const INITIAL_VISIBLE_LECTURES = 6;
const VISIBLE_LECTURES_STEP = 6;

export const useLearnerLecturesPageState = () => {
  const [visibleLectures, setVisibleLectures] = useState(
    INITIAL_VISIBLE_LECTURES
  );

  const handleLoadMore = useCallback(() => {
    setVisibleLectures((prev) => prev + VISIBLE_LECTURES_STEP);
  }, []);

  return {
    visibleLectures,
    handleLoadMore,
  };
};
