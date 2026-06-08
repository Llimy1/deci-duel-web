import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { adminLogin } from '../api/auth';
import { setUnauthorizedHandler } from '../api/client';
import { ApiError } from '../types/api';
import { clearStoredToken, getStoredToken, setStoredToken } from './sessionToken';

interface AuthContextValue {
  isAuthenticated: boolean;
  /** 초기 로딩(세션 복원) 여부 — 깜빡임 방지용 */
  isInitializing: boolean;
  isLoggingIn: boolean;
  loginError: string | null;
  login: (code: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // 새로고침 시 sessionStorage에서 토큰 복원 (탭이 살아있는 동안 유지)
  // 마운트 시 1회만 외부 저장소(sessionStorage)를 동기화하는 초기화 로직이라 set-state-in-effect 룰을 의도적으로 비활성화
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setToken(getStoredToken());
    setIsInitializing(false);
  }, []);

  // 401 응답을 받으면 client가 이 핸들러를 호출 — 강제 로그아웃 처리
  useEffect(() => {
    setUnauthorizedHandler(() => {
      setToken(null);
      setLoginError('세션이 만료되었습니다. 다시 로그인해주세요.');
    });
    return () => setUnauthorizedHandler(null);
  }, []);

  const login = async (code: string) => {
    setIsLoggingIn(true);
    setLoginError(null);
    try {
      const result = await adminLogin(code);
      setStoredToken(result.accessToken);
      setToken(result.accessToken);
    } catch (err) {
      if (err instanceof ApiError) {
        setLoginError(err.message);
      } else {
        setLoginError('로그인 중 알 수 없는 오류가 발생했습니다.');
      }
      throw err;
    } finally {
      setIsLoggingIn(false);
    }
  };

  const logout = () => {
    clearStoredToken();
    setToken(null);
    setLoginError(null);
  };

  const value = useMemo<AuthContextValue>(
    () => ({
      isAuthenticated: token !== null,
      isInitializing,
      isLoggingIn,
      loginError,
      login,
      logout,
    }),
    [token, isInitializing, isLoggingIn, loginError],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Provider와 훅을 한 파일에 둔 표준 context 패턴 — fast refresh 룰이 컴포넌트 외 export에 대해 경고하지만
// 의도된 구조이므로 비활성화 (분리 시 import 구조만 복잡해짐)
// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth는 AuthProvider 내부에서만 사용할 수 있습니다.');
  }
  return ctx;
}
