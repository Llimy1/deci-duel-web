import { ApiError, type ApiResponse } from '../types/api';
import { clearStoredToken, getStoredToken } from '../auth/sessionToken';

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000';

// 401 발생 시(토큰 만료/위조) 호출되는 콜백. AuthProvider가 등록해 로그인 화면으로 보낸다.
let onUnauthorized: (() => void) | null = null;

export function setUnauthorizedHandler(handler: (() => void) | null): void {
  onUnauthorized = handler;
}

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  query?: Record<string, string | number | undefined>;
  body?: unknown;
  /** 인증이 필요 없는 요청(예: 로그인)은 false로 지정 */
  auth?: boolean;
}

function buildUrl(path: string, query?: RequestOptions['query']): string {
  const url = new URL(path, BASE_URL);
  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined && value !== null && value !== '') {
        url.searchParams.set(key, String(value));
      }
    }
  }
  return url.toString();
}

// 서버 ApiResponse<T> 래핑을 풀어 data를 반환하는 공통 fetch 래퍼.
// admin JWT를 자동 첨부하고, 401 응답 시 onUnauthorized 콜백으로 로그아웃을 트리거한다.
export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', query, body, auth = true } = options;

  const headers: Record<string, string> = {};
  if (body !== undefined) {
    headers['Content-Type'] = 'application/json';
  }
  if (auth) {
    const token = getStoredToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  let res: Response;
  try {
    res = await fetch(buildUrl(path, query), {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError(0, '서버에 연결할 수 없습니다. 네트워크 상태를 확인해주세요.');
  }

  let json: ApiResponse<T> | null = null;
  try {
    json = (await res.json()) as ApiResponse<T>;
  } catch {
    // 본문이 없거나 JSON이 아닌 응답 (예: 502 HTML 페이지)
  }

  if (!res.ok) {
    const message = json?.message ?? `요청에 실패했습니다 (HTTP ${res.status})`;
    if (res.status === 401 && auth) {
      clearStoredToken();
      onUnauthorized?.();
    }
    throw new ApiError(res.status, message, json?.requestId);
  }

  if (!json) {
    throw new ApiError(res.status, '서버 응답을 해석할 수 없습니다.');
  }

  return json.data as T;
}
