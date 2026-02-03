import z from "zod";

// 공통 학생 기본 정보
const studentBaseSchema = z.object({
  studentName: z.string().trim().min(1, "학생 이름을 입력해주세요"),
  school: z.string().trim().min(1, "학교명을 입력해주세요"),
  schoolYear: z.string().min(1, "학년을 입력해주세요"),
  studentPhone: z
    .string()
    .trim()
    .min(1, "학생 연락처를 입력해주세요")
    .regex(/^01[016789]-\d{3,4}-\d{4}$/, "전화번호 형식이 올바르지 않습니다"),
  parentPhone: z
    .string()
    .trim()
    .min(1, "학부모 연락처를 입력해주세요")
    .regex(/^01[016789]-\d{3,4}-\d{4}$/, "전화번호 형식이 올바르지 않습니다"),
});

export const studentCreateSchema = studentBaseSchema.extend({
  assignedClass: z.string().min(1, "배정 클래스를 선택해주세요"),
  registrationDate: z.string().min(1, "등록일을 입력해주세요"),
  memo: z.string().optional(),
});

export const classChangeSchema = z.object({
  assignedClass: z.string().min(1, "배정 클래스를 선택해주세요"),
  memo: z.string().optional(),
});

export const editProfileSchema = studentBaseSchema.extend({
  email: z
    .string()
    .trim()
    .min(1, "이메일을 입력해주세요")
    .email("올바른 이메일 형식이 아닙니다")
    .optional()
    .or(z.literal("")), // 빈 문자열 허용(미등록 학생일 경우)
  memo: z.string().optional(),
});

export const AttendanceRegisterSchema = z.object({
  date: z.string().min(1, "출결 날짜를 선택해주세요"),
  status: z.string().min(1, "출결 상태를 선택해주세요"),
  memo: z.string().optional(),
});
