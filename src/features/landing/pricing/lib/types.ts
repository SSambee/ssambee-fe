export type Plan = {
  id: string;
  name: string;
  price: number;
  description: string;
  features: string[];
  cta: string;
};

export type TokenAdd = {
  id: string;
  count: number;
  price: number;
  options: string;
};

export const PLANS: Plan[] = [
  {
    id: "starter",
    name: "스타터",
    price: 59000,
    description: "관리가 시작되는 1인 강사를 위한 실속 플랜",
    features: [
      "수강생 최대 50명",
      "강의 콘텐츠 무제한 업로드",
      "출결 & 성적 히스토리 관리",
      "수강생/학부모 타겟 공지",
      "재시험 대상자 자동 분류",
      "디지털 성적표 자동 생성",
      "카카오톡 발송 500건 기본 제공",
    ],
    cta: "시작하기",
  },
  {
    id: "premium",
    name: "프리미엄",
    price: 89000,
    description: "조교와 함께 효율을 높이는 프로 강사의 선택",
    features: [
      "수강생 최대 150명",
      "강의 콘텐츠 무제한 업로드",
      "출결 & 성적 히스토리 관리",
      "수강생/학부모 지정 공지",
      "재시험 대상자 자동 분류",
      "디지털 성적표 자동 생성",
      "카카오톡 발송 1,000건 기본 제공",
    ],
    cta: "시작하기",
  },
  {
    id: "enterprise",
    name: "엔터프라이즈",
    price: 129000,
    description: "팀 단위 운영을 위한 올인원 솔루션",
    features: [
      "수강생 등록 무제한",
      "강의 콘텐츠 무제한 업로드",
      "출결 & 성적 히스토리 관리",
      "수강생/학부모 지정 공지",
      "재시험 대상자 자동 분류",
      "디지털 성적표 자동 생성",
      "카카오톡 발송 1,500건 기본 제공",
    ],
    cta: "시작하기",
  },
];

export const TOKENS: TokenAdd[] = [
  {
    id: "token-400",
    count: 400,
    price: 20000,
    options: "유효기간 3개월 (잔여 토큰 이월)",
  },
  {
    id: "token-600",
    count: 600,
    price: 30000,
    options: "유효기간 3개월 (잔여 토큰 이월)",
  },
  {
    id: "token-1000",
    count: 1000,
    price: 50000,
    options: "유효기간 3개월 (잔여 토큰 이월)",
  },
];

export const FEATURE_HIGHLIGHTS = [
  {
    icon: "🎯",
    title: "스마트 수강생 관리",
    desc: "입학부터 성적 추이까지, 흩어져 있던 학생 데이터를 하나의 타임라인으로 통합 관리하세요.",
  },
  {
    icon: "📅",
    title: "지능형 수업 일정",
    desc: "요일과 시간만 설정하면 수업 세션이 자동 생성됩니다. 복잡한 학원 시간표를 클릭 몇 번으로 끝내세요.",
  },
  {
    icon: "✍️",
    title: "투명한 출결 & 성적",
    desc: "수정 이력이 남는 정직한 출결 시스템과 성적 기반의 재시험(클리닉) 대상자 자동 분류 기능을 제공합니다.",
  },
  {
    icon: "🤝",
    title: "워크플로우 최적화",
    desc: "조교 업무 배정부터 권한 관리까지, 강사가 수업 본연의 가치에만 집중할 수 있는 운영 환경을 구축합니다.",
  },
  {
    icon: "💬",
    title: "멀티 채널 소통",
    desc: "강사 · 조교 · 학생 · 학부모로 이어지는 커뮤니케이션을 Q&A로 관리하고, 카카오톡으로 성적표를 발송합니다.",
  },
  {
    icon: "📁",
    title: "올인원 자료실",
    desc: "유튜브 강의 · 시험지 파일 · 이미지 등 다양한 형식의 자료를 업로드하고 학생/학부모에게 즉시 공유하세요.",
  },
];
