# 진행 상황 (deci-duel-web / Admin SPA)

## 마지막 업데이트
2026-06-08 (1차 구현 완료 — 로그인/대시보드/이벤트 뷰어/정적 공개 페이지 / 약관·개인정보 최종본 확정)

## 현재 상태
**Codex `[2026-06-08 09:00] implementation-direction`(서버 레포 `CODEX_TO_CLAUDE.md`)에서
지시된 Admin SPA 4단계를 1차 범위로 모두 구현 완료.**
- 로그인(접속 코드 → admin JWT, `sessionStorage` 보관)
- Dashboard/Health(`GET /admin/health` 카드뷰 + 30초 폴링)
- Events 뷰어(`GET /admin/events` 필터 + 커서 페이지네이션 + metadata JSON pretty-print)
- 정적 공개 페이지(`/legal/terms`, `/legal/privacy`, `/legal/admob`)

`tsc -b`/`vite build`/`eslint` 모두 통과, 로컬 dev 서버 스모크 테스트 완료.

## 완료된 작업
- **프로젝트 셋업**: Vite + React + TS 스캐폴딩(`npm create vite -- --template react-ts`),
  `react-router-dom` 추가, git 원격 연결(`https://github.com/Llimy1/deci-duel-web.git`)
- **API 레이어** (`src/api/`)
  - `client.ts`: 서버 `ApiResponse<T>` 래핑을 푸는 공통 fetch 래퍼. admin JWT 자동 첨부,
    401 응답 시 `setUnauthorizedHandler` 콜백으로 자동 로그아웃 트리거
  - `auth.ts`/`health.ts`/`events.ts`: 서버 Admin API 3종(`POST /admin/auth/login`,
    `GET /admin/health`, `GET /admin/events`)에 1:1 대응하는 타입 + 호출 함수
- **인증** (`src/auth/`)
  - `sessionToken.ts`: `sessionStorage` 래퍼 (try-catch 필수 — 시크릿 모드 등에서 접근 예외 가능)
  - `AuthContext.tsx`: 로그인 상태 React Context. 새로고침 시 세션 복원, 401 시 자동 로그아웃,
    로그인/로그아웃 액션 제공
- **라우팅/레이아웃** (`src/components/`, `src/App.tsx`)
  - `ProtectedRoute`: 미인증 시 `/login`으로 리다이렉트(원래 경로를 `state.from`에 보존)
  - `AdminLayout`: 인증된 영역 공통 셸(상단 네비 + 로그아웃)
  - `/` → 인증 상태에 따라 `/dashboard` 또는 `/login`으로 리다이렉트
- **페이지** (`src/pages/`): `LoginPage`, `DashboardPage`, `EventsPage`, `StaticPages`
  (Terms/Privacy/AdMob — 본문은 "준비 중" placeholder, 법무 검토 후 채울 예정)
- **스타일**: `index.css`에 어드민 톤(보라 accent, 카드/테이블/배지/JSON 뷰어 등) 직접 작성
- **문서**: `README.md`(셋업 가이드 + 1차 범위 + API 계약 참조), `.env.example`
  (`VITE_API_BASE_URL`)

## 후속 처리 완료 (2026-06-08)
- **CORS**: 서버(`deci-duel-server/src/main.ts`)에 `app.enableCors()` 추가, 허용 오리진을
  `CORS_ALLOWED_ORIGINS` 환경변수(콤마 구분, 기본값 `http://localhost:5173`)로 분리.
  로컬 Admin SPA dev 서버(`http://localhost:5173`) 우선 등록 완료. 운영 배포 도메인은
  배포 시점에 서버 `.env`의 `CORS_ALLOWED_ORIGINS`에 추가하면 됨 (코드 변경 불필요)
