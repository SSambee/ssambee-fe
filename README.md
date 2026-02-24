![SSam B Logo](assets/ssam-b-logo.png)

# SSam B 프론트엔드

이 레포는 **SSam B** 학원/수업 운영 플랫폼의 **프론트엔드(Next.js)** 입니다.
강사/조교(MGMT)와 학생/학부모(SVC) 사용자를 위한 화면과 대시보드를 제공합니다.

## 주요 기능(화면/라우트 기준)

- 랜딩: `/`
- 인증
  - 강사/조교: `/educators/login`, `/educators/instructor-register`, `/educators/assistant-register`
  - 학생/학부모: `/learners/login`, `/learners/register`
- 대시보드(강사/조교): `/educators/*`
  - 강의/수강생: `/educators/lectures`, `/educators/students`
  - 일정: `/educators/schedules`
  - 시험/리포트: `/educators/exams`
  - 조교 관리: `/educators/assistants`
  - 커뮤니케이션: `/educators/communication`
  - 자료실: `/educators/materials`
  - 프로필: `/educators/profile`
- 대시보드(학생/학부모): `/learners/*`
  - 수강/상세: `/learners/lectures`
  - 커뮤니케이션: `/learners/communication`
  - 자료실: `/learners/materials`
  - 프로필: `/learners/profile`
- 조교 승인/서명 대기: `/pending-approval`

## 권한/역할 흐름(요약)

- URL 기준으로 역할을 구분합니다: `/educators/*` → `MGMT`(강사/조교), `/learners/*` → `SVC`(학생/학부모)
- 세션은 쿠키 기반이며, API 호출은 role에 따라 서로 다른 base URL을 사용합니다(`NEXT_PUBLIC_API_BASE_URL`, `NEXT_PUBLIC_API_BASE_URL_SVC`)
- 조교(ASSISTANT)는 가입/서명 상태(`signStatus`)가 `SIGNED`가 아니면 `/pending-approval`로 이동합니다

## 기술 스택

- Framework: Next.js `16.1.6` (App Router, RSC)
- Language: TypeScript `^5`
- UI: React `19.2.4`, Tailwind CSS `4`, shadcn/ui + Radix UI
- Data Fetching: Axios + TanStack Query(React Query)
- State: Zustand (화면/도메인 UI 상태)
- Form/Validation: React Hook Form + Zod
- 기타: Recharts, react-big-calendar, react-day-picker, TipTap, @react-pdf/renderer
- Observability: Sentry (server/edge/client)
- Test: Jest (일부 `src/services/**` 테스트)

## 로컬 실행

### 요구사항

- Node.js `24.13.0` (`.nvmrc`, `package.json#engines`)
- pnpm `10.28.0` (`package.json#packageManager`)

### 설치/실행

```bash
pnpm install
cp .env.example .env.local
pnpm run prepare
pnpm dev
```

## 코드 구조

- `src/app`: 라우팅(페이지/레이아웃/메타/에러 처리)
- `src/components`: 공용 컴포넌트 (`src/components/ui`는 shadcn/ui)
- `src/services`: axios client + 도메인별 API 호출 (mapper 포함)
- `src/providers`: React Query/Auth/Modal/Breadcrumb 등 상위 Provider
- `src/stores`: Zustand store
- `src/hooks`: 재사용 훅
- `src/types`, `src/validation`: 타입 정의, Zod 스키마
- `src/utils`, `src/constants`: 유틸/상수

## 스크립트

- 개발/빌드: `pnpm dev`, `pnpm build`, `pnpm start`
- 품질: `pnpm lint`, `pnpm lint:fix`, `pnpm format`, `pnpm format:check`, `pnpm type-check`
- 테스트: `pnpm test`
- 체크: `pnpm check:commit`(lint+format), `pnpm check:push`(type-check+test)

## 배포/운영 메모

- Vercel배포를 전제로 합니다.
- Sentry는 `next.config.ts`에서 `withSentryConfig`로 설정되어 있고, client 초기화는 `src/instrumentation-client.ts`에서 수행합니다.
  - tunnel route: `/monitoring`
