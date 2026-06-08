import { useState, type FormEvent } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

interface LocationState {
  from?: { pathname: string };
}

export function LoginPage() {
  const { isAuthenticated, isLoggingIn, loginError, login } = useAuth();
  const [code, setCode] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  if (isAuthenticated) {
    const state = location.state as LocationState | null;
    const redirectTo = state?.from?.pathname ?? '/dashboard';
    return <Navigate to={redirectTo} replace />;
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!code.trim() || isLoggingIn) return;
    try {
      await login(code.trim());
      navigate('/dashboard', { replace: true });
    } catch {
      // 에러 메시지는 useAuth().loginError로 표시됨
    }
  };

  return (
    <div className="auth-screen">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h1 className="auth-title">DeciDuel Admin</h1>
        <p className="auth-subtitle">관리자 접속 코드를 입력해주세요.</p>

        <label className="field">
          <span className="field-label">접속 코드</span>
          <input
            type="password"
            className="field-input"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            autoComplete="off"
            autoFocus
            placeholder="••••••••"
          />
        </label>

        {loginError && <p className="field-error">{loginError}</p>}

        <button type="submit" className="btn btn-primary" disabled={isLoggingIn || !code.trim()}>
          {isLoggingIn ? '로그인 중...' : '로그인'}
        </button>
      </form>
    </div>
  );
}
