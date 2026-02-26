<div align="center">

![SSam B Logo](assets/ssam-b-logo.png)

### **강사 중심 올인원 학습 운영 관리 시스템**

수업 운영부터 학생 관리까지 SSam B에서 한번에 운영하세요

![Ssam B Landing](assets/ssamb_landing.png)

</div>

---

- ### **URL** | www.ssambee.com
- ### **FE** | https://github.com/EduOps-Lab/ssambee-fe
- ### **BE** | https://github.com/EduOps-Lab/ssambee-be

---

## 📋 목차

- [❤️ 프로젝트 개요](#-프로젝트-개요)
- [✨ 주요 기능](#-주요-기능)
- [🛠 기술 스택](#-기술-스택)
- [🌐 시스템 아키텍처](#-시스템-아키텍처)
- [🛸 팀 소개](#-팀-소개)
- [🥊 트러블 슈팅](#-트러블-슈팅)
- [🚀 빠른 시작](#-빠른-시작)
- [📂 프로젝트 구조](#-프로젝트-구조)
- [🔒 권한 및 인증](#-권한-및-인증)
- [📜 스크립트 가이드](#-스크립트-가이드)
- [🚢 배포 및 운영](#-배포-및-운영)

---

## ❤️ 프로젝트 개요

### 🍯🐝 Ssam B (쌤비)

> **"강사의 1시간을 10분으로"**
> 파편화된 도구를 하나로 통합한 강사 전용 올인원 운영 솔루션

**SsamB**는 선생님 곁에서 수업 외의 모든 일을 묵묵히 도와주는 가장 성실한 조력자, **꿀벌(Bee)** 같은 서비스입니다.

강사가 수업 준비, 출결, 성적 관리, 소통에 소모하는 물리적 시간을 최소화하고 교육 본연의 가치에 집중할 수 있도록 돕는 **강사 전용 운영(Admin) 솔루션**입니다.

기존의 파편화된 도구(엑셀, 카카오톡, 노션, 구글 캘린더 등)를 하나로 통합하여 **[수업 생성 → 출결 → 시험/성적 → 공지/소통]** 으로 이어지는 강사의 데일리 워크플로우를 최적화합니다.

### 🎯 핵심 타겟

- 🛠 **1인 강사**: 모든 관리를 혼자 해야 하는 효율 중심 강사
- 🏫 **대형 학원 팀**: 체계적인 업무 분담과 기록 공유가 필요한 팀
- 📋 **운영 조교**: 빠르고 정확한 업무 수행과 보고가 필요한 조교

### ✨ 핵심 가치

| ⚡ Fast                                    | 📂 Integrated                                  | 🛡️ Reliable                                       |
| :----------------------------------------- | :--------------------------------------------- | :------------------------------------------------ |
| **빠른 입력과 확인**                       | **분산된 데이터의 통합**                       | **정확하고 투명한 기록**                          |
| 1~2회의 클릭으로 <br>오늘의 모든 운영 처리 | 반-학생-학부모 정보를 <br>하나의 흐름으로 연결 | 상담 및 클레임 대응을 위한 <br>데이터 무결성 확보 |

### 👥 사용자 역할

| 역할                                                                             | 핵심 목표                                        | 주요 권한 및 기능                                                                                                                                 |
| :------------------------------------------------------------------------------- | :----------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------ |
| <img src="https://img.shields.io/badge/강사-Admin-red?style=flat-square" />      | **운영 효율 극대화** 및<br>학습 데이터 통합 관리 | • 반(Class) 생성 및 전체 시간표 관리<br>• 출결/성적 입력 및 최종 확정(Lock)<br>• 공지사항 발송 및 발송 이력 확인<br>• 조교 업무 배정 및 문의 답변 |
| <img src="https://img.shields.io/badge/조교-Staff-orange?style=flat-square" />   | **운영 보조** 및<br>배정된 업무의 정확한 수행    | • 부여된 반의 출결 및 성적 대행 입력<br>• 배정된 업무(Tasks) 상태 관리 (진행/완료)<br>• 허용된 범위 내 학생/학부모 문의 답변                      |
| <img src="https://img.shields.io/badge/학생-Student-blue?style=flat-square" />   | **학습 현황 파악** 및<br>원활한 질의응답         | • 수업 시간표 및 재시험(클리닉) 일정 확인<br>• 출결 현황 및 성적 리포트 조회<br>• 강사/조교 대상 1:1 학습 문의 작성                               |
| <img src="https://img.shields.io/badge/학부모-Parent-green?style=flat-square" /> | **자녀 관리 상태 확인** 및<br>필수 공지 수신     | • 자녀의 실시간 출결 상태 및 성적 확인<br>• 학원 공지 및 자녀 대상 개별 공지 확인<br>• 자녀 학습 관련 상담 문의 작성                              |

### 🛠 서비스 핵심 기능

1.  **반(Class) & 일정**: 요일/시간 설정 시 수업 세션 자동 생성
2.  **출결 관리**: 수정 이력이 남는 투명한 출결 시스템
3.  **시험/성적**: 점수 기반 **재시험(클리닉) 대상자 자동 분류**
4.  **공지/소통**: 대상별 발송 기록 관리 및 타임라인 기반 Q&A

---

## ✨ 주요 기능

### 🏠 랜딩 페이지

- 메인 랜딩: `/`

### 🔐 인증 시스템

**강사/조교 (Educators)**

- 로그인: `/educators/login`
- 강사 회원가입: `/educators/instructor-register`
- 조교 회원가입: `/educators/assistant-register`

**학생/학부모 (Learners)**

- 로그인: `/learners/login`
- 회원가입: `/learners/register`

### 👨‍🏫 강사/조교 대시보드 (`/educators/*`)

| 기능           | 라우트                     | 설명                     |
| -------------- | -------------------------- | ------------------------ |
| 🧩 홈          | `/educators`               | 메인 대시보드            |
| 👤 프로필      | `/educators/profile`       | 개인 정보 관리           |
| 👥 학생 관리   | `/educators/students`      | 수강생 정보 및 출결 관리 |
| 📚 수업 관리   | `/educators/lectures`      | 강의 생성, 수정, 조회    |
| 📅 일정 관리   | `/educators/schedules`     | 수업 일정 및 캘린더      |
| 💬 소통        | `/educators/communication` | 공지사항 작성, 문의 답변 |
| 🤝 조교 관리   | `/educators/assistants`    | 조교 권한 및 업무 관리   |
| 📝 시험/리포트 | `/educators/exams`         | 평가 및 성적 관리        |
| 📂 자료실      | `/educators/materials`     | 학습 자료 업로드 및 공유 |

### 🎓 학생/학부모 대시보드 (`/learners/*`)

| 기능             | 라우트                    | 설명                        |
| ---------------- | ------------------------- | --------------------------- |
| 🧩 메인 대시보드 | `/learners`               | 메인 대시보드               |
| 👤 프로필        | `/learners/profile`       | 개인 정보 관리              |
| 📖 나의 강의     | `/learners/lectures`      | 수강 중인 강의 및 상세 정보 |
| 💬 소통          | `/learners/communication` | 공지사항 확인, 문의글 작성  |

### ⏳ 기타

- 조교 승인 대기: `/pending-approval`

---

## 🛠 기술 스택

### 🏗 Core

<p>
  <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white"/>
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white"/>
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white"/>
  <img src="https://img.shields.io/badge/pnpm-F69220?style=for-the-badge&logo=pnpm&logoColor=white"/>
</p>

### 🎨 UI / UX

<p>
  <img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black"/>
  <img src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white"/>
  <img src="https://img.shields.io/badge/shadcn/ui-111111?style=for-the-badge"/>
  <img src="https://img.shields.io/badge/Radix_UI-161618?style=for-the-badge"/>
  <img src="https://img.shields.io/badge/Recharts-FF6384?style=for-the-badge"/>
  <img src="https://img.shields.io/badge/TipTap-000000?style=for-the-badge"/>
</p>

### ⚙ State & Data

<p>
  <img src="https://img.shields.io/badge/TanStack_Query-FF4154?style=for-the-badge"/>
  <img src="https://img.shields.io/badge/Zustand-443E38?style=for-the-badge"/>
  <img src="https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white"/>
  <img src="https://img.shields.io/badge/React_Hook_Form-EC5990?style=for-the-badge"/>
  <img src="https://img.shields.io/badge/Zod-3E67B1?style=for-the-badge"/>
</p>

### 🩺 Quality

<p>
  <img src="https://img.shields.io/badge/Sentry-362D59?style=for-the-badge&logo=sentry&logoColor=white"/>
  <img src="https://img.shields.io/badge/Jest-C21325?style=for-the-badge&logo=jest&logoColor=white"/>
  <img src="https://img.shields.io/badge/ESLint-4B32C3?style=for-the-badge&logo=eslint&logoColor=white"/>
  <img src="https://img.shields.io/badge/Prettier-F7B93E?style=for-the-badge&logo=prettier&logoColor=black"/>
</p>

---

## 🌐 시스템 아키텍처

~~

---

## 🛸 팀 소개

|                   👑 박창기                    |                    이유리                    |                          임경민                           |                     김윤기                      |
| :--------------------------------------------: | :------------------------------------------: | :-------------------------------------------------------: | :---------------------------------------------: |
| ![창기](https://github.com/p-changki.png?s=20) | ![유리](https://github.com/yoorrll.png?s=20) | ![경민](https://github.com/play-ancora-gyungmin.png?s=20) | ![윤기](https://github.com/rklpoi5678.png?s=20) |
|                  PM & 프론트                   |                    프론트                    |                          백엔드                           |                  백엔드 & 배포                  |

---

## 🥊 트러블 슈팅

### 🐰 이유리

<details>
<summary><strong>로그아웃 후 페이지 접근 권한 문제</strong></summary>

  - **개요**
      - **문제**: 사용자가 로그아웃한 뒤 브라우저의 ‘뒤로가기’ 버튼을 누르면 이전에 보던 대시보드 화면과 데이터가 그대로 노출된다.
      - **목표**: 로그아웃 시 메모리를 완전히 초기화하고, 비인증 상태에서의 페이지 재진입을 데이터의 노출 없이 차단한다.
  - **원인 분석**
      - 로그아웃 시 기존의 `router.replace` 를 이용한 이동은 자바스크립트 메모리 상태를 유지하여 브라우저 히스토리 스택에 이전 페이지를 남긴다.
      - `setUser(null)` 만으로는 브라우저 히스토리에 남은 이전 페이지의 렌더링을 막지 못한다.
      - 레이아웃 단에서 실시간 유저 상태를 감시하여 렌더링을 제어하는 로직이 없다.
      - TanStack Query 캐시가 삭제되지 않아 비인증 상태에서도 이전 메모리 데이터를 불러온다.
  - **해결 방법**
      - **캐싱 데이터 제거**: `queryClient.clear()` 를 호출하여 브라우저 메모리에 캐싱된 API 응답을 삭제하고 뒤로가기 시 데이터 잔상이 남는 것을 방지한다.
      - **하드 네비게이션**: `window.location.replace` 를 통한 하드 네비게이션으로 브라우저 메모리를 초기화하고, 히스토리 스택에서 현재 페이지를 제거한 후 로그인 페이지로 이동한다.
      - **렌더링 차단 가드**: 대시보드로 접근할 때 `Layout`에서 유저 상태를 감시한다.
          - 세션 체크 중에는 로딩 스피너를 노출하여 미확인 상태의 접근을 대기시킨다.
          - `!user` 일 경우 `null`을 반환하여 데이터 노출을 허용하지 않는다.
  - **동작 결과**
      - 로그아웃 버튼 클릭 → 로그아웃 API 호출 → `setUser(null)` → Tanstack Query 캐시 삭제 → `window.location.replace` 에 의한 브라우저 하드 리프레시 → 모든 메모리를 초기화하고 로그인 창으로 이동
      - 로그이웃 후 뒤로가기 → `AuthProvider`에서 세션 체크 (`isLoading: true`) → 레이아웃이 로딩 UI 렌더링 → 세션 없음 확정 → 본문 렌더링 전 null 반환 → 즉시 로그인 페이지로 강제 이동

</details>

<details>
<summary><strong>Tiptap JSON 도입을 통한 에디터 보안 및 데이터 호환성 해결</strong></summary>

  - **개요**
      - **문제**: 기존 HTML 문자열 저장 방식은 `dangerouslySetInnerHTML` 을 사용해야 하는데, 이는 XSS(크로스 사이트 스크립팅)공격에 취약하다. 또한 JSON 도입 이후 레거시 데이터(일반 텍스트)와 신규 에디터 포맷 간의 충돌 위험이 존재한다.
      - **목표**: Tiptap의 JSON 스키마 기반 렌더링을 도입하여 보안 라이브러리(DOMPurify) 의존성을 제거하고, 하위 호환성을 보장하는 안전한 데이터 마이그레이션 체계를 구축한다. ****
  - **원인 분석**
      - **보안 취약**: HTML 저장 방식은 브라우저가 `<script>` , `onmouseover` 등의 악성 코드를 그대로 실행할 수 있어 매번 복잡한 살균(Sanitize) 과정이 필요하다.
      - **플랫폼 불일치**: HTML은 웹 이외의 환경(모바일 앱 등)에서 데이터 일관성을 유지하기 어렵다.
  - **해결 방법**
      - **스키마 기반 보안**
          - **DOMPurify 대체**: Tiptap은 정의된 Extensions(StarterKit 등)에 명시된 노드만 렌더링하기 때문에 JSON에 악성 스크립트(`type: “script`)를 강제 주입해도 스키마에 정의되지 않으면 무시된다.
          - **자동 이스케이프**: 텍스트 데이터가 `textContent` 와 유사한 방식으로 처리되어 `<` `>` 기호가 HTML 태그가 아닌 단순 문자로 안전하게 출력된다.
      - **런타임 데이터 어댑터**
          - **`getParsedContent` 구현**: `try-catch` 를 활용하여 신규 JSON 데이터와 레거시 텍스트 데이터를 동시에 수용한다.

              ```jsx
              // undefined 방어 + 타입 명시 + 에디터 표준 구조 반환
              const getParsedContent = (content: string | undefined): JSONContent => {
                // 데이터가 없으면 Tiptap의 최소 기본 구조 반환
                if (!content) return { type: "doc", content: [] };
              
                try {
                  return JSON.parse(content);
                } catch {
                  // 레거시 텍스트 데이터를 Tiptap 노드 구조로 변환 (하위 호환성)
                  return {
                    type: "doc",
                    content: [
                      { 
                        type: "paragraph", 
                        content: [{ type: "text", text: content }] 
                      },
                    ],
                  };
                }
              };
              ```
          - **강제 래핑**: 파싱 실패 시 레거시 문자열을 Tiptap 표준 트리 구조(`doc > paragraph > text`)로 즉석에서 변환하여 데이터 유실 없이 출력한다.
      - **상태 직렬화**
          - 저장(Create/Edit): `editor.getJSON()` 으로 획득한 객체를 `JSON.stringify()` 해서 DB에 저장한다.
          - 출력(View): `readOnly={true}` 속성을 통해 툴바 없이 본문만 안전하게 렌더링한다.
  - **동작 결과**
      - **작성 시**: 사용자 입력을 실시간 JSON 트리로 관리하여 데이터 무결성을 확보한다.
      - **조회 시**: `readOnly` 모드에서 엔진이 직접 DOM을 제어하므로 공격 접점을 없앤다.
      - **수정 시**: 옛날 글을 불러와 수정하고 저장하면 자연스럽게 최신 JSON 포맷으로 마이그레이션이 진행된다.

</details>

<details>
<summary><strong>Windows 환경 이메일 발송 테스트 시 보안 연결 리셋 (ECONNRESET) 대처</strong></summary>
  
  - **개요**

      ```jsx
      2026-02-22T10:43:05.035Z ERROR [Better Auth]: Failed to run background task: Error: read ECONNRESET
      
          at TLSWrap.onStreamRead (node:internal/stream_base_commons:216:20) {
      
        errno: -4077,
      ```
      - **실제 로그**: `ERROR [Better Auth]: Failed to run background task: Error: read ECONNRESET (errno: -4077)`
      - **문제**: 이메일 발송 기능을 테스트할 때 외부 서버와의 보안 연결(TLS) 도중 통신이 강제로 끊기는 현상이 발생했다.
      - **특이사항**: 동일한 설정임에도 macOS/Linux 환경의 팀원들에게는 발생하지 않고, Windows 환경에서만 이메일 인증 발송 시 에러가 발생했다.
  - **원인 분석**
      - **보안 핸드쉐이크 실패:** Node.js가 외부 메일 서버와 TLS 연결을 맺을 때, 윈도우  운영체제의 방화벽이나 백신 프로그램이 패킷을 가로채 검사(SSL Inspection)를 시도한다.
      - **강제 연결 리셋 (`ECONNRESET`):** 보안 프로그램이 자체 인증서를 중간에 끼워 넣거나 통신 구조를 변경하면서 Node.js가 이를 비정상적인 접근으로 간주했고, 결과적으로 윈도우 소켓 인터페이스에서 연결을 물리적으로 끊어버리는 `-4077` 에러가 발생
  - **해결 방법**
      - **로컬 개발 환경의 환경 변수에 `NODE_TLS_REJECT_UNAUTHORIZED=0` 설정 추가**
          - Node.js의 보안 검증 절차를 일시적으로 완화하여 윈도우 시스템의 간섭이나 신뢰할 수 없는 인증서 체인 환경에서도 통신 세션을 유지하도록 허용한다.
          - 해당 설정은 보안 가드를 끄는 행위이기 때문에 로컬 개발 환경 한정으로 적용했다.
  - **결과**
      - **작업 정상 진행**: 윈도우 로컬 환경에서 발생하는 `ECONNRESET` 에러를 제거하고 진행 중이던 이메일 발송 기능 테스트를 완료했다.
      - **환경별 대응 전략**: OS별 네트워크 보안 정책의 차이를 이해하고, 개발 환경에서만 보안 검증 절차를 일시적으로 완화하여 개발을 진행했다.
  - **교훈**
      - 배포 서버는 표준 인증 체계를 따르기 때문에 문제가 없지만, 로컬 개발 환경의 특수성을 이해하고 해당 에러에 환경 변수를 통해 대응하는 법을 배웠다.

</details>

<details>
<summary><strong>useSearchParams 사용 시 빌드 에러 해결</strong></summary>

  - **문제 상황**
      
      ```jsx
      Error: useSearchParams() should be wrapped in a suspense boundary at page "/learners/communication".
      Read more: https://nextjs.org/docs/messages/missing-suspense-with-csr-bailout
      ```
      
      - `useSearchParams` 훅을 사용하는 `TabSectionSVC` 컴포넌트를 포함한 페이지가 빌드 시 에러를 발생시킨다.
  - **원인 분석**
      - `useSearchParams()` 는 사용자가 어떤 URL 주소(`?tab=NOTICE`)로 들어올지 미리 알 수 없다. 브라우저에 접속하는 순간에 알 수 있는 정보이다. 빌드 시점에 이 페이지를 미리 서버에서 만들려고 하면 `useSearchParams()` 에서 현재 URL 파라미터가 뭔지 모르기 때문에 막히게 된다.
      - Next.js는 빌드 시점에 페이지를 정적으로 렌더링하려고 시도하는데, `useSearchParams()` 는 런타임에서만 값을 알 수 있는 동적 API이기 때문에 충돌이 발생한다.
  - **해결 방법**
      - `useSearchParams()` 를 사용하는 컴포넌트를 `<Suspense>` 로 감싸서 Next.js에게 이 부분은 클라이언트에서 동적으로 렌더링해야 한다는 것을 명시한다.
      - 페이지에서 `<Suspense>` 로 감싸면 빌드 시점에는 fallback UI를 렌더링하고, 클라이언트에서 실제 컴포넌트를 렌더링할 수 있다.
  - **결과**
      - 빌드 에러가 해결되고 페이지가 정상적으로 빌드되며, 클라이언트에서 URL 파라미터를 읽어 동적으로 렌더링된다.
      - 빌드 시점에는 fallback UI가 포함되어 정적 최적화가 가능해졌다.

</details>

<details>
<summary><strong>클라이언트 사이드 라우트 가드의 깜빡임 해결</strong></summary>

  - **문제 상황**
      - 라우트 가드 구현 초기 설계에서 `useEffect` 를 사용하여 클라이언트 컴포넌트에서 권한을 확인하고 리다이렉트 처리를 진행했다. 이로 인해 서버에서 이미 HTML을 렌더링한 후 클라이언트에서 JS가 실행되기 전까지 권한이 없는 사용자가 보호된 페이지의 UI를 몇 초간 보게 되는 현상이 발생했다.
  - **원인 분석**
      - **Next.js의 하이드레이션 과정**: 서버에서 내려준 정적 HTML이 브라우저에 먼저 그려지고, `useEffect` 가 실행되는 시점은 브라우저 렌더링 이후이다. 클라이언트 컴포넌트는 마운트된 이후에야 권한을 판단하므로 서버에서 미리 데이터를 가져오는 속도를 따라갈 수 없다.
  - **해결 방법**
      - 가드가 필요한 루트의 레이아웃을 서버 컴포넌트로 유지하고, 서버 내에서 유저 정보를 직접 조회하여 권한이 맞지 않을 경우 서버 사이드에서 즉시 `redirect()` 함수를 호출한다.
  - **동작 결과**
      - 사용자가 브라우저에서 페이지를 보기 전 서버 단계에서 이미 리다이렉트가 완료되어 비정상적인 데이터 노출이 차단되었다.
      - Next.js의 `redirect()` 함수는 서버에서 즉시 리다이렉트 응답을 반환하기 때문에 클라이언트에 불필요한 HTML이 전달되지 않는다.

</details>

<details>
<summary><strong>검색창 입력 시 과도한 API 호출로 인한 성능 저하</strong></summary>

  - **문제 상황**
      - 검색창에서 사용자가 글자 하나하나를 타이핑할 때마다 즉시 API를 호출하여 검색 결과를 가져오는데, 짧은 시간에 과도한 요청이 발생하여 서버 부하가 증가하고 사용자 경험이 저하된다.
  - **원인 분석**
      - React의 상태 변경은 즉시 리렌더링을 트리거하기 때문에 상태 업데이트가 일어날 때마다 쿼리가 재실행된다.
      - 불필요한 중간 요청들이 서버 부하를 증가시킨다.
  - **해결 방법**
      - **Debounce 훅 구현**: 사용자 입력이 멈춘 후 일정 시간(500ms)이 지나면 실제 검색 요청을 보내도록 지연시킨다.
      - 입력 중간 값들은 무시하고, 사용자가 입력을 완료한 시점의 최종 값만 API 요청에 사용한다.
  - **동작 결과**
      - 사용자가 타이핑을 멈춘 후 500ms 후에 검색 API가 호출되어 불필요한 중간 요청이 제거되었다.
      - 입력 중 화면이 끊기거나 응답이 늦게 뜨는 현상이 사라져 훨씬 부드러운 검색 경험을 제공한다.
      - 사용자는 자연스럽게 타이핑할 수 있고, 검색 결과는 입력 완료 시점에 빠르게 표시된다.

</details>

<details>
<summary><strong>학습 자료 등록/수정 후 목록이 즉시 업데이트 되지 않는 문제</strong></summary>

  - **문제 상황**
      - 학습 자료를 등록하거나 수정한 후 목록 페이지로 돌아가면 이전 캐시 데이터가 그대로 표시되어 최신 변경사항이 바로 반영되지 않는다.
  - **원인 분석**
      - `invalidateQueries()`는 비동기적으로 동작하기 때문에 무효화 명령을 보낸 직후 결과 대기 없이 페이지를 이동시키면(모달을 닫으면) refetch가 완료되기 전 UI가 렌더링되어 이전 데이터를 보여준다.
      - TanStack Query의 캐시 무효화는 기본적으로 활성화된 쿼리만 자동으로 refetch한다.
  - **해결 방법**
      - **`await`를 통한 동기화**: `await queryClient.invalidateQueries()`를 사용하여 캐시 무효화와 데이터 `refetch`가 완전히 끝날 때까지 기다린 후 페이지를 이동하도록 변경했다.
      - **`refetchType: "active"` 옵션 추가**: 현재 활성화된 쿼리를 즉시 refetch한다. 
  - **동작 결과**
      - 자료 등록/수정/삭제 후 await로 쿼리 무효화가 완료될 때까지 대기하기 때문에 목록 페이지로 돌아갔을 때 최신 데이터가 즉시 표시된다.
      - `refetchType: "active"`를 통해 현재 마운트된 목록 쿼리가 자동으로 refetch되어 사용자가 새로고침 없이도 변경사항을 확인할 수 있다.

</details>

---

## 🚀 빠른 시작

### 📦 요구사항

프로젝트 실행을 위해 다음 버전이 필요합니다:

| 도구    | 버전      | 설정 파일                        |
| ------- | --------- | -------------------------------- |
| Node.js | `24.13.0` | `.nvmrc`, `package.json#engines` |
| pnpm    | `10.28.0` | `package.json#packageManager`    |

### 💻 설치 및 실행

```bash
# 1. 의존성 설치
pnpm install

# 2. 환경 변수 설정
cp .env.example .env.local

# 3. Git hooks 설정
pnpm run prepare

# 4. 개발 서버 실행
pnpm dev
```

개발 서버가 실행되면 [http://localhost:3000](http://localhost:3000)에서 확인할 수 있습니다.

### 🔧 환경 변수 설정

`.env.local` 파일에 다음 환경 변수를 설정해주세요:

```bash
# API 엔드포인트
NEXT_PUBLIC_API_BASE_URL=         # 강사/조교용 API
NEXT_PUBLIC_API_BASE_URL_SVC=     # 학생/학부모용 API

# Sentry (선택사항)
NEXT_PUBLIC_SENTRY_DSN=
SENTRY_AUTH_TOKEN=
```

---

## 📁 프로젝트 구조

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # 인증 관련 라우트
│   ├── educators/         # 강사/조교 라우트
│   ├── learners/          # 학생/학부모 라우트
│   └── _components/       # 페이지별 컴포넌트
├── components/            # 공용 컴포넌트
│   └── ui/               # shadcn/ui 컴포넌트
├── services/             # API 클라이언트 및 도메인 로직
├── providers/            # React Context Providers
├── stores/               # Zustand 상태 관리
├── hooks/                # 커스텀 훅
├── types/                # TypeScript 타입 정의
├── validation/           # Zod 스키마
├── utils/                # 유틸리티 함수
└── constants/            # 상수 정의
```

### 주요 디렉토리 설명

| 디렉토리         | 역할                                             |
| ---------------- | ------------------------------------------------ |
| `src/app`        | 라우팅, 페이지, 레이아웃, 메타데이터, 에러 처리  |
| `src/components` | 재사용 가능한 UI 컴포넌트                        |
| `src/services`   | Axios 클라이언트 + 도메인별 API 호출 + Mapper    |
| `src/providers`  | React Query, Auth, Modal, Breadcrumb 등 Provider |
| `src/stores`     | Zustand 기반 클라이언트 상태 관리                |
| `src/hooks`      | 재사용 가능한 커스텀 훅                          |
| `src/types`      | 공통 타입 정의                                   |
| `src/validation` | Zod 스키마 및 폼 검증                            |

---

## 🔒 권한 및 인증

### 역할 기반 라우팅

SSam B는 URL 기반으로 사용자 역할을 구분합니다:

| URL 패턴       | 역할   | 설명                                |
| -------------- | ------ | ----------------------------------- |
| `/educators/*` | `MGMT` | 강사(INSTRUCTOR) 및 조교(ASSISTANT) |
| `/learners/*`  | `SVC`  | 학생(STUDENT) 및 학부모(PARENT)     |

### 인증 방식

- **세션 관리:** 쿠키 기반 세션
- **API 통신:** 역할별 다른 Base URL 사용
  - 강사/조교: `NEXT_PUBLIC_API_BASE_URL`
  - 학생/학부모: `NEXT_PUBLIC_API_BASE_URL_SVC`

### 조교 승인 프로세스

조교(ASSISTANT)는 가입 후 다음 조건을 만족해야 대시보드에 접근할 수 있습니다:

- `signStatus`가 `SIGNED` 상태여야 함
- 조건 미충족 시 `/pending-approval` 페이지로 자동 리다이렉트

---

## 📜 스크립트 가이드

### 개발 및 빌드

```bash
pnpm dev          # 개발 서버 실행 (http://localhost:3000)
pnpm build        # 프로덕션 빌드
pnpm start        # 프로덕션 서버 실행
```

### 코드 품질

```bash
# Linting
pnpm lint         # ESLint 실행
pnpm lint:fix     # ESLint 자동 수정

# Formatting
pnpm format       # Prettier 포맷팅 적용
pnpm format:check # Prettier 체크만 수행

# Type Checking
pnpm type-check   # TypeScript 타입 체크
```

### 테스트

```bash
pnpm test         # Jest 테스트 실행
```

## 🚢 배포 및 운영

### 배포 플랫폼

이 프로젝트는 **Vercel** 배포를 전제로 구성되어 있습니다.

### Sentry 설정

에러 모니터링을 위해 Sentry가 통합되어 있습니다:

- **설정 파일:** `next.config.ts`에서 `withSentryConfig` 사용
- **클라이언트 초기화:** `src/instrumentation-client.ts`
- **Tunnel Route:** `/monitoring` (광고 차단 우회)

### 환경 변수 (배포 시)

Vercel 대시보드에서 다음 환경 변수를 설정해주세요:

```bash
NEXT_PUBLIC_API_BASE_URL
NEXT_PUBLIC_API_BASE_URL_SVC
NEXT_PUBLIC_SENTRY_DSN
SENTRY_AUTH_TOKEN
SENTRY_ORG
SENTRY_PROJECT
```

---

<div align="center">

**Made with ❤️ by SSam B Team**

</div>