- **약관/개인정보 최종본 확정 (2026-06-08, 사용자 정보 확인 완료)**: `StaticPages.tsx`의
  `TermsPage`/`PrivacyPage`를 실제 데이터 처리 방식(Prisma User/SoloRecord/DiaryRecord
  모델, OAuth 흐름, 마이크 dB 측정만 하고 음성 자체는 저장하지 않는다는 점 등)에 근거해
  작성하고, 사용자가 확인해준 실제 운영자 정보를 반영해 최종본으로 완성:
  - 운영 형태: **개인 개발자** → "회사/대표자" 대신 "운영자"로 프레이밍 (전역 치환,
    "회사"/"운영자" 모두 모음 'ㅏ'로 끝나 조사 호환 — 문법 깨짐 없음 확인)
  - 운영자 표시명: **Llimy1** (사용자 닉네임)
  - 개인정보 보호책임자: 성명 **Llimy1**, 이메일 **llimy.mh@gmail.com**
  - 호스팅 수탁업체: **Amazon Web Services, Inc. (AWS)** 추가 (Cloudflare R2,
    Apple/Google/Kakao OAuth 항목과 함께 수탁업체 표에 명시)
  - 시행일: **2026-06-08** (확정 — "예정/초안" 표현 제거)
  - 보유기간(부정 이용 운영 로그): "계속 해야지"(사용자 의도) → "서비스 운영 기간 동안
    계속 보관(부정 이용 이력 추적 목적상 단기 삭제 시 재발 방지 효과 저하 → 서비스 종료
    또는 보관 목적 소멸 시 파기)"로 명문화
  - 공개 법적 문서이므로 "← DeciDuel" 뒤로가기 링크 제거 (사용자 명시 요청 — 일반
    이용자/스토어 심사자가 어드민 로그인 화면으로 빠지는 것 방지)
  - 임시 배너(`DraftNotice`)와 모든 placeholder(`[회사명]`/`[담당자명]`/`[연락처 이메일]`/
    `[클라우드/서버 호스팅 사업자]`/`[3]개월`) 제거·교체 완료. `tsc -b`/`eslint` 클린,
    브라우저에서 `/legal/terms`·`/legal/privacy` 렌더링 확인 완료

## 다음 작업 후보 (배포 전 / 사용 중 발견 시)
- Cloudflare Pages 배포 파이프라인 구성 (build output: `dist/`)
- (선택) 약관/개인정보 — 추후 정식 법무 검토 시 표현 다듬기. 현재는 사용자(개인 개발자
  운영자) 확인을 거친 최종본으로 게시 가능 상태
- AdMob 페이지 본문 — 사용자가 직접 설정 예정 (Google AdMob 앱 연결 검증 콘텐츠)
- (필요해지면) 이벤트 통계/차트, 실시간 갱신, 유저 관리 등 — 현재는 서버 Admin API가
  조회 전용 3종뿐이라 범위 밖. 서버 API 확장이 선행되어야 함

