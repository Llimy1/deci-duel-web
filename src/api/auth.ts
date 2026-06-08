import { apiRequest } from './client';

export interface AdminLoginResult {
  accessToken: string;
  expiresIn: number; // 초 단위
}

// POST /admin/auth/login — 접속 코드 검증 → admin JWT 발급 (인증 불필요, rate limit 5회/5분)
export function adminLogin(code: string): Promise<AdminLoginResult> {
  return apiRequest<AdminLoginResult>('/admin/auth/login', {
    method: 'POST',
    body: { code },
    auth: false,
  });
}
