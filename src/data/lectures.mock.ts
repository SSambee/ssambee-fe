import { Lecture } from "@/types/lectures";

export const mockLectures: Lecture[] = [
  // B1에서 생성된 강의 1 (워크로그 예시 데이터 기반)
  {
    id: "1",
    name: "고3 수능대비",
    subject: "영어",
    schoolYear: "고2",
    instructor: "배지원", // 동일한 강사
    assistant: "이서준", // 담당 조교
    currentStudents: 1,
    maxStudents: 30,
    startDate: "2026-01-31", // 개강일
    status: "개강전", // 수업 상태
    schedule: {
      days: ["월"],
      time: "21:36 - 22:47",
    },
    students: [
      {
        id: "s1",
        name: "김민준",
        school: "서울고",
        schoolYear: "고2",
        phone: "010-1234-5678",
        parentPhone: "010-9876-5432",
      },
    ],
  },
  // B1에서 생성된 강의 2 (추가 예시)
  {
    id: "2",
    name: "고1 수학 기초반",
    subject: "수학",
    schoolYear: "고1",
    instructor: "배지원", // 동일한 강사
    assistant: "박서준", // 담당 조교
    currentStudents: 10,
    maxStudents: 25,
    startDate: "2026-02-03", // 개강일
    status: "진행중", // 수업 상태
    schedule: {
      days: ["화", "목"],
      time: "18:00 - 20:00",
    },
    students: [
      {
        id: "s2",
        name: "박서연",
        school: "서울여고",
        schoolYear: "고2",
        phone: "010-9999-1212",
        parentPhone: "010-2222-3333",
      },
      {
        id: "s3",
        name: "이도윤",
        school: "강남고",
        schoolYear: "고1",
        phone: "010-5555-6666",
        parentPhone: "010-7777-8888",
      },
      {
        id: "s4",
        name: "최지우",
        school: "서울고",
        schoolYear: "고1",
        phone: "010-1111-2222",
        parentPhone: "010-3333-4444",
      },
      {
        id: "s5",
        name: "정하은",
        school: "강남여고",
        schoolYear: "고1",
        phone: "010-4444-5555",
        parentPhone: "010-6666-7777",
      },
      {
        id: "s6",
        name: "김태민",
        school: "서울고",
        schoolYear: "고2",
        phone: "010-8888-9999",
        parentPhone: "010-1010-1111",
      },
      {
        id: "s7",
        name: "이수진",
        school: "강남고",
        schoolYear: "고1",
        phone: "010-2020-3030",
        parentPhone: "010-4040-5050",
      },
      {
        id: "s8",
        name: "박준혁",
        school: "서울고",
        schoolYear: "고2",
        phone: "010-6060-7070",
        parentPhone: "010-8080-9090",
      },
      {
        id: "s9",
        name: "최예린",
        school: "강남여고",
        schoolYear: "고1",
        phone: "010-1212-3434",
        parentPhone: "010-5656-7878",
      },
      {
        id: "s10",
        name: "정민서",
        school: "서울여고",
        schoolYear: "고2",
        phone: "010-9898-7676",
        parentPhone: "010-5454-3232",
      },
      {
        id: "s11",
        name: "강동현",
        school: "강남고",
        schoolYear: "고1",
        phone: "010-1357-2468",
        parentPhone: "010-9753-8642",
      },
    ],
  },
];
