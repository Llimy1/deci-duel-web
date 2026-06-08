// sessionStorage 기반 admin JWT 보관.
// 선택 이유 (docs/progress.md Decision Log 2026-06-08 참고):
// - admin JWT 만료가 1시간 내외로 짧아 메모리 보관은 새로고침마다 재로그인이 필요해 불편함이 큼
// - localStorage는 영속성이 과하고, XSS로 탈취될 경우 피해 기간이 김
// - sessionStorage는 탭을 닫으면 사라지면서도 새로고침에는 살아남는 절충점
//
// 일부 환경(시크릿 모드 등)에서 sessionStorage 접근이 예외를 던질 수 있으므로 try-catch 필수.
const STORAGE_KEY = 'deci-duel-admin.token';

export function getStoredToken(): string | null {
  try {
    return window.sessionStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

export function setStoredToken(token: string): void {
  try {
    window.sessionStorage.setItem(STORAGE_KEY, token);
  } catch {
    // storage 접근 불가 환경 — 토큰은 메모리(React state)에만 남는다.
  }
}

export function clearStoredToken(): void {
  try {
    window.sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // no-op
  }
}
