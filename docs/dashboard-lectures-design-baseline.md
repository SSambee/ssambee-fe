# Dashboard / 수업관리 디자인 기준선

## 목적

- 대시보드(`홈`)와 수업관리 페이지를 시각 기준점으로 고정한다.
- 다른 페이지/모달은 기능 변경 없이 CSS(클래스)만으로 동일한 톤으로 맞춘다.
- Figma MCP가 불안정하거나 제한될 때도 로컬 기준으로 일관되게 적용한다.

## 기준 페이지(소스 오브 트루스)

- 홈 헤더: `src/app/(dashboard)/educators/_components/dashboard/DashboardHeader.tsx`
- 홈 카드/테이블/사이드카드:
  - `src/app/(dashboard)/educators/_components/dashboard/DashboardStatCards.tsx`
  - `src/app/(dashboard)/educators/_components/dashboard/DashboardInquiryTable.tsx`
  - `src/app/(dashboard)/educators/_components/dashboard/DashboardTaskList.tsx`
  - `src/app/(dashboard)/educators/_components/dashboard/DashboardTodayTimeline.tsx`
  - `src/app/(dashboard)/educators/_components/dashboard/DashboardClinicCard.tsx`
- 수업관리 헤더/리스트/디테일 모달:
  - `src/app/(dashboard)/educators/lectures/_components/LecturesHeader.tsx`
  - `src/app/(dashboard)/educators/lectures/_components/LecturesList.tsx`
  - `src/app/(dashboard)/educators/lectures/_detail-modal/LectureDetailModal.tsx`
  - `src/app/(dashboard)/educators/lectures/_detail-modal/LectureDetailHeader.tsx`

## 공통 시각 토큰(현재 코드 기준)

- 색상
  - Primary: `#3863f6` / hover `#2f57e8`
  - Border strong: `#d6d9e0`
  - Border soft: `#eaecf2`, `#e9ebf0`, `#f4f6fa`
  - Text strong: `#040405`, `#4a4d5c`
  - Text muted: `#8b90a3`, `rgba(22,22,27,0.4)`
- 라운드
  - 메인 카드: `rounded-[24px]`
  - 내부 카드/아이템: `rounded-[20px]`, `rounded-[12px]`
  - 필/배지: `rounded-full`, `rounded-lg`
- 그림자
  - 카드/버튼에서 `shadow-[0_0_14px_rgba(138,138,138,0.08)]` 계열 사용
- 타이포
  - 페이지 타이틀: `30/36px bold`
  - 섹션 타이틀: `20/24px bold`
  - 본문/설명: `16px medium`, 보조 `14px`

## 레이아웃 패턴

- 페이지 컨테이너: `container mx-auto space-y-8 p-6`
- 상단 헤더 블록: `-mx-6 -mt-6 border-b ... bg-white px-6 py-6`
- 메인 2열: `grid gap-6 xl:grid-cols-[1fr_440px]`
- 섹션 카드: `rounded-[24px] border bg-white p-5 sm:p-6`

## 컴포넌트 패턴

- 버튼
  - Primary: blue 배경 + 흰색 텍스트 + 약한 shadow
  - Secondary: 연한 blue 배경 + blue 텍스트
  - 링크형 "더보기": `rounded-full`, 작은 텍스트, hover 색 변화
- 입력/셀렉트
  - 높이 `h-12`/`h-14`, 보더 `#d6d9e0`, 텍스트 `#8b90a3`
  - 셀렉트는 가능하면 `SelectBtn variant="figma"` 우선 사용
- 카드 리스트
  - 외곽 카드 + 내부 상/하단 영역 분리(`border-t`)
  - 상태 배지(진행중/대기/완료) 색상 체계 고정

## 모달 패턴(우선순위)

1. 수업/일정 계열 모달 패턴(우선)

- 예: `LectureDetailModal`, `ScheduleCreateModal`
- 특징: `rounded-[24px~32px]`, 섀도우, 헤더/본문/푸터 계층 분리, 버튼 톤 통일

2. 구형 기본 모달 패턴(점진 치환)

- 예: `max-w-md`, 단순 `DialogContent`
- 변경 시 동작은 유지하고 껍데기 클래스만 1) 패턴으로 정렬

## 연결 페이지/동선 맵(디자인 적용 우선순위)

- 홈 → 수업관리: `DashboardStatCards`, `DashboardTodayTimeline`
- 홈 → 소통: `DashboardInquiryTable`
- 홈 → 조교 업무/이력: `DashboardTaskList`
- 홈 → 클리닉: `DashboardClinicCard`
- 수업관리 → 수업개설/일정: `useLecturesPage` 라우팅(`openCreateLecture`, `openSchedules`)

## 적용 원칙 (기능 불변)

- 허용: spacing/typography/color/border/shadow/shape 변경
- 금지: 상태 로직, API, 라우팅, 모달 열기/닫기 흐름 변경
- 이벤트 핸들러와 props 계약은 유지하고 className만 조정

## 실행 절차

1. 대상 페이지의 기준 컴포넌트를 찾는다(헤더/카드/모달).
2. 기준 페이지 클래스와 비교해 차이만 반영한다.
3. 모달은 shell -> header -> body -> footer 순서로 맞춘다.
4. `lsp_diagnostics` + `pnpm run type-check`로 검증한다.

## PR 체크리스트

- [ ] 기능/라우팅/상태 변경 없음
- [ ] 대시보드/수업관리와 동일한 카드/버튼/입력 톤 사용
- [ ] 모달 라운드/보더/shadow 기준 일치
- [ ] 타입체크 통과
