import { z } from "zod";

import { KR_PHONE_REGEX, TIME_HHMM_REGEX } from "@/constants/regex";

// 학생 데이터 스키마
const manualStudentBaseSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "학생 이름을 입력해주세요")
    .min(2, "학생 이름은 최소 2자 이상이어야 합니다"),
  phone: z
    .string()
    .trim()
    .min(1, "연락처를 입력해주세요")
    .regex(KR_PHONE_REGEX, "올바른 연락처 형식이 아닙니다"),
  parentPhone: z
    .string()
    .trim()
    .min(1, "학부모 번호를 입력해주세요")
    .regex(KR_PHONE_REGEX, "올바른 연락처 형식이 아닙니다"),
});

export const manualStudentSchema = manualStudentBaseSchema.extend({
  school: z.string().trim().min(1, "학생 학교를 입력해주세요"),
  studentGrade: z.string().trim().min(1, "학생 학년을 입력해주세요"),
  registrationDate: z.string().trim().min(1, "학생 등록날짜를 입력해주세요"),
});

export type ManualStudentInput = z.infer<typeof manualStudentSchema>;

// 시간표 스키마
export const scheduleSchema = z.object({
  day: z.string().trim().min(1, "요일을 선택해주세요"),
  startTime: z
    .string()
    .trim()
    .min(1, "시작 시간을 입력해주세요")
    .regex(TIME_HHMM_REGEX, "HH:MM 형식으로 입력해주세요"),
  endTime: z
    .string()
    .trim()
    .min(1, "종료 시간을 입력해주세요")
    .regex(TIME_HHMM_REGEX, "HH:MM 형식으로 입력해주세요"),
});

export type ScheduleInput = z.infer<typeof scheduleSchema>;

// 강의 기본정보 스키마
export const lectureInfoSchema = z.object({
  name: z.string().trim().min(1, "수업명을 입력해주세요"),
  subject: z.string().trim().min(1, "과목을 입력해주세요"),
  schoolYear: z.string().trim().min(1, "학년을 입력해주세요"),
  startDate: z.string().trim().min(1, "개강일을 입력해주세요"),
  status: z.string().min(1, "수업 상태를 선택해주세요"),
});

export type LectureInfoInput = z.infer<typeof lectureInfoSchema>;

export const lectureFormSchema = lectureInfoSchema.extend({
  students: z.array(manualStudentSchema),
});

export type LectureFormInput = z.infer<typeof lectureFormSchema>;
