import {
  InstructorWriteContents,
  LearnersWriteInquiry,
} from "../types/communication.type";

// 학생/학부모가 작성한 문의글 목록
export const MOCK_LEARNER_INQUIRIES: LearnersWriteInquiry[] = [
  {
    id: "INQ-2026-001",
    title: "수학 하 (2단원) 문제 풀이 질문입니다.",
    contents:
      "15페이지 4번 문제에서 조건 (가)를 어떻게 해석해야 할지 모르겠어요.",
    writer: { name: "김철수", type: "STUDENT" },
    status: "COMPLETED",
    date: "2026-02-01",
    answers: [
      {
        id: "ANS-001",
        contents:
          "철수 학생, 해당 조건은 집합의 포함 관계를 나타내는 거예요. 다시 확인해보고 모르면 내일 수업 시간에 물어보세요!",
        date: "2026-02-01",
        writer: "이강사",
      },
    ],
  },
  {
    id: "INQ-2026-002",
    title: "이번 주말 보강 수업 장소가 변경되었나요?",
    contents: "문자를 받았는데 302호가 맞는지 확인 부탁드립니다.",
    writer: { name: "이영희", type: "PARENT" },
    status: "REGISTERED",
    date: "2026-02-02",
    answers: [],
  },
  {
    id: "INQ-2026-003",
    title: "과제 제출 기한 연장 요청",
    contents: "독감 때문에 이번 주 과제 제출을 조금 늦춰주실 수 있을까요?",
    writer: { name: "박지성", type: "STUDENT" },
    status: "BEFORE",
    date: "2026-02-03",
  },
];

// 강사가 작성한 게시글(공지/자료공유) 목록
export const MOCK_INSTRUCTOR_POSTS: InstructorWriteContents[] = [
  {
    id: "POST-2026-101",
    title: "[필독] 2월 설 연휴 학원 휴강 안내",
    contents:
      "안녕하세요. 이강사입니다. 2월 설 연휴 기간 동안 모든 수업은 휴강입니다. 가족과 즐거운 시간 보내세요.",
    name: "이강사",
    contentsType: "NOTICE",
    classId: null, // 전체 클래스
    readPermission: "ALL",
    notifyTargetIds: [],
    notifyType: "ALL",
    date: "2026-02-01",
    answers: [
      {
        id: "CMT-101",
        contents: "확인했습니다! 선생님도 새해 복 많이 받으세요.",
        date: "2026-02-01",
        writer: "김철수",
      },
    ],
  },
  {
    id: "POST-2026-102",
    title: "기말고사 대비 기출문제집 PDF 자료",
    contents:
      "지난 3개년 기출문제를 정리한 자료입니다. 학생들은 다운로드하여 풀어보세요.",
    name: "이강사",
    contentsType: "SHARE",
    classId: "class1",
    className: "수학 A반",
    readPermission: "STUDENT",
    notifyTargetIds: ["student1", "student2"],
    notifyType: "STUDENT",
    date: "2026-02-02",
  },
  {
    id: "POST-2026-103",
    title: "입시설명회 관련 학부모 공지사항",
    contents:
      "다음 주 수요일 저녁 7시에 온라인 입시설명회가 진행될 예정입니다.",
    name: "이강사",
    contentsType: "NOTICE",
    classId: "class2",
    className: "수학 B반",
    readPermission: "PARENT",
    notifyTargetIds: ["student4", "student5"],
    notifyType: "PARENT",
    date: "2026-02-03",
  },
];
