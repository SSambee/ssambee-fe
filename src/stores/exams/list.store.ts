import { create } from "zustand";

type ExamsStore = {
  selectedIds: string[];
  currentPage: number;
  itemsPerPage: number;
  setCurrentPage: (page: number) => void;
  selectAll: (ids: string[]) => void;
  toggleSelected: (id: string, checked: boolean) => void;
  clearSelection: () => void;
};

const ITEMS_PER_PAGE = 4;

export const useExamsStore = create<ExamsStore>((set) => ({
  selectedIds: [],
  currentPage: 1,
  itemsPerPage: ITEMS_PER_PAGE,
  setCurrentPage: (page) =>
    set(() => ({
      currentPage: page,
    })),
  selectAll: (ids) =>
    set(() => ({
      selectedIds: Array.from(new Set(ids)),
    })),
  toggleSelected: (id, checked) =>
    set((state) => ({
      selectedIds: checked
        ? state.selectedIds.includes(id)
          ? state.selectedIds
          : [...state.selectedIds, id]
        : state.selectedIds.filter((selectedId) => selectedId !== id),
    })),
  clearSelection: () =>
    set(() => ({
      selectedIds: [],
    })),
}));
