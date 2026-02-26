// src/components/Sidebar.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getUserRole } from '../services/auth';

const Sidebar = ({ role }) => {
  const location = useLocation();

  const actualRole = role || (
    location.pathname.startsWith('/teacher') ? 'teacher' :
      location.pathname.startsWith('/student') ? 'student' :
        getUserRole() || 'student'
  );

  const studentMenu = [
    { path: '/student/dashboard', label: 'Главная', icon: '🏠' },
    { path: '/student/grades', label: 'Оценки', icon: '📊' },
    { path: '/student/assignments', label: 'Задания', icon: '📝' },
    { path: '/student/schedule', label: 'Расписание', icon: '📅' },
    { path: '/student/profile', label: 'Профиль', icon: '👤' },
  ];

  const teacherMenu = [
    { path: '/teacher/dashboard', label: 'Дашборд', icon: '📊' },
    { path: '/teacher/students', label: 'Студенты', icon: '👨‍🎓' },
    { path: '/teacher/subjects', label: 'Предметы', icon: '📚' },
    { path: '/teacher/grades', label: 'Оценки', icon: '📝' },
    { path: '/teacher/assignments', label: 'Задания', icon: '📋' },
    { path: '/teacher/rating', label: 'Рейтинг', icon: '🏆' },
    { path: '/teacher/schedule', label: 'Расписание', icon: '📅' },
    { path: '/teacher/profile', label: 'Профиль', icon: '👤' },
  ];

  const menu = actualRole === 'student' ? studentMenu : teacherMenu;
  const isActive = (path) => location.pathname === path;

  return (
    <aside style={styles.sidebar}>
      {/* Logo */}
      <div style={styles.logoBlock}>
        <div style={styles.logoIcon}>S</div>
        <div>
          <div style={styles.logoName}>StudyMate</div>
          <div style={styles.logoRole}>
            {actualRole === 'teacher' ? 'Преподаватель' : 'Студент'}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav style={styles.nav}>
        <div style={styles.navLabel}>МЕНЮ</div>
        {menu.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            style={{
              ...styles.navItem,
              ...(isActive(item.path) ? styles.navItemActive : {}),
            }}
            onMouseEnter={e => {
              if (!isActive(item.path)) {
                e.currentTarget.style.background = 'rgba(255,255,255,0.07)';
                e.currentTarget.style.color = '#fff';
              }
            }}
            onMouseLeave={e => {
              if (!isActive(item.path)) {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = 'rgba(255,255,255,0.6)';
              }
            }}
          >
            <span style={styles.navIcon}>{item.icon}</span>
            <span style={styles.navLabelText}>{item.label}</span>
            {isActive(item.path) && <div style={styles.activeBar} />}
          </Link>
        ))}
      </nav>

      {/* Footer badge */}
      {actualRole === 'teacher' && (
        <div style={styles.adminBadge}>
          <span>🔐</span>
          <span>Полный доступ</span>
        </div>
      )}
    </aside>
  );
};

const styles = {
  sidebar: {
    width: '260px',
    minWidth: '260px',
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    backdropFilter: 'blur(24px)',
    borderRight: '1px solid rgba(15, 23, 42, 0.45)',
    height: 'calc(100vh - 72px)',
    position: 'sticky',
    top: '72px',
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'auto',
    flexShrink: 0,
  },
  logoBlock: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.875rem',
    padding: '1.5rem',
    borderBottom: '1px solid rgba(255,255,255,0.12)',
  },
  logoIcon: {
    width: '40px',
    height: '40px',
    borderRadius: '10px',
    background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
    color: 'white',
    fontWeight: '800',
    fontSize: '1.25rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  logoName: {
    fontSize: '1rem',
    fontWeight: '700',
    color: '#ffffff',
    lineHeight: 1.2,
  },
  logoRole: {
    fontSize: '0.7rem',
    color: 'rgba(255,255,255,0.45)',
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  nav: {
    flex: 1,
    padding: '1rem 0.75rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  navLabel: {
    fontSize: '0.65rem',
    fontWeight: '700',
    color: 'rgba(255,255,255,0.3)',
    letterSpacing: '0.08em',
    padding: '0 0.75rem',
    marginBottom: '0.5rem',
    marginTop: '0.25rem',
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    padding: '0.65rem 0.875rem',
    textDecoration: 'none',
    color: 'rgba(255,255,255,0.6)',
    borderRadius: '10px',
    transition: 'all 0.18s ease',
    position: 'relative',
    gap: '0.75rem',
    fontWeight: '500',
    fontSize: '0.875rem',
  },
  navItemActive: {
    background: 'rgba(59,130,246,0.18)',
    color: '#60a5fa',
    fontWeight: '600',
  },
  navIcon: {
    fontSize: '1.05rem',
    width: '22px',
    textAlign: 'center',
    flexShrink: 0,
  },
  navLabelText: {
    flex: 1,
  },
  activeBar: {
    width: '4px',
    height: '4px',
    borderRadius: '50%',
    backgroundColor: '#60a5fa',
    flexShrink: 0,
  },
  adminBadge: {
    margin: '0.75rem',
    padding: '0.75rem 1rem',
    background: 'rgba(59,130,246,0.12)',
    borderRadius: '10px',
    border: '1px solid rgba(59,130,246,0.25)',
    color: '#93c5fd',
    fontSize: '0.8rem',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
};

export default Sidebar;