// src/components/Sidebar.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = ({ role }) => {
  const location = useLocation();

  const studentMenu = [
    { path: '/student/dashboard', label: 'Главная', icon: '🏠' },
    { path: '/student/grades', label: 'Оценки', icon: '📊' },
    { path: '/student/courses', label: 'Курсы', icon: '📚' },
    { path: '/student/assignments', label: 'Задания', icon: '📝' },
    { path: '/student/schedule', label: 'Расписание', icon: '📅' },
    { path: '/student/profile', label: 'Профиль', icon: '👤' }
  ];

  const teacherMenu = [
    { path: '/teacher/dashboard', label: 'Дашборд', icon: '📊' },
    { path: '/teacher/students', label: 'Студенты', icon: '👨‍🎓' },
    { path: '/teacher/subjects', label: 'Предметы', icon: '📚' },
    { path: '/teacher/grades', label: 'Оценки', icon: '📝' },
    { path: '/teacher/rating', label: 'Рейтинг', icon: '🏆' },
    { path: '/teacher/schedule', label: 'Расписание', icon: '📅' },
    { path: '/teacher/profile', label: 'Профиль', icon: '👤' }
  ];

  const menu = role === 'student' ? studentMenu : teacherMenu;

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <aside style={styles.sidebar}>
      <div style={styles.sidebarHeader}>
        <h3 style={styles.sidebarTitle}>
          {role === 'teacher' ? '👨‍🏫 Панель управления' : '🎓 Навигация'}
        </h3>
      </div>
      <nav style={styles.nav}>
        {menu.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            style={{
              ...styles.navItem,
              ...(isActive(item.path) && styles.navItemActive)
            }}
          >
            <span style={styles.navIcon}>{item.icon}</span>
            <span style={styles.navLabel}>{item.label}</span>
            {isActive(item.path) && <div style={styles.activeIndicator}></div>}
          </Link>
        ))}
      </nav>
      
      {role === 'teacher' && (
        <div style={styles.adminSection}>
          <div style={styles.adminBadge}>🔐 Админ-доступ</div>
          <div style={styles.adminText}>Полные права управления</div>
        </div>
      )}
    </aside>
  );
};

const styles = {
  sidebar: {
    width: '280px',
    backgroundColor: '#f8fafc',
    borderRight: '1px solid #e5e7eb',
    height: 'calc(100vh - 80px)',
    position: 'sticky',
    top: '80px',
    display: 'flex',
    flexDirection: 'column'
  },
  sidebarHeader: {
    padding: '1.5rem 1.5rem 1rem',
    borderBottom: '1px solid #e5e7eb'
  },
  sidebarTitle: {
    margin: 0,
    fontSize: '1rem',
    fontWeight: '600',
    color: '#374151'
  },
  nav: {
    flex: 1,
    padding: '1rem 0'
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    padding: '0.75rem 1.5rem',
    textDecoration: 'none',
    color: '#6b7280',
    transition: 'all 0.2s ease',
    position: 'relative',
    borderLeft: '3px solid transparent'
  },
  navItemActive: {
    backgroundColor: '#eff6ff',
    color: '#3b82f6',
    borderLeftColor: '#3b82f6',
    fontWeight: '600'
  },
  navIcon: {
    marginRight: '0.75rem',
    fontSize: '1.125rem',
    width: '20px',
    textAlign: 'center'
  },
  navLabel: {
    fontSize: '0.875rem',
    fontWeight: '500'
  },
  activeIndicator: {
    position: 'absolute',
    right: '1rem',
    width: '6px',
    height: '6px',
    backgroundColor: '#3b82f6',
    borderRadius: '50%'
  },
  adminSection: {
    padding: '1rem 1.5rem',
    borderTop: '1px solid #e5e7eb',
    backgroundColor: '#f0f9ff'
  },
  adminBadge: {
    background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
    color: 'white',
    padding: '0.5rem 0.75rem',
    borderRadius: '8px',
    fontSize: '0.75rem',
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: '0.5rem'
  },
  adminText: {
    fontSize: '0.7rem',
    color: '#6b7280',
    textAlign: 'center'
  }
};

export default Sidebar;