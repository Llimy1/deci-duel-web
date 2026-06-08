# DeciDuel Admin (deci-duel-web)

DeciDuel 서버(`deci-duel-server`) 운영을 위한 관리자 SPA. 인증 게이트 뒤의 내부 도구이며,
일반 유저(`deci-duel-app`)와는 완전히 분리된 별도 시스템이다.

## 스택

- Vite + React + TypeScript
- React Router (클라이언트 라우팅)
- 별도 상태관리 라이브러리 없음 (React Context — `AuthContext`)

## 개발 환경 셋업

```bash
npm install
cp .env.example .env.local   # VITE_API_BASE_URL을 로컬 서버 주소로 설정
npm run dev
```

## 주요 디렉터리

```
src/
├── api/          — fetch 래퍼(client.ts, admin JWT 자동 첨부 + 401 처리) + 엔드포인트별 모듈
├── auth/         — AuthContext(로그인 상태) + sessionStorage 토큰 보관
├── components/   — AdminLayout(공통 셸), ProtectedRoute(인증 가드)
├── pages/        — LoginPage, DashboardPage, EventsPage, StaticPages(약관/개인정보/AdMob)
└── types/        — 서버 ApiResponse<T> 공통 타입
```

## 1차 구현 범위 (MVP)

서버의 Admin API가 현재 조회 전용 3종(`POST /admin/auth/login`, `GET /admin/health`,
`GET /admin/events`)뿐이라 SPA도 read-only 대시보드로 구성된다.

1. **로그인** — 접속 코드 → admin JWT 발급, `sessionStorage`에 보관 (탭 종료 시 소멸)
2. **Dashboard** — 서버 상태(DB/uptime/memory/게임룸·소켓·플레이어 수) 카드뷰 + 폴링
3. **Events** — 운영 이벤트 필터(level/category/event/userId/requestId/기간) + 커서 페이지네이션
   + metadata JSON pretty-print
4. **정적 공개 페이지** — `/legal/terms`, `/legal/privacy`, `/legal/admob` (인증과 무관)

상세 결정 근거는 `deci-duel-server/docs/progress.md` Decision Log `2026-06-08` 항목 참고.

## API 계약

서버 API 응답 포맷/엔드포인트 스펙은 `deci-duel-server/docs/api.md` "관리자 (Admin)" 섹션이
단일 진실의 원천(Single Source of Truth)이다. API 변경 시 그쪽 문서를 먼저 확인할 것.
