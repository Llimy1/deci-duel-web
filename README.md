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

## 배포 (Cloudflare Workers — 정적 자산)

무료 플랜으로 충분 (Workers Free: 정적 자산 호스팅은 무제한 무료, 요청/대역폭 한도도
일반적인 어드민 트래픽엔 넉넉함).

> **참고 (2026-06-08)**: Cloudflare 대시보드의 "Workers & Pages → Create → Connect to Git"
> 흐름이 기존 "Pages"(Framework preset + Build output directory + `_redirects`) 방식이
> 아니라 **"Workers" 정적 자산(Static Assets) 배포**(`npx wrangler deploy`, `wrangler.jsonc`
> 설정 기반)로 통합되어 있다. 이 레포는 후자 기준으로 설정되어 있다 — 루트의
> `wrangler.jsonc` 참고. 이 Worker는 런타임 코드가 없는 "자산 전용(assets-only)"
> 프로젝트이며, SPA 라우팅 폴백은 `_redirects` 대신 `wrangler.jsonc`의
> `assets.not_found_handling: "single-page-application"`로 처리한다.

1. **Cloudflare 대시보드** → Workers & Pages → Create → "Connect to Git"으로
   `Llimy1/deci-duel-web` 저장소 연결 (GitHub 연동 권한 승인 필요)
2. **빌드/배포 설정** (대시보드가 `package.json`/`wrangler.jsonc`를 감지해 기본값 제안)
   - Build command: `npm run build`
   - Deploy command: `npx wrangler deploy` (기본값 그대로 — `wrangler.jsonc`의
     `assets.directory: "./dist"` 설정을 그대로 사용)
3. **환경 변수** (프로젝트 설정 → Variables and Secrets, 빌드 시점에 적용)
   - `VITE_API_BASE_URL` = 운영 서버의 실제 API base URL
     (Vite 환경변수는 빌드 시점에 번들에 박히므로, **반드시 빌드 환경변수로 설정**해야
     하며 런타임에 주입되는 값이 아님에 주의)
4. **배포 후 확인**
   - 루트(`/`) 접속 시 로그인 화면으로 리다이렉트되는지
   - `/legal/terms`, `/legal/privacy`, `/legal/admob` 직접 접속(새로고침 포함) 시
     404 없이 정상 렌더되는지 — `wrangler.jsonc`의 `not_found_handling`이 클라이언트
     라우팅 폴백을 처리한다
5. **서버 CORS 허용 오리진 추가 (필수)**
   - `deci-duel-server`의 `CORS_ALLOWED_ORIGINS` 환경변수에 배포 후 발급되는 도메인
     (예: `https://deci-duel-web.<subdomain>.workers.dev`, 커스텀 도메인 연결 시 그
     도메인도)을 콤마로 추가해야 브라우저에서 Admin API 호출이 차단되지 않는다
     (서버 코드 변경 불필요, `.env`만 갱신 후 재기동)

이후 `main` 브랜치에 푸시하면 자동으로 빌드·배포된다 (Preview 배포는 PR/다른 브랜치
푸시 시 자동 생성).

### 로컬에서 미리보기/수동 배포

```bash
npm run build
npx wrangler dev      # 로컬에서 정적 자산 + SPA 라우팅 동작 미리보기
npx wrangler deploy   # 수동 배포 (Cloudflare 계정 로그인 필요 — 최초 1회 npx wrangler login)
```
