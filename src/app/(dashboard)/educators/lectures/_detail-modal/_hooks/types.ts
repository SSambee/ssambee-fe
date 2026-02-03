import type {
  Lecture,
  LectureSelectOption,
  LectureStatus,
} from "@/types/lectures";

export type UseLectureDetailModalParams = {
  lecture: Lecture | null;
  open: boolean;
};

export type EditTimeRow = {
  id: string;
  day: string;
  startTime: string;
  endTime: string;
};

export type LectureEditFormValues = {
  editTitle: string;
  editSubject: string;
  editSchoolYear: string;
  editStatus: LectureStatus | "";
  editStartDate: string;
  editInstructor: string;
};

export type SelectOption = LectureSelectOption;
