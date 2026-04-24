import { create } from "zustand";

type LectureDetailModalState = {
  selectedLectureId: string | null;
  isOpen: boolean;
  open: (lectureId: string) => void;
  close: () => void;
};

export const useLectureDetailModalStore = create<LectureDetailModalState>(
  (set) => ({
    selectedLectureId: null,
    isOpen: false,
    open: (lectureId) => set({ selectedLectureId: lectureId, isOpen: true }),
    close: () => set({ isOpen: false }),
  })
);
