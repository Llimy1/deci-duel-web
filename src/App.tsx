import { Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider, useAuth } from './auth/AuthContext';
import { AdminLayout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { EventsPage } from './pages/EventsPage';
import { AdMobPage, PrivacyPage, TermsPage } from './pages/StaticPages';

// 루트(`/`)는 인증 상태에 따라 대시보드 또는 로그인으로 보낸다.
function RootRedirect() {
  const { isAuthenticated, isInitializing } = useAuth();
  if (isInitializing) {
    return <div className="page-loading">불러오는 중...</div>;
  }
  return <Navigate to={isAuthenticated ? '/dashboard' : '/login'} replace />;
}

function NotFoundPage() {
  return (
    <div className="page-loading">
      <p>페이지를 찾을 수 없습니다.</p>
    </div>
  );
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<RootRedirect />} />
      <Route path="/login" element={<LoginPage />} />

      <Route
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/events" element={<EventsPage />} />
      </Route>

      {/* 인증과 무관한 정적 공개 페이지 */}
      <Route path="/legal/terms" element={<TermsPage />} />
      <Route path="/legal/privacy" element={<PrivacyPage />} />
      <Route path="/legal/admob" element={<AdMobPage />} />

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}
