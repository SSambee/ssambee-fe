import { create } from "zustand";

import { ScheduleData } from "@/types/lectures";

type LectureCreateState = {
  schedules: number[];
  scheduleData: Record<number, ScheduleData>;
  isSaved: boolean;
  addSchedule: () => void;
  removeSchedule: (id: number) => void;
  setScheduleData: (data: Record<number, ScheduleData>) => void;
  setIsSaved: (saved: boolean) => void;
  reset: () => void;
};

export const useLectureCreateStore = create<LectureCreateState>((set) => ({
  schedules: [1],
  scheduleData: {},
  isSaved: false,
  addSchedule: () =>
    set((state) => {
      const nextId =
        state.schedules.length > 0 ? Math.max(...state.schedules) + 1 : 1;
      return { schedules: [...state.schedules, nextId] };
    }),
  removeSchedule: (id) =>
    set((state) => {
      const nextSchedules = state.schedules.filter((item) => item !== id);
      const nextData = { ...state.scheduleData };
      delete nextData[id];
      return { schedules: nextSchedules, scheduleData: nextData };
    }),
  setScheduleData: (data) => set({ scheduleData: data }),
  setIsSaved: (saved) => set({ isSaved: saved }),
  reset: () =>
    set({
      schedules: [1],
      scheduleData: {},
      isSaved: false,
    }),
}));