## Decision Log
| 날짜 | 결정 내용 | 이유 |
|------|-----------|------|
| 2026-06-08 | 신규 레포 `deci-duel-web`(Vite + React + TS, 별도 상태관리 라이브러리 없이 React Context)로 Admin SPA 구축 | 기존 `deci-duel-app`/`deci-duel-server` 분리 패턴과 일관. 인증 게이트 뒤 내부 도구라 SEO/SSR 이점이 없어 Next.js 대신 가벼운 Vite 선택. 데이터/상태가 단순(로그인 토큰 + 서버 응답 캐시 불필요한 조회성 화면)해 Zustand 등 추가 라이브러리 없이 Context로 충분하다고 판단 |
| 2026-06-08 | admin JWT를 `sessionStorage`에 보관 | 만료가 1시간 내외로 짧음. 메모리만 쓰면 새로고침마다 재로그인 필요(불편), localStorage는 영속성 과함 + XSS 탈취 시 피해 기간이 김. 탭 종료 시 소멸 + 새로고침엔 유지되는 절충점으로 sessionStorage 채택. `sessionToken.ts`에서 try-catch로 감싸 시크릿 모드 등 접근 불가 환경 대비 |
| 2026-06-08 | 1차 구현 범위에 정적 공개 페이지(약관/개인정보/AdMob)까지 포함 (Codex 지시서 4단계 순서 그대로) | 인증 흐름과 무관한 단순 정적 라우트라 공수가 작아 핵심 기능과 함께 처리하는 것이 효율적. 본문은 법무 검토 전이라 placeholder로 자리만 확보 |
| 2026-06-08 | 차트/실시간 소켓/유저 관리 기능은 1차 범위에서 제외 | 서버 Admin API가 현재 조회 전용 3종뿐이라 SPA 기능도 자연히 read-only로 제한됨. 차트 라이브러리·admin 전용 소켓 채널 도입은 현재 데이터 양/운영 단계 대비 과한 투자, 유저 관리(CUD)는 해당 서버 API 자체가 없고 "서버 API 계약 변경 금지" 제약과 충돌 |
| 2026-06-08 | `apiRequest` 공통 래퍼에서 401 처리를 콜백 패턴(`setUnauthorizedHandler`)으로 구현 | API 클라이언트(`client.ts`)는 React 외부 모듈이라 직접 컨텍스트/state에 접근 불가. `AuthProvider`가 마운트 시 핸들러를 등록해, 401 발생 시 토큰 클리어 + 로그인 화면 전환을 트리거하도록 역방향 의존성을 주입 |
| 2026-06-08 | 약관/개인정보처리방침을 "회사/대표자" 대신 "운영자" 프레이밍으로 작성하고 사용자 확인을 거쳐 최종본으로 확정 (placeholder/초안 배너 전부 제거) | 사용자가 법인이 아닌 개인 개발자(닉네임 Llimy1)로 서비스를 운영 중이라고 명확히 답변. 등록된 법인이 없는데 "회사"/"대표자" 표현을 쓰면 사실과 다른 정보를 게시하는 셈이 되어 오히려 법적 리스크. "운영자"/"개인정보처리자" 프레이밍은 개인 개발자가 흔히 쓰는 적법한 표현이며, "회사"와 "운영자" 모두 모음 'ㅏ'로 끝나 조사(가/는/의/와/에/및)가 그대로 호환되어 전역 치환으로 문법 깨짐 없이 처리 가능했음. 호스팅은 AWS, 보유기간은 사용자가 "계속 해야지"라 답해 부정 이용 로그에 한해 "서비스 운영 기간 동안 계속 보관, 종료/목적 소멸 시 파기"로 명문화. 공개 법적 문서이므로 "← DeciDuel" 백링크는 제거(어드민 로그인 화면으로 빠지는 동선이 되어 일반 사용자/스토어 심사자에게 부적절) |
| 2026-06-23 | `LAST_UPDATED` 단일 상수를 `TERMS_LAST_UPDATED`/`PRIVACY_LAST_UPDATED`로 분리, 개인정보처리방침 쪽만 실제 변경일(2026-06-15)로 갱신 | `StaticPages.tsx`가 이용약관/개인정보처리방침 양쪽의 "시행일" 표시를 하나의 상수로 공유하고 있어서, 2026-06-15에 개인정보처리방침 본문만 수정한(`c33e4bf`, 다이어리 녹음 마이크 안내 문구) 뒤에도 화면엔 여전히 "시행일: 2026-06-08"로 표시되던 불일치를 발견. 이용약관은 그 시점에 내용 변경이 없었으므로 `TERMS_LAST_UPDATED`는 2026-06-08 유지, `PRIVACY_LAST_UPDATED`만 2026-06-15로 분리 갱신. (`fix/policy-last-updated` 브랜치, 로컬 작업만, push/배포 안 함) |

## 알려진 이슈 / 수정 이력
- **2026-06-08 (발견 및 즉시 수정)**: `npm run dev`로 첫 실행 시 화면이 완전히 빈 채로 표시되는 버그.
  콘솔에 `Error: useRoutes() may be used only in the context of a <Router> component.` 예외.
  원인: `App.tsx`에서 `<AuthProvider><AppRoutes /></AuthProvider>`만 렌더링하고 `<Routes>`를
  감싸는 `<Router>`(예: `BrowserRouter`)가 없었음 — 빌드/타입체크/린트로는 잡히지 않고
  런타임에서만 드러나는 종류의 실수. `App.tsx`에 `BrowserRouter`를 최상위로 추가해 해결
  (commit `de7868a`). 이후 로그인 화면("DeciDuel Admin" / 접속 코드 입력 폼) 정상 렌더 확인.

## 블로커
- (없음)
