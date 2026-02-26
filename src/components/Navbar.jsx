// src/components/Navbar.jsx
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { logout, getUserName, getUserRole } from '../services/auth';

const Navbar = ({ role }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const userName = getUserName() || 'Пользователь';
  const userRole = getUserRole();
  const [hoverLogout, setHoverLogout] = useState(false);

  const actualRole = role || (
    location.pathname.startsWith('/teacher') ? 'teacher' :
      location.pathname.startsWith('/student') ? 'student' :
        userRole || 'student'
  );

  const handleLogout = () => {
    logout();
    navigate(`/${userRole || 'student'}/login`);
  };

  const initials = userName
    .split(' ')
    .map(w => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const isTeacher = actualRole === 'teacher';

  return (
    <nav style={styles.navbar}>
      {/* Left: Logo */}
      <Link to={`/${actualRole}/dashboard`} style={styles.logo}>
        <div style={styles.logoIcon}>📚</div>
        <div style={styles.logoTexts}>
          <span style={styles.logoText}>StudyMate</span>
          <span style={styles.logoSub}>{isTeacher ? 'УЧИТЕЛЬ' : 'СТУДЕНТ'}</span>
        </div>
      </Link>

      {/* Right */}
      <div style={styles.right}>
        {/* Role badge */}
        <div style={isTeacher ? styles.badgeTeacher : styles.badgeStudent}>
          {isTeacher ? '👨‍🏫 Преподаватель' : '🎓 Студент'}
        </div>

        {/* User info */}
        <div style={styles.userBlock}>
          <div style={{
            ...styles.avatar,
            background: isTeacher
              ? 'linear-gradient(135deg, #8b5cf6, #5b21b6)'
              : 'linear-gradient(135deg, #3b82f6, #1d4ed8)'
          }}>
            {initials}
          </div>
          <div style={styles.userInfo}>
            <span style={styles.userName}>{userName}</span>
            <span style={styles.userRole}>{isTeacher ? 'Преподаватель' : 'Студент'}</span>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          style={hoverLogout ? { ...styles.logoutBtn, ...styles.logoutBtnHover } : styles.logoutBtn}
          onMouseEnter={() => setHoverLogout(true)}
          onMouseLeave={() => setHoverLogout(false)}
        >
          Выйти
        </button>
      </div>
    </nav>
  );
};

const styles = {
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 2rem',
    height: '64px',
    backgroundColor: 'rgba(10, 22, 40, 0.95)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    borderBottom: '1px solid rgba(255,255,255,0.08)',
    boxShadow: '0 1px 24px rgba(0,0,0,0.3)',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    textDecoration: 'none',
  },
  logoIcon: {
    width: '36px',
    height: '36px',
    borderRadius: '10px',
    background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.1rem',
    flexShrink: 0,
    boxShadow: '0 4px 12px rgba(59,130,246,0.4)',
  },
  logoTexts: {
    display: 'flex',
    flexDirection: 'column',
    lineHeight: 1.1,
  },
  logoText: {
    fontSize: '1rem',
    fontWeight: '800',
    color: '#fff',
    letterSpacing: '-0.01em',
  },
  logoSub: {
    fontSize: '0.625rem',
    fontWeight: '700',
    color: 'rgba(255,255,255,0.35)',
    letterSpacing: '0.08em',
  },
  right: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.875rem',
  },
  badgeTeacher: {
    padding: '0.3rem 0.75rem',
    borderRadius: '20px',
    background: 'rgba(139,92,246,0.15)',
    color: '#c4b5fd',
    fontSize: '0.75rem',
    fontWeight: '700',
    border: '1px solid rgba(139,92,246,0.3)',
  },
  badgeStudent: {
    padding: '0.3rem 0.75rem',
    borderRadius: '20px',
    background: 'rgba(59,130,246,0.15)',
    color: '#93c5fd',
    fontSize: '0.75rem',
    fontWeight: '700',
    border: '1px solid rgba(59,130,246,0.3)',
  },
  userBlock: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.625rem',
    padding: '0.375rem 0.75rem',
    background: 'rgba(255,255,255,0.05)',
    borderRadius: '10px',
    border: '1px solid rgba(255,255,255,0.08)',
  },
  avatar: {
    width: '30px',
    height: '30px',
    borderRadius: '50%',
    color: 'white',
    fontWeight: '800',
    fontSize: '0.75rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  userInfo: {
    display: 'flex',
    flexDirection: 'column',
    lineHeight: 1.2,
  },
  userName: {
    fontSize: '0.8125rem',
    fontWeight: '700',
    color: 'rgba(255,255,255,0.9)',
  },
  userRole: {
    fontSize: '0.65rem',
    color: 'rgba(255,255,255,0.4)',
    fontWeight: '500',
  },
  logoutBtn: {
    padding: '0.4375rem 1rem',
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: '8px',
    background: 'rgba(255,255,255,0.06)',
    color: 'rgba(255,255,255,0.6)',
    fontSize: '0.8125rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.18s ease',
  },
  logoutBtnHover: {
    background: 'rgba(239,68,68,0.15)',
    borderColor: 'rgba(239,68,68,0.4)',
    color: '#f87171',
  },
};

export default Navbar;