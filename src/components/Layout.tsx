import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

const navItems = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/events', label: 'Events' },
];

// 인증된 admin 영역 공통 셸 (상단 네비 + 로그아웃)
export function AdminLayout() {
  const { logout } = useAuth();

  return (
    <div className="admin-shell">
      <header className="admin-header">
        <span className="admin-title">DeciDuel Admin</span>
        <nav className="admin-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `admin-nav-link${isActive ? ' is-active' : ''}`}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <button type="button" className="btn btn-ghost" onClick={logout}>
          로그아웃
        </button>
      </header>
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
}
