import Image from "next/image";
import {
  Building2,
  BookOpen,
  Calendar,
  ChevronDown,
  FileText,
  FolderOpen,
  GraduationCap,
  Headphones,
  Home as HomeIcon,
  MessageSquare,
  Phone,
  Search,
  SlidersHorizontal,
  UserCheck,
  UserPlus,
  UserX,
  Users,
} from "lucide-react";

const sidebarLineIcon = "/icons/figma/top-sidebar-line.svg";
const arrowFillIcon = "/icons/figma/arrow-fill.svg";
const profileEllipseIcon = "/icons/figma/profile-ellipse.svg";
const profileTeacherIcon = "/icons/figma/profile-teacher.svg";
const profileFaceIcon = "/icons/figma/profile-face.svg";

function HomeFilledIcon({ active }: { active: boolean }) {
  return (
    <svg
      viewBox="0 0 16 16"
      className={`size-[9px] shrink-0 ${active ? "text-[#4b72f7]" : "text-[#b0b4c2]"}`}
      aria-hidden
    >
      <path
        fill="currentColor"
        d="M8.35 1.15a.5.5 0 0 0-.7 0l-6 6A.5.5 0 0 0 2 8h1v5a1 1 0 0 0 1 1h3V9.9h2V14h3a1 1 0 0 0 1-1V8h1a.5.5 0 0 0 .35-.85l-6-6Z"
      />
    </svg>
  );
}

const summaryCards = [
  {
    id: "summary-class",
    title: "재원 학생",
    subtitle: "추가 1명",
    value: "19",
    unit: "명",
    tone: "primary",
  },
  {
    id: "summary-members",
    title: "운영 중 수업",
    subtitle: "신규 개설 1개",
    value: "6",
    unit: "개",
    tone: "secondary",
  },
  {
    id: "summary-schedule",
    title: "현재 시험 목록",
    subtitle: "시험지 등록",
    value: "3",
    unit: "개",
    tone: "tertiary",
  },
] as const;

const timetable = [
  { id: "time-1", text: "10:00 - 12:00 고2 수학 A반", tone: "muted" },
  { id: "time-2", text: "10:00 - 12:00 고3 파이널 대비반", tone: "muted" },
  { id: "time-3", text: "10:00 - 12:00 고2 기말고사 대비반", tone: "strong" },
  { id: "time-4", text: "10:00 - 12:00 고1 영어 B반", tone: "normal" },
  { id: "time-5", text: "10:00 - 12:00 고2 수학 A반", tone: "normal" },
  { id: "time-6", text: "10:00 - 12:00 고2 수학 A반", tone: "normal" },
  { id: "time-7", text: "10:00 - 12:00 고2 수학 A반", tone: "normal" },
  { id: "time-8", text: "10:00 - 12:00 고2 수학 A반", tone: "normal" },
] as const;

export const SHARED_SECTION_BG =
  "radial-gradient(50% 50% at 50% 50%, rgba(221, 233, 253, 0.45) 15%, rgba(221, 233, 253, 0.45) 20%, rgba(227, 235, 254, 0.45) 25%, rgba(232, 238, 255, 0.45) 85%)";
export const UNIFIED_DASHBOARD_HOVER_CLASS =
  "transform-gpu transition-all duration-[260ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-2 hover:scale-[1.02] hover:saturate-[1.06] hover:shadow-[0px_28px_56px_0px_rgba(55,86,170,0.24)]";

export const SECTION_EYEBROW_CLASS =
  "mb-4 block text-[16px] font-semibold leading-6 tracking-[-0.16px] text-[#3863f6] lg:text-[20px] lg:leading-[28px] lg:tracking-[-0.2px]";
export const SECTION_TITLE_CLASS =
  "text-[34px] font-bold leading-[45px] tracking-[-0.34px] text-[#2b2e3a] lg:text-[44px] lg:leading-[58px] lg:tracking-[-0.44px]";
export const SECTION_DESC_CLASS =
  "mt-8 text-[18px] font-normal leading-[28px] tracking-[-0.18px] text-[#8b90a3] lg:text-[22px] lg:leading-[30px] lg:tracking-[-0.22px]";
export const SECTION_DESC_CENTER_CLASS =
  "mx-auto mt-5 max-w-[760px] text-[18px] font-normal leading-[28px] tracking-[-0.18px] text-[#8b90a3] lg:text-[22px] lg:leading-[30px] lg:tracking-[-0.22px]";

