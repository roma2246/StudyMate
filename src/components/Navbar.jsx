// src/components/Navbar.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { logout, getUserName, getUserRole } from '../services/auth';

const Navbar = ({ role }) => {
  const navigate = useNavigate();
  const userName = getUserName();
  const userRole = getUserRole();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getRoleBadge = () => {
    if (role === 'teacher') {
      return (
        <div style={styles.roleBadge}>
          👨‍🏫 Администратор
        </div>
      );
    }
    return (
      <div style={styles.studentBadge}>
        🎓 Студент
      </div>
    );
  };

  return (
    <nav style={styles.navbar}>
      <div style={styles.navLeft}>
        <Link to={`/${role}/dashboard`} style={styles.logo}>
          StudyMate
        </Link>
        {getRoleBadge()}
      </div>
      
      <div style={styles.navRight}>
        <div style={styles.userInfo}>
          <span style={styles.welcome}>Добро пожаловать,</span>
          <span style={styles.userName}>{userName}</span>
        </div>
        
        {role === 'teacher' && (
          <button 
            onClick={() => navigate('/debug')}
            style={styles.debugButton}
          >
            🛠 Отладка
          </button>
        )}
        
        <button onClick={handleLogout} style={styles.logoutButton}>
          🚪 Выйти
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
    padding: '1rem 2rem',
    backgroundColor: '#ffffff',
    borderBottom: '1px solid #e5e7eb',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    position: 'sticky',
    top: 0,
    zIndex: 100
  },
  navLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem'
  },
  logo: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#3b82f6',
    textDecoration: 'none',
    background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text'
  },
  roleBadge: {
    background: 'linear-gradient(135deg, #1e40af 0%, #3730a3 100%)',
    color: 'white',
    padding: '0.25rem 0.75rem',
    borderRadius: '12px',
    fontSize: '0.75rem',
    fontWeight: '600'
  },
  studentBadge: {
    background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
    color: 'white',
    padding: '0.25rem 0.75rem',
    borderRadius: '12px',
    fontSize: '0.75rem',
    fontWeight: '600'
  },
  navRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem'
  },
  userInfo: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: '0.125rem'
  },
  welcome: {
    color: '#6b7280',
    fontSize: '0.75rem'
  },
  userName: {
    color: '#374151',
    fontSize: '0.875rem',
    fontWeight: '600'
  },
  debugButton: {
    padding: '0.5rem 1rem',
    backgroundColor: '#8b5cf6',
    color: 'white',
    border: 'none',
    borderRadius: '0.375rem',
    cursor: 'pointer',
    fontSize: '0.75rem',
    fontWeight: '500',
    transition: 'all 0.2s ease'
  },
  logoutButton: {
    padding: '0.5rem 1rem',
    backgroundColor: '#ef4444',
    color: 'white',
    border: 'none',
    borderRadius: '0.375rem',
    cursor: 'pointer',
    fontSize: '0.875rem',
    fontWeight: '500',
    transition: 'all 0.2s ease'
  }
};

export default Navbar;