"use client";

import { useEffect } from "react";

const SEARCH_DEBOUNCE_MS = 300;

type UseLectureSearchDebounceParams = {
  searchInput: string;
  onDebounced: (value: string) => void;
};

export const useLectureSearchDebounce = ({
  searchInput,
  onDebounced,
}: UseLectureSearchDebounceParams) => {
  useEffect(() => {
    const handle = setTimeout(() => {
      onDebounced(searchInput.trim());
    }, SEARCH_DEBOUNCE_MS);

    return () => clearTimeout(handle);
  }, [onDebounced, searchInput]);
};
