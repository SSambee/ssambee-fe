export type ScheduleCategoryApi = {
  id: string;
  name: string;
  color: string;
};

export type ScheduleApi = {
  id: string;
  title: string;
  memo?: string | null;
  startTime: string;
  endTime: string;
  categoryId?: string | null;
  category?: ScheduleCategoryApi | null;
  createdAt?: string;
  updatedAt?: string | null;
};

export type FetchSchedulesQuery = {
  startTime: string;
  endTime: string;
  category?: string;
};

export type CreateSchedulePayload = {
  title: string;
  memo?: string;
  startTime: string;
  endTime: string;
  categoryId?: string;
};

export type UpdateSchedulePayload = {
  title?: string;
  memo?: string;
  startTime?: string;
  endTime?: string;
  categoryId?: string | null;
};

export type CreateScheduleCategoryPayload = {
  name: string;
  color: string;
};

export type UpdateScheduleCategoryPayload = {
  name?: string;
  color?: string;
};
