import { create } from "zustand";
import { persist } from "zustand/middleware";

export const INITIAL_LIMIT = 4;

type LecturesUiState = {
  limit: number;
  searchInput: string;
  searchValue: string;
  setSearchInput: (value: string) => void;
  setSearchValue: (value: string) => void;
  setLimit: (value: number) => void;
  resetLimit: () => void;
};

export const useLecturesUiStore = create<LecturesUiState>()(
  persist(
    (set) => ({
      limit: INITIAL_LIMIT,
      searchInput: "",
      searchValue: "",
      setSearchInput: (value) => set({ searchInput: value }),
      setSearchValue: (value) => set({ searchValue: value }),
      setLimit: (value) => set({ limit: value }),
      resetLimit: () => set({ limit: INITIAL_LIMIT }),
    }),
    {
      name: "lectures-ui",
      partialize: (state) => ({
        limit: state.limit,
        searchInput: state.searchInput,
        searchValue: state.searchValue,
      }),
    }
  )
);
