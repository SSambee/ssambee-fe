"use client";

import { useState } from "react";

export const useGradingDataState = () => {
  const [selectedStudentId, setSelectedStudentId] = useState("");

  return {
    selectedStudentId,
    setSelectedStudentId,
  };
};

export type GradingDataState = ReturnType<typeof useGradingDataState>;