export function HeroDashboardPreview() {
  const sideMenus = [
    {
      id: "students",
      label: "학생 관리",
      icon: GraduationCap,
    },
    {
      id: "classes",
      label: "수업 관리",
      icon: BookOpen,
    },
    {
      id: "schedule",
      label: "스케줄 관리",
      icon: Calendar,
    },
    {
      id: "communication",
      label: "소통",
      icon: MessageSquare,
    },
    {
      id: "assistant",
      label: "조교 관리",
      icon: Headphones,
    },
    {
      id: "exam",
      label: "시험 관리",
      icon: FileText,
    },
    {
      id: "materials",
      label: "학습 자료실",
      icon: FolderOpen,
    },
  ] as const;

  return (
    <div
      className={`flex h-[440px] overflow-hidden rounded-t-[20px] bg-[#f4f6fa] shadow-[0px_12px_40px_2px_rgba(11,18,32,0.08)] ${UNIFIED_DASHBOARD_HOVER_CLASS}`}
    >
      <aside className="hidden w-[130px] shrink-0 border-r-[0.5px] border-[#e9ebf0] bg-white lg:block">
        <div className="flex h-12 items-center px-5">
          <p className="text-[15px] font-semibold leading-5 tracking-[-0.15px] text-[#3863f6]">
            ssam B
          </p>
        </div>
        <div className="space-y-1.5 px-2 text-[9px] font-semibold leading-[13px] tracking-[-0.09px] text-[#8b90a3]">
          <div className="flex h-7 items-center gap-[7px] rounded-md bg-[#f4f6fe] px-3 font-bold text-[#4b72f7]">
            <HomeFilledIcon active />홈
          </div>
          {sideMenus.map((menu) => (
            <div
              key={menu.id}
              className="flex h-7 items-center gap-[7px] rounded-md px-3"
            >
              <menu.icon
                className="size-[9px] shrink-0 text-[#b0b4c2]"
                strokeWidth={1.8}
                aria-hidden
              />
              {menu.label}
            </div>
          ))}
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col bg-white">
        <div
          className="flex items-center justify-between border-b-[0.5px] border-[#e9ebf0] px-7 py-[10px]"
          style={{ paddingTop: "10px", paddingBottom: "10px" }}
        >
          <div className="flex items-center gap-1">
            <Image
              src={sidebarLineIcon}
              alt=""
              width={11}
              height={10}
              aria-hidden
            />
            <span className="text-[8px] font-semibold leading-3 tracking-[-0.08px] text-[#8b90a3]">
              홈
            </span>
          </div>
          <div className="flex items-center gap-[5px]">
            <div className="relative size-5 shrink-0">
              <Image src={profileEllipseIcon} alt="" fill aria-hidden />
              <Image src={profileTeacherIcon} alt="" fill aria-hidden />
              <div className="absolute inset-[18.6%_22.32%_30.36%_20.54%]">
                <Image src={profileFaceIcon} alt="" fill aria-hidden />
              </div>
            </div>
            <span className="text-[9px] font-medium leading-[13px] tracking-[-0.09px] text-[#8b90a3]">
              강사 박준성
            </span>
            <Image
              src={arrowFillIcon}
              alt=""
              width={7}
              height={10}
              aria-hidden
              className="-rotate-90"
            />
          </div>
        </div>

        <div className="flex h-[70px] flex-col items-start justify-center border-b-[0.5px] border-[#e9ebf0] px-[32px] py-[14.5px]">
          <div className="flex w-full flex-col items-start gap-[3px] not-italic">
            <p className="text-[18px] font-bold leading-[24px] tracking-[-0.18px] text-[#040405]">
              홈
            </p>
            <p className="text-[10px] font-medium leading-[14px] tracking-[-0.1px] text-[rgba(22,22,27,0.4)]">
              오늘의 업무와 소통 현황을 한눈에 확인하세요
            </p>
          </div>
        </div>

        <div className="flex flex-1 items-start bg-[#f4f6fa]">
          <div className="flex min-w-0 flex-1 flex-col">
            <div className="flex items-center gap-3 px-[28px] py-[20px]">
              {summaryCards.map((card) => {
                const toneClass =
                  card.tone === "primary"
                    ? "bg-[linear-gradient(93deg,#5A7DF8_0%,#4B72F7_100%)] text-white"
                    : card.tone === "secondary"
                      ? "bg-[#6b6f80] text-white"
                      : "bg-white text-[#4a4d5c]";

                return (
                  <div
                    key={card.id}
                    className={`h-20 w-[168px] rounded-[24px] px-5 pb-3 pt-4 shadow-[0px_0px_7px_0px_rgba(138,138,138,0.08)] ${toneClass}`}
                  >
                    <div className="flex h-full items-start justify-between">
                      <div className="flex h-full flex-col items-start gap-[2px]">
                        <p
                          className={`text-[10px] font-semibold leading-[14px] tracking-[-0.1px] ${
                            card.tone === "tertiary"
                              ? "text-[#4a4d5c]"
                              : "text-white/90"
                          }`}
                        >
                          {card.title}
                        </p>
                        <p
                          className={`text-[8px] font-semibold leading-3 tracking-[-0.08px] ${
                            card.tone === "tertiary"
                              ? "text-[#8b90a3]"
                              : "text-white/40"
                          }`}
                        >
                          {card.subtitle}
                        </p>
                      </div>
                      <div
                        className={`flex h-full items-end gap-[1.5px] ${
                          card.tone === "tertiary"
                            ? "text-[#4a4d5c]"
                            : "text-white"
                        }`}
                      >
                        <p className="text-[20px] font-bold leading-[26px] tracking-[-0.2px]">
                          {card.value}
                        </p>
                        <p className="h-6 text-[14px] font-bold leading-[19px] tracking-[-0.14px]">
                          {card.unit}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <section className="mx-[28px] rounded-[12px] bg-white p-5">
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <p className="text-[12px] font-bold leading-4 tracking-[-0.12px] text-[#4a4d5c]">
                    최근 문의 요청사항
                  </p>
                  <p className="text-[9px] font-medium leading-[13px] tracking-[-0.09px] text-[rgba(22,22,27,0.28)]">
                    최근 문의 요청을 확인하세요
                  </p>
                </div>
                <div className="flex h-7 items-center justify-center rounded-xl border border-[#ced9fd] bg-[#f4f6fe] px-5 text-[8px] font-semibold leading-3 tracking-[-0.08px] text-[#3863f6]">
                  전체보기
                </div>
              </div>

              <div className="overflow-hidden rounded-[10px] border border-[#e9ebf0] bg-white">
                <div className="grid h-[33px] grid-cols-[1fr_70px_70px_70px] items-center border-b border-[#f4f6fa] bg-[#fcfcfd] px-5 text-[9px] font-semibold leading-[13px] tracking-[-0.09px] text-[#8b90a3]">
                  <p className="pl-[10px]">내용</p>
                  <p className="text-center">작성자</p>
                  <p className="text-center">등록일</p>
                  <p className="text-center">상태</p>
                </div>
                {[1, 2, 3, 4].map((row) => (
                  <div
                    key={`hero-row-${row}`}
                    className="grid h-9 grid-cols-[1fr_70px_70px_70px] items-center border-b border-[#f4f6fa] px-5 last:border-b-0"
                  >
                    <div className="flex items-center gap-1 overflow-hidden pl-[10px] text-[9px] leading-[13px] tracking-[-0.09px]">
                      <p className="truncate font-medium text-[rgba(22,22,27,0.88)]">
                        수학(하) 2단원 문제 풀이 질문입니다.
                      </p>
                      <span className="text-[8px] font-bold leading-3 tracking-[-0.08px] text-[#3863f6]">
                        (1)
                      </span>
                    </div>
                    <div className="text-center text-[9px] font-medium leading-[13px] tracking-[-0.09px] text-[rgba(22,22,27,0.88)]">
                      김철수
                      <span className="ml-1 text-[8px] font-normal leading-3 text-[rgba(22,22,27,0.4)]">
                        학생
                      </span>
                    </div>
                    <p className="text-center text-[9px] font-medium leading-[13px] tracking-[-0.09px] text-[rgba(22,22,27,0.88)]">
                      26.01.29
                    </p>
                    <div className="mx-auto flex h-[18px] w-10 items-center justify-center rounded-lg bg-[#dcfce7] text-[7px] font-semibold leading-[10px] tracking-[-0.07px] text-[#16a34a]">
                      답변 등록
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div className="hidden w-[245px] pt-5 lg:block">
            <div className="h-[288px] w-[220px] rounded-[12px] bg-white px-4 pb-3 pt-4">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-[7px]">
                  <p className="text-[12px] font-bold leading-4 tracking-[-0.12px] text-[#4a4d5c]">
                    오늘 일정
                  </p>
                  <p className="text-[9px] font-medium leading-[13px] tracking-[-0.09px] text-[rgba(22,22,27,0.28)]">
                    2026. 01. 28
                  </p>
                </div>
                <span className="text-[8px] font-semibold leading-3 tracking-[-0.08px] text-[#b0b4c2]">
                  더보기
                </span>
              </div>

              <div className="relative space-y-3 pl-3">
                <div className="absolute bottom-1 left-[2px] top-1 w-px bg-[#e9ebf0]" />
                {timetable.map((item) => (
                  <div key={item.id} className="flex items-center gap-2">
                    <div
                      className={`size-[6px] rounded-full ${
                        item.tone === "strong"
                          ? "bg-[#4b72f7]"
                          : item.tone === "muted"
                            ? "bg-[#d6d9e0]"
                            : "bg-[#8b90a3]"
                      }`}
                    />
                    <p
                      className={`text-[10px] leading-[14px] tracking-[-0.1px] ${
                        item.tone === "strong"
                          ? "font-bold text-[rgba(22,22,27,0.88)]"
                          : item.tone === "muted"
                            ? "font-semibold text-[#d6d9e0]"
                            : "font-semibold text-[#8b90a3]"
                      }`}
                    >
                      {item.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function StudentFeaturePanel() {
  const sidebarMenus = [
    { id: "home", label: "홈", icon: HomeIcon, active: false },
    { id: "students", label: "학생 관리", icon: GraduationCap, active: true },
    { id: "classes", label: "수업 관리", icon: BookOpen, active: false },
    { id: "schedules", label: "스케줄 관리", icon: Calendar, active: false },
    { id: "communication", label: "소통", icon: MessageSquare, active: false },
    { id: "assistants", label: "조교 관리", icon: Headphones, active: false },
    { id: "exams", label: "시험 관리", icon: FileText, active: false },
    { id: "materials", label: "학습자료실", icon: FolderOpen, active: false },
  ] as const;

  const studentRows = [
    {
      id: "st-1",
      name: "김준영",
      status: "재원",
      school: "여사부",
      className: "고2 수학 심화반",
      contact: "010-1234-5970",
      date: "26.01.29",
      attendance: "92%",
    },
    {
      id: "st-2",
      name: "김준영",
      status: "재원",
      school: "여사부",
      className: "고2 수학 심화반",
      contact: "010-1234-5970",
      date: "26.01.29",
      attendance: "92%",
    },
    {
      id: "st-3",
      name: "김준영",
      status: "재원",
      school: "여사부",
      className: "고2 수학 심화반",
      contact: "010-1234-5970",
      date: "26.01.29",
      attendance: "92%",
    },
    {
      id: "st-4",
      name: "김준영",
      status: "재원",
      school: "여사부",
      className: "고2 수학 심화반",
      contact: "010-1234-5970",
      date: "26.01.29",
      attendance: "92%",
    },
    {
      id: "st-5",
      name: "김준영",
      status: "재원",
      school: "여사부",
      className: "고2 수학 심화반",
      contact: "010-1234-5970",
      date: "26.01.29",
      attendance: "92%",
    },
  ] as const;

  return (
    <div
      className={`h-[442px] overflow-hidden rounded-[14px] border border-[#e9ebf0] bg-[#f4f6fa] shadow-[0px_12px_40px_2px_rgba(11,18,32,0.08)] ${UNIFIED_DASHBOARD_HOVER_CLASS}`}
    >
      <div className="grid h-full grid-cols-[102px_minmax(0,1fr)] overflow-hidden">
        <aside className="border-r-[0.5px] border-[#e9ebf0] bg-white">
          <div className="flex h-12 items-center px-[15px]">
            <p className="text-[12px] font-semibold leading-4 tracking-[-0.12px] text-[#3863f6]">
              ssam B
            </p>
          </div>
          <div className="space-y-[6px] px-[8px] pt-[2px]">
            {sidebarMenus.map((menu) => (
              <div
                key={menu.id}
                className={`flex h-7 items-center gap-[7px] rounded-[6px] px-3 text-[8px] font-semibold leading-3 tracking-[-0.08px] ${
                  menu.active
                    ? "bg-[#f4f6fe] text-[#4b72f7]"
                    : "text-[rgba(22,22,27,0.28)]"
                }`}
              >
                <menu.icon className="size-[9px] shrink-0" strokeWidth={1.75} />
                {menu.label}
              </div>
            ))}
          </div>
        </aside>

        <div className="flex min-w-0 flex-col bg-white">
          <div className="flex items-center justify-between border-b-[0.5px] border-[#e9ebf0] px-[16px] py-[10px]">
            <div className="flex items-center gap-1">
              <Image
                src={sidebarLineIcon}
                alt=""
                width={11}
                height={10}
                aria-hidden
              />
              <span className="text-[8px] font-semibold leading-3 tracking-[-0.08px] text-[#8b90a3]">
                학생 관리
              </span>
            </div>

            <div className="flex items-center gap-[5px]">
              <div className="relative size-5 shrink-0">
                <Image src={profileEllipseIcon} alt="" fill aria-hidden />
                <Image src={profileTeacherIcon} alt="" fill aria-hidden />
                <div className="absolute inset-[18.6%_22.32%_30.36%_20.54%]">
                  <Image src={profileFaceIcon} alt="" fill aria-hidden />
                </div>
              </div>
              <span className="text-[9px] font-medium leading-[13px] tracking-[-0.09px] text-[#8b90a3]">
                강사 박준성
              </span>
              <Image
                src={arrowFillIcon}
                alt=""
                width={7}
                height={10}
                aria-hidden
                className="-rotate-90"
              />
            </div>
          </div>

          <div className="flex h-[70px] flex-col items-start justify-center border-b-[0.5px] border-[#e9ebf0] px-[16px] py-[14.5px]">
            <div className="flex w-full flex-col items-start gap-[3px] not-italic">
              <p className="text-[12px] font-bold leading-4 tracking-[-0.12px] text-[#040405]">
                학생 관리
              </p>
              <p className="text-[9px] font-medium leading-[13px] tracking-[-0.09px] text-[rgba(22,22,27,0.4)]">
                수업별 등록자와 오늘 출결 정보를 관리하세요.
              </p>
            </div>
          </div>

          <div className="flex flex-1 flex-col bg-[#f4f6fa] px-[14px] pb-[10px] pt-[10px]">
            <div className="rounded-[8px] border border-[#e9ebf0] bg-white px-[14px] py-[11px]">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <p className="text-[8px] font-semibold leading-3 tracking-[-0.08px] text-[#8b90a3]">
                    수업 선택
                  </p>
                  <button className="flex h-[25px] items-center gap-1 rounded-[5px] border border-[#e9ebf0] px-2 text-[8px] font-medium leading-3 tracking-[-0.08px] text-[#4a4d5c]">
                    고2 수학 A반
                    <ChevronDown className="size-[9px] text-[#8b90a3]" />
                  </button>
                </div>

                <div className="flex items-center gap-[6px]">
                  <div className="relative h-[25px] w-[182px]">
                    <Search className="pointer-events-none absolute left-2 top-1/2 size-[9px] -translate-y-1/2 text-[#b0b4c2]" />
                    <input
                      type="text"
                      value=""
                      readOnly
                      placeholder="이름, 전화번호로 검색하세요"
                      className="h-full w-full rounded-[5px] border border-[#e9ebf0] bg-white pl-6 pr-2 text-[8px] font-medium leading-3 tracking-[-0.08px] text-[#4a4d5c] placeholder:text-[#b0b4c2]"
                    />
                  </div>
                  <button className="flex h-[25px] items-center gap-1 rounded-[5px] border border-[#e9ebf0] px-2 text-[7px] font-semibold leading-[10px] tracking-[-0.07px] text-[#8b90a3]">
                    등록일 순
                    <ChevronDown className="size-[8px]" />
                  </button>
                  <button className="flex h-[25px] items-center gap-1 rounded-[5px] border border-[#e9ebf0] px-2 text-[7px] font-semibold leading-[10px] tracking-[-0.07px] text-[#8b90a3]">
                    상태 설정
                    <ChevronDown className="size-[8px]" />
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-[7px] flex items-center justify-between">
              <div className="flex items-center gap-[5px]">
                <button className="flex h-6 items-center gap-[3px] rounded-[6px] bg-[#4b72f7] px-[9px] text-[7px] font-semibold leading-[10px] tracking-[-0.07px] text-white">
                  <Users className="size-[8px]" />
                  전체 보기
                </button>
                <button className="flex h-6 items-center gap-[3px] rounded-[6px] border border-[#e9ebf0] bg-white px-[9px] text-[7px] font-semibold leading-[10px] tracking-[-0.07px] text-[#8b90a3]">
                  <UserCheck className="size-[8px]" />
                  출석 학생
                </button>
                <button className="flex h-6 items-center gap-[3px] rounded-[6px] border border-[#e9ebf0] bg-white px-[9px] text-[7px] font-semibold leading-[10px] tracking-[-0.07px] text-[#8b90a3]">
                  <UserPlus className="size-[8px]" />
                  재원생
                </button>
                <button className="flex h-6 items-center gap-[3px] rounded-[6px] border border-[#e9ebf0] bg-white px-[9px] text-[7px] font-semibold leading-[10px] tracking-[-0.07px] text-[#8b90a3]">
                  <UserX className="size-[8px]" />
                  탈원생
                </button>
              </div>

              <div className="flex items-center gap-[2px] text-[7px] font-semibold leading-[10px] tracking-[-0.07px] text-[#8b90a3]">
                <SlidersHorizontal className="size-[8px]" />
                정렬 설정
              </div>
            </div>

            <div className="mt-[5px] overflow-hidden rounded-[8px] border border-[#e9ebf0] bg-white">
              <div className="grid grid-cols-[22px_132px_56px_94px_142px_112px_70px_46px_60px] items-center border-b border-[#f4f6fa] bg-[#fcfcfd] px-3 py-[7px] text-[8px] font-semibold leading-3 tracking-[-0.08px] text-[#8b90a3]">
                <div className="size-[10px] rounded-[2px] border border-[#d6d9e0]" />
                <p>학생명</p>
                <p>상태</p>
                <p>학교</p>
                <p>수강 중인 반</p>
                <p>연락처</p>
                <p>등록일</p>
                <p>출석</p>
                <p className="text-right">설정</p>
              </div>

              {studentRows.map((row) => (
                <div
                  key={row.id}
                  className="grid grid-cols-[22px_132px_56px_94px_142px_112px_70px_46px_60px] items-center border-b border-[#f4f6fa] px-3 py-[8px] text-[8px] font-medium leading-3 tracking-[-0.08px] text-[#4a4d5c] last:border-b-0"
                >
                  <div className="size-[10px] rounded-[2px] border border-[#d6d9e0]" />

                  <div className="flex items-center gap-[5px]">
                    <div className="relative size-4 shrink-0">
                      <Image src={profileEllipseIcon} alt="" fill aria-hidden />
                      <Image src={profileTeacherIcon} alt="" fill aria-hidden />
                      <div className="absolute inset-[18.6%_22.32%_30.36%_20.54%]">
                        <Image src={profileFaceIcon} alt="" fill aria-hidden />
                      </div>
                    </div>
                    <p>{row.name}</p>
                  </div>

                  <span className="inline-flex h-[14px] w-[28px] items-center justify-center rounded-[7px] bg-[#dcfce7] text-[7px] font-semibold leading-[10px] tracking-[-0.07px] text-[#16a34a]">
                    {row.status}
                  </span>

                  <p>{row.school}</p>
                  <p>{row.className}</p>
                  <p>{row.contact}</p>
                  <p>{row.date}</p>
                  <p>{row.attendance}</p>

                  <div className="flex justify-end">
                    <button className="flex h-4 items-center gap-[1px] rounded-[4px] border border-[#e9ebf0] px-[5px] text-[7px] font-semibold leading-[10px] tracking-[-0.07px] text-[#8b90a3]">
                      설정
                      <ChevronDown className="size-[7px]" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-[6px] flex items-center justify-between px-1 text-[7px] font-medium leading-[10px] tracking-[-0.07px] text-[#b0b4c2]">
              <span>총 58명</span>
              <span>페이지 1 / 6</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function AssistantFeaturePanel() {
  const sidebarMenus = [
    { id: "home", label: "홈", icon: HomeIcon, active: false },
    { id: "students", label: "학생 관리", icon: GraduationCap, active: false },
    { id: "classes", label: "수업 관리", icon: BookOpen, active: false },
    { id: "schedules", label: "스케줄 관리", icon: Calendar, active: false },
    { id: "communication", label: "소통", icon: MessageSquare, active: false },
    { id: "assistants", label: "조교 관리", icon: Headphones, active: true },
    { id: "exams", label: "시험 관리", icon: FileText, active: false },
    { id: "materials", label: "학습 자료실", icon: FolderOpen, active: false },
  ] as const;

  const assistantCards = [
    { id: "assistant-1", name: "박준성", status: "근무 중" },
    { id: "assistant-2", name: "박준성", status: "근무 중" },
    { id: "assistant-3", name: "박준성", status: "근무 중" },
    { id: "assistant-4", name: "박준성", status: "근무 중" },
    { id: "assistant-5", name: "박준성", status: "근무 중" },
    { id: "assistant-6", name: "박준성", status: "근무 중" },
  ] as const;

  return (
    <div
      className={`h-[442px] overflow-hidden rounded-[14px] border border-[#e9ebf0] bg-[#f4f6fa] shadow-[0px_12px_40px_2px_rgba(11,18,32,0.08)] ${UNIFIED_DASHBOARD_HOVER_CLASS}`}
    >
      <div className="grid h-full grid-cols-[102px_minmax(0,1fr)] overflow-hidden">
        <aside className="border-r-[0.5px] border-[#e9ebf0] bg-white">
          <div className="flex h-12 items-center px-[15px]">
            <p className="text-[12px] font-semibold leading-4 tracking-[-0.12px] text-[#3863f6]">
              ssam B
            </p>
          </div>

          <div className="space-y-[6px] px-[8px] pt-[2px]">
            {sidebarMenus.map((menu) => (
              <div
                key={menu.id}
                className={`flex h-7 items-center gap-[7px] rounded-[6px] px-3 text-[8px] font-semibold leading-3 tracking-[-0.08px] ${
                  menu.active
                    ? "bg-[#f4f6fe] text-[#4b72f7]"
                    : "text-[rgba(22,22,27,0.28)]"
                }`}
              >
                <menu.icon className="size-[9px] shrink-0" strokeWidth={1.75} />
                {menu.label}
              </div>
            ))}
          </div>
        </aside>

        <div className="flex min-w-0 flex-col bg-white">
          <div className="flex items-center justify-between border-b-[0.5px] border-[#e9ebf0] px-[16px] py-[10px]">
            <div className="flex items-center gap-1">
              <Image
                src={sidebarLineIcon}
                alt=""
                width={11}
                height={10}
                aria-hidden
              />
              <span className="text-[8px] font-semibold leading-3 tracking-[-0.08px] text-[#8b90a3]">
                조교 관리
              </span>
            </div>

            <div className="flex items-center gap-[5px]">
              <div className="relative size-5 shrink-0">
                <Image src={profileEllipseIcon} alt="" fill aria-hidden />
                <Image src={profileTeacherIcon} alt="" fill aria-hidden />
                <div className="absolute inset-[18.6%_22.32%_30.36%_20.54%]">
                  <Image src={profileFaceIcon} alt="" fill aria-hidden />
                </div>
              </div>
              <span className="text-[9px] font-medium leading-[13px] tracking-[-0.09px] text-[#8b90a3]">
                강사 박준성
              </span>
              <Image
                src={arrowFillIcon}
                alt=""
                width={7}
                height={10}
                aria-hidden
                className="-rotate-90"
              />
            </div>
          </div>

          <div className="flex h-[70px] flex-col items-start justify-center border-b-[0.5px] border-[#e9ebf0] px-[16px] py-[14.5px]">
            <div className="flex w-full flex-col items-start gap-[3px] not-italic">
              <p className="text-[12px] font-bold leading-4 tracking-[-0.12px] text-[#040405]">
                조교 관리
              </p>
              <p className="text-[9px] font-medium leading-[13px] tracking-[-0.09px] text-[rgba(22,22,27,0.4)]">
                배정된 조교와 조교 업무를 빠르게 관리합니다
              </p>
            </div>
          </div>

          <div className="flex flex-1 flex-col bg-[#f4f6fa] px-[14px] pb-[10px] pt-[10px]">
            <div className="flex items-center gap-[12px] border-b border-[#e9ebf0] pb-[6px]">
              <button className="h-5 border-b border-[#4b72f7] px-[1px] text-[7px] font-semibold leading-[10px] tracking-[-0.07px] text-[#4b72f7]">
                재원 예정 조교 <span className="font-bold">11</span>
              </button>
              <button className="h-5 px-[1px] text-[7px] font-medium leading-[10px] tracking-[-0.07px] text-[#b0b4c2]">
                조교 계약 정보 <span className="font-semibold">05</span>
              </button>
              <button className="h-5 px-[1px] text-[7px] font-medium leading-[10px] tracking-[-0.07px] text-[#b0b4c2]">
                업무 지시내역 <span className="font-semibold">05</span>
              </button>
            </div>

            <div className="mt-[6px] grid grid-cols-4 gap-[6px]">
              <div className="rounded-[8px] border border-[#e9ebf0] bg-white px-3 py-[8px]">
                <p className="text-[7px] font-semibold leading-[10px] tracking-[-0.07px] text-[#4a4d5c]">
                  현재 배정 조교
                </p>
                <p className="text-[6px] font-medium leading-[8px] tracking-[-0.06px] text-[#8b90a3]">
                  근무 중
                </p>
                <div className="mt-[6px] text-right text-[18px] font-bold leading-5 tracking-[-0.18px] text-[#2b2e3a]">
                  8<span className="ml-[2px] text-[10px]">명</span>
                </div>
              </div>

              <div className="rounded-[8px] border border-[#e9ebf0] bg-white px-3 py-[8px]">
                <p className="text-[7px] font-semibold leading-[10px] tracking-[-0.07px] text-[#4a4d5c]">
                  현재 근무 조교
                </p>
                <p className="text-[6px] font-medium leading-[8px] tracking-[-0.06px] text-[#8b90a3]">
                  대기 중
                </p>
                <div className="mt-[6px] text-right text-[18px] font-bold leading-5 tracking-[-0.18px] text-[#2b2e3a]">
                  6<span className="ml-[2px] text-[10px]">명</span>
                </div>
              </div>

              <div className="rounded-[8px] border border-[#e9ebf0] bg-white px-3 py-[8px]">
                <p className="text-[7px] font-semibold leading-[10px] tracking-[-0.07px] text-[#4a4d5c]">
                  조교 계약서 만료
                </p>
                <p className="text-[6px] font-medium leading-[8px] tracking-[-0.06px] text-[#8b90a3]">
                  이번달 2건
                </p>
                <div className="mt-[6px] text-right text-[18px] font-bold leading-5 tracking-[-0.18px] text-[#2b2e3a]">
                  0<span className="ml-[2px] text-[10px]">건</span>
                </div>
              </div>

              <div className="rounded-[8px] border border-[#e9ebf0] bg-white px-3 py-[8px]">
                <p className="text-[7px] font-semibold leading-[10px] tracking-[-0.07px] text-[#4a4d5c]">
                  조교 계약서 관리
                </p>
                <p className="text-[6px] font-medium leading-[8px] tracking-[-0.06px] text-[#4b72f7]">
                  진행 중인 건
                </p>
                <div className="mt-[6px] text-right text-[18px] font-bold leading-5 tracking-[-0.18px] text-[#2b2e3a]">
                  9<span className="ml-[2px] text-[10px]">건</span>
                </div>
              </div>
            </div>

            <div className="mt-[6px] flex items-center justify-between">
              <div className="flex items-center gap-[6px]">
                <button className="flex h-6 items-center gap-[2px] rounded-[6px] border border-[#e9ebf0] bg-white px-[8px] text-[7px] font-semibold leading-[10px] tracking-[-0.07px] text-[#8b90a3]">
                  근무 중
                  <ChevronDown className="size-[8px]" />
                </button>
                <div className="relative h-6 w-[176px]">
                  <Search className="pointer-events-none absolute left-2 top-1/2 size-[9px] -translate-y-1/2 text-[#b0b4c2]" />
                  <input
                    type="text"
                    value=""
                    readOnly
                    placeholder="조교 이름 또는 전화번호를 검색하세요"
                    className="h-full w-full rounded-[6px] border border-[#e9ebf0] bg-white pl-6 pr-2 text-[7px] font-medium leading-[10px] tracking-[-0.07px] text-[#4a4d5c] placeholder:text-[#b0b4c2]"
                  />
                </div>
              </div>

              <span className="text-[7px] font-medium leading-[10px] tracking-[-0.07px] text-[#b0b4c2]">
                전체 58명
              </span>
            </div>

            <div className="mt-[6px] grid grid-cols-3 gap-3">
              {assistantCards.map((assistant) => (
                <article
                  key={assistant.id}
                  className="rounded-[10px] border-[0.5px] border-[#e9ebf0] bg-[#fcfcfd] p-[10px]"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-[10px]">
                      <div className="relative size-7 shrink-0 overflow-hidden rounded-[99px] border-[0.75px] border-[#f4f6fa] bg-white">
                        <Image
                          src={profileEllipseIcon}
                          alt=""
                          fill
                          aria-hidden
                        />
                        <Image
                          src={profileTeacherIcon}
                          alt=""
                          fill
                          aria-hidden
                        />
                        <div className="absolute inset-[18.6%_22.32%_30.36%_20.54%]">
                          <Image
                            src={profileFaceIcon}
                            alt=""
                            fill
                            aria-hidden
                          />
                        </div>
                      </div>
                      <div className="flex flex-col gap-px">
                        <p className="text-[12px] font-bold leading-4 tracking-[-0.12px] text-[rgba(22,22,27,0.88)]">
                          {assistant.name}
                        </p>
                        <p className="text-[9px] font-semibold leading-[13px] tracking-[-0.09px] text-[#8b90a3]">
                          조교
                        </p>
                      </div>
                    </div>
                    <span className="inline-flex items-center justify-center rounded-[8px] bg-[#e8edff] px-[6px] py-[4px] text-[7px] font-semibold leading-[10px] tracking-[-0.07px] text-[#4c6ef5]">
                      {assistant.status}
                    </span>
                  </div>

                  <div className="mt-[10px] flex flex-col gap-[2px]">
                    <div className="flex h-[15px] items-center gap-[6px]">
                      <div className="flex items-center gap-[4px]">
                        <Building2 className="size-3 text-[#b0b4c2]" />
                        <span className="w-9 text-[8px] font-semibold leading-3 tracking-[-0.08px] text-[#b0b4c2]">
                          소속 학원
                        </span>
                      </div>
                      <span className="text-[8px] font-medium leading-3 tracking-[-0.08px] text-[#4a4d5c]">
                        대전 영어학원
                      </span>
                    </div>

                    <div className="flex h-[15px] items-center gap-[6px]">
                      <div className="flex items-center gap-[4px]">
                        <BookOpen className="size-3 text-[#b0b4c2]" />
                        <span className="w-9 text-[8px] font-semibold leading-3 tracking-[-0.08px] text-[#b0b4c2]">
                          담당과목
                        </span>
                      </div>
                      <span className="text-[8px] font-medium leading-3 tracking-[-0.08px] text-[#4a4d5c]">
                        영어
                      </span>
                    </div>

                    <div className="flex h-[15px] items-center gap-[6px]">
                      <div className="flex items-center gap-[4px]">
                        <Phone className="size-3 text-[#b0b4c2]" />
                        <span className="w-9 text-[8px] font-semibold leading-3 tracking-[-0.08px] text-[#b0b4c2]">
                          전화번호
                        </span>
                      </div>
                      <span className="text-[8px] font-medium leading-3 tracking-[-0.08px] text-[#4a4d5c]">
                        010-1234-5678
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function DashboardShowcase() {
  const taskCards = [
    {
      id: "task-1",
      title: "고2 수학 A반 업무 점검",
      subtitle: "레포트용 영어 모의고사 채점",
    },
    {
      id: "task-2",
      title: "고2 수학 A반 업무 점검",
      subtitle: "레포트용 영어 모의고사 채점",
    },
  ] as const;

  const clinicItems = [1, 2, 3, 4] as const;

  return (
    <div className="relative overflow-hidden rounded-[22px] border border-[#e9edf7] bg-[#eef2fa] p-[12px] md:[zoom:1.1] lg:p-[18px] lg:[zoom:1.24]">
      <div className="grid gap-[14px] lg:grid-cols-[560px_230px] lg:justify-center">
        <div className="space-y-[14px]">
          <section className="rounded-[10px] border border-[#e9ebf0] bg-white p-[11px] lg:max-w-[560px] lg:p-[13px]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold leading-[14px] tracking-[-0.1px] text-[#4a4d5c]">
                  최근 문의 요청사항
                </p>
                <p className="text-[7px] font-medium leading-[10px] tracking-[-0.07px] text-[rgba(22,22,27,0.28)]">
                  최근 문의 요청을 확인하세요
                </p>
              </div>
              <span className="flex h-6 items-center justify-center rounded-[7px] border border-[#e9ebf0] bg-[#f7f8fa] px-[10px] text-[7px] font-semibold leading-[10px] tracking-[-0.07px] text-[#8b90a3]">
                전체보기
              </span>
            </div>

            <div className="mt-[8px] overflow-hidden rounded-[9px] border border-[#e9ebf0] bg-white">
              <div className="grid h-[26px] grid-cols-[1fr_60px_60px_60px] items-center border-b border-[#f4f6fa] bg-[#fcfcfd] px-3 text-[7px] font-semibold leading-[10px] tracking-[-0.07px] text-[#8b90a3]">
                <p className="pl-[8px]">내용</p>
                <p className="text-center">작성자</p>
                <p className="text-center">등록일</p>
                <p className="text-center">상태</p>
              </div>

              {[1, 2, 3, 4, 5].map((row) => (
                <div
                  key={`dashboard-inquiry-${row}`}
                  className="grid h-[28px] grid-cols-[1fr_60px_60px_60px] items-center border-b border-[#f4f6fa] px-3 last:border-b-0"
                >
                  <div className="flex items-center gap-1 overflow-hidden pl-[8px] text-[7px] font-medium leading-[10px] tracking-[-0.07px] text-[rgba(22,22,27,0.88)]">
                    <p className="truncate">
                      수학(하) 2단원 문제 풀이 질문입니다.
                    </p>
                    <span className="text-[6px] font-bold leading-[9px] tracking-[-0.06px] text-[#3863f6]">
                      (1)
                    </span>
                  </div>
                  <div className="text-center text-[7px] font-medium leading-[10px] tracking-[-0.07px] text-[rgba(22,22,27,0.88)]">
                    김철수
                    <span className="ml-1 text-[6px] leading-[9px] text-[rgba(22,22,27,0.4)]">
                      학생
                    </span>
                  </div>
                  <p className="text-center text-[7px] font-medium leading-[10px] tracking-[-0.07px] text-[rgba(22,22,27,0.88)]">
                    26.01.29
                  </p>
                  <div className="mx-auto flex h-[14px] w-[34px] items-center justify-center rounded-[7px] bg-[#dcfce7] text-[6px] font-semibold leading-[9px] tracking-[-0.06px] text-[#16a34a]">
                    답변 등록
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[10px] border border-[#e9ebf0] bg-white p-[11px] lg:max-w-[560px] lg:p-[13px]">
            <div className="mb-[10px] flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold leading-[14px] tracking-[-0.1px] text-[#4a4d5c]">
                  강사 업무 지시 내역
                </p>
                <p className="text-[7px] font-medium leading-[10px] tracking-[-0.07px] text-[rgba(22,22,27,0.28)]">
                  조교 업무 진행률을 확인하세요
                </p>
              </div>
              <span className="flex h-6 items-center justify-center rounded-[7px] border border-[#e9ebf0] bg-[#f7f8fa] px-[10px] text-[7px] font-semibold leading-[10px] tracking-[-0.07px] text-[#8b90a3]">
                업무 내역
              </span>
            </div>

            <div className="grid gap-[8px] sm:grid-cols-2">
              {taskCards.map((task) => (
                <article
                  key={task.id}
                  className="rounded-[9px] border border-[#e9ebf0] bg-[#fcfcfd] p-[9px]"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[9px] font-semibold leading-[13px] tracking-[-0.09px] text-[#040405]">
                        {task.title}
                      </p>
                      <p className="text-[7px] font-medium leading-[10px] tracking-[-0.07px] text-[rgba(22,22,27,0.4)]">
                        {task.subtitle}
                      </p>
                    </div>
                    <span className="rounded-[6px] bg-[#dcfce7] px-2 py-[3px] text-[6px] font-semibold leading-[9px] tracking-[-0.06px] text-[#16a34a]">
                      진행 중
                    </span>
                  </div>

                  <div className="mt-[7px] flex items-center gap-2">
                    <div className="h-[3px] flex-1 rounded-full bg-[#e1e7fe]">
                      <div className="h-[3px] w-[62%] rounded-full bg-[#3863f6]" />
                    </div>
                    <span className="text-[7px] font-bold leading-[10px] tracking-[-0.07px] text-[#3863f6]">
                      62%
                    </span>
                  </div>

                  <div className="mt-[7px] flex items-center gap-[6px] border-t border-[#edf0f6] pt-[6px]">
                    <div className="relative size-3.5 shrink-0">
                      <Image src={profileEllipseIcon} alt="" fill aria-hidden />
                      <Image src={profileTeacherIcon} alt="" fill aria-hidden />
                      <div className="absolute inset-[18.6%_22.32%_30.36%_20.54%]">
                        <Image src={profileFaceIcon} alt="" fill aria-hidden />
                      </div>
                    </div>
                    <p className="text-[7px] font-medium leading-[10px] tracking-[-0.07px] text-[#8b90a3]">
                      담당 조교 박준성
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>

        <aside className="space-y-[12px]">
          <section className="rounded-[10px] border border-[#e9ebf0] bg-white px-[9px] pb-[11px] pt-[12px]">
            <div className="mb-[8px] flex items-center justify-between">
              <div className="flex items-center gap-[6px]">
                <p className="text-[11px] font-bold leading-[15px] tracking-[-0.11px] text-[#4a4d5c]">
                  오늘 일정
                </p>
                <p className="text-[7px] font-medium leading-[10px] tracking-[-0.07px] text-[rgba(22,22,27,0.28)]">
                  2026. 01. 28
                </p>
              </div>
              <span className="text-[7px] font-semibold leading-[10px] tracking-[-0.07px] text-[#b0b4c2]">
                더보기
              </span>
            </div>

            <div className="relative space-y-[6px] pl-[9px]">
              <div className="absolute bottom-1 left-[2px] top-1 w-px bg-[#e9ebf0]" />
              {timetable.map((item) => (
                <div
                  key={`dash-${item.id}`}
                  className="flex items-center gap-[5px]"
                >
                  <span
                    className={`size-[5px] rounded-full ${
                      item.tone === "strong"
                        ? "bg-[#4b72f7]"
                        : item.tone === "muted"
                          ? "bg-[#d6d9e0]"
                          : "bg-[#8b90a3]"
                    }`}
                  />
                  <p
                    className={`text-[8px] leading-3 tracking-[-0.08px] ${
                      item.tone === "strong"
                        ? "font-bold text-[rgba(22,22,27,0.88)]"
                        : item.tone === "muted"
                          ? "font-semibold text-[#d6d9e0]"
                          : "font-semibold text-[#8b90a3]"
                    }`}
                  >
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[10px] border border-[#e9ebf0] bg-white px-[9px] pb-[11px] pt-[12px]">
            <div className="mb-[8px] flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold leading-[15px] tracking-[-0.11px] text-[#4a4d5c]">
                  클리닉
                </p>
                <p className="text-[7px] font-medium leading-[10px] tracking-[-0.07px] text-[rgba(22,22,27,0.28)]">
                  예정된 클리닉 일정을 확인하세요
                </p>
              </div>
              <span className="text-[7px] font-semibold leading-[10px] tracking-[-0.07px] text-[#b0b4c2]">
                더보기
              </span>
            </div>

            <div className="space-y-[6px]">
              {clinicItems.map((clinic) => (
                <div
                  key={`clinic-card-${clinic}`}
                  className="rounded-[7px] border border-[#e9ebf0] bg-[#fcfcfd] px-[7px] py-[6px]"
                >
                  <p className="text-[7px] font-semibold leading-[10px] tracking-[-0.07px] text-[#8b90a3]">
                    26.02.18
                  </p>
                  <p className="truncate text-[7px] font-semibold leading-[10px] tracking-[-0.07px] text-[#4a4d5c]">
                    [A빈] 영어 듣기 평가 (30명)
                  </p>
                </div>
              ))}
            </div>
          </section>
        </aside>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[88px] bg-gradient-to-b from-transparent via-[#eef2fa]/70 to-[#eef2fa]" />
    </div>
  );
}
