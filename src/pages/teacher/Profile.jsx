import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import { getUserName, getCurrentUser, isAuthenticated } from '../../services/auth';
import { getSubjects, getAssignmentsByTeacher } from '../../services/api';

const TeacherProfile = () => {
  const [profile, setProfile] = useState({
    name: '',
    username: '',
    email: ''
  });
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });
  
  const [settings, setSettings] = useState({
    theme: 'light',
    language: 'ru'
  });

  const [statistics, setStatistics] = useState({
    assignmentsCount: 0,
    subjectsCount: 0
  });

  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/teacher/login');
      return;
    }
    
    loadProfileData();
  }, [navigate]);

  const loadProfileData = async () => {
    try {
      setLoading(true);
      const user = getCurrentUser();
      if (!user) return;

      // Загружаем данные профиля
      const userName = getUserName();
      setProfile({
        name: userName || 'Преподаватель',
        username: user.username || '',
        email: `${user.username}@school.edu` // Можно будет добавить email в модель User
      });

      // Загружаем статистику
      try {
        const [subjectsData, assignmentsData] = await Promise.all([
          getSubjects(),
          getAssignmentsByTeacher(user.id)
        ]);
        
        setStatistics({
          assignmentsCount: Array.isArray(assignmentsData) ? assignmentsData.length : 0,
          subjectsCount: Array.isArray(subjectsData) ? subjectsData.length : 0
        });
      } catch (error) {
        console.error('Failed to load statistics:', error);
      }
    } catch (error) {
      console.error('Failed to load profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSettingsChange = (e) => {
    const { name, value } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    // TODO: Добавить API для обновления профиля
    alert('Профиль успешно обновлен!');
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      alert('Новые пароли не совпадают!');
      return;
    }
    
    if (!passwordData.currentPassword || !passwordData.newPassword) {
      alert('Заполните все поля!');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      alert('Пароль должен содержать минимум 6 символов!');
      return;
    }
    
    // TODO: Добавить API для изменения пароля
    alert('Пароль успешно изменен!');
    
    // Reset password form
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: ''
    });
  };

  const handleSettingsSubmit = (e) => {
    e.preventDefault();
    // TODO: Сохранить настройки в localStorage или через API
    localStorage.setItem('teacher_settings', JSON.stringify(settings));
    alert('Настройки успешно сохранены!');
  };

  if (loading) {
    return (
      <div style={styles.app}>
        <Navbar role="teacher" />
        <div style={styles.appBody}>
          <Sidebar role="teacher" />
          <main style={styles.mainContent}>
            <div style={styles.loadingContainer}>
              <div style={styles.spinner}></div>
              <p style={styles.loadingText}>Загрузка профиля...</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.app}>
      <Navbar role="teacher" />
      <div style={styles.appBody}>
        <Sidebar role="teacher" />
        <main style={styles.mainContent}>
          <div style={styles.pageHeader}>
            <h1 style={styles.pageTitle}>Профиль преподавателя</h1>
            <p style={styles.pageSubtitle}>Управление личными данными и настройками</p>
          </div>
          
          {/* Статистика */}
          <div style={styles.statsContainer}>
            <div style={styles.statCard}>
              <div style={styles.statIcon}>📚</div>
              <div style={styles.statContent}>
                <div style={styles.statValue}>{statistics.subjectsCount}</div>
                <div style={styles.statLabel}>Предметов</div>
              </div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statIcon}>📝</div>
              <div style={styles.statContent}>
                <div style={styles.statValue}>{statistics.assignmentsCount}</div>
                <div style={styles.statLabel}>Заданий создано</div>
              </div>
            </div>
          </div>

          <div style={styles.profileContainer}>
            <div style={styles.profileSection}>
              <h2 style={styles.sectionTitle}>👤 Личные данные</h2>
              <form onSubmit={handleProfileSubmit} style={styles.profileForm}>
                <div style={styles.formGroup}>
                  <label htmlFor="name" style={styles.label}>Имя</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={profile.name}
                    onChange={handleProfileChange}
                    style={styles.input}
                    placeholder="Введите ваше имя"
                  />
                </div>
                
                <div style={styles.formGroup}>
                  <label htmlFor="username" style={styles.label}>Имя пользователя</label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={profile.username}
                    onChange={handleProfileChange}
                    style={styles.input}
                    placeholder="Имя пользователя"
                    disabled
                  />
                  <p style={styles.helpText}>Имя пользователя нельзя изменить</p>
                </div>
                
                <div style={styles.formGroup}>
                  <label htmlFor="email" style={styles.label}>Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={profile.email}
                    onChange={handleProfileChange}
                    style={styles.input}
                    placeholder="email@example.com"
                  />
                </div>
                
                <button type="submit" style={styles.btnPrimary}>
                  💾 Сохранить изменения
                </button>
              </form>
            </div>
            
            <div style={styles.profileSection}>
              <h2 style={styles.sectionTitle}>🔐 Изменение пароля</h2>
              <form onSubmit={handlePasswordSubmit} style={styles.profileForm}>
                <div style={styles.formGroup}>
                  <label htmlFor="currentPassword" style={styles.label}>Текущий пароль</label>
                  <input
                    type="password"
                    id="currentPassword"
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    style={styles.input}
                    placeholder="Введите текущий пароль"
                  />
                </div>
                
                <div style={styles.formGroup}>
                  <label htmlFor="newPassword" style={styles.label}>Новый пароль</label>
                  <input
                    type="password"
                    id="newPassword"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    style={styles.input}
                    placeholder="Введите новый пароль (минимум 6 символов)"
                  />
                </div>
                
                <div style={styles.formGroup}>
                  <label htmlFor="confirmNewPassword" style={styles.label}>Подтвердите новый пароль</label>
                  <input
                    type="password"
                    id="confirmNewPassword"
                    name="confirmNewPassword"
                    value={passwordData.confirmNewPassword}
                    onChange={handlePasswordChange}
                    style={styles.input}
                    placeholder="Повторите новый пароль"
                  />
                </div>
                
                <button type="submit" style={styles.btnPrimary}>
                  🔑 Изменить пароль
                </button>
              </form>
            </div>
            
            <div style={styles.profileSection}>
              <h2 style={styles.sectionTitle}>⚙️ Настройки интерфейса</h2>
              <form onSubmit={handleSettingsSubmit} style={styles.profileForm}>
                <div style={styles.formGroup}>
                  <label htmlFor="theme" style={styles.label}>Тема оформления</label>
                  <select
                    id="theme"
                    name="theme"
                    value={settings.theme}
                    onChange={handleSettingsChange}
                    style={styles.select}
                  >
                    <option value="light">Светлая</option>
                    <option value="dark">Темная</option>
                  </select>
                </div>
                
                <div style={styles.formGroup}>
                  <label htmlFor="language" style={styles.label}>Язык интерфейса</label>
                  <select
                    id="language"
                    name="language"
                    value={settings.language}
                    onChange={handleSettingsChange}
                    style={styles.select}
                  >
                    <option value="ru">Русский</option>
                    <option value="en">English</option>
                    <option value="kk">Қазақша</option>
                  </select>
                </div>
                
                <button type="submit" style={styles.btnPrimary}>
                  💾 Сохранить настройки
                </button>
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

const styles = {
  app: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#f8fafc'
  },
  appBody: {
    display: 'flex',
    flex: 1
  },
  mainContent: {
    flex: 1,
    padding: '2rem',
    overflowY: 'auto',
    background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)'
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '4rem 2rem',
    gap: '1rem'
  },
  spinner: {
    width: '48px',
    height: '48px',
    border: '4px solid #e2e8f0',
    borderTop: '4px solid #1e40af',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  },
  loadingText: {
    color: '#64748b',
    fontSize: '1.125rem',
    fontWeight: '500'
  },
  pageHeader: {
    marginBottom: '2rem',
    background: 'white',
    padding: '2rem',
    borderRadius: '16px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    border: '1px solid #e2e8f0'
  },
  pageTitle: {
    fontSize: '2rem',
    fontWeight: '700',
    color: '#1e293b',
    margin: '0 0 0.5rem 0',
    background: 'linear-gradient(135deg, #1e40af 0%, #3730a3 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text'
  },
  pageSubtitle: {
    margin: 0,
    color: '#64748b',
    fontSize: '1rem',
    fontWeight: '400'
  },
  statsContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1.5rem',
    marginBottom: '2rem'
  },
  statCard: {
    background: 'white',
    borderRadius: '16px',
    padding: '1.5rem',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    border: '1px solid #e2e8f0',
    display: 'flex',
    alignItems: 'center',
    gap: '1rem'
  },
  statIcon: {
    fontSize: '2.5rem',
    width: '64px',
    height: '64px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #e0e7ff 0%, #ddd6fe 100%)',
    borderRadius: '12px'
  },
  statContent: {
    flex: 1
  },
  statValue: {
    fontSize: '2rem',
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: '0.25rem'
  },
  statLabel: {
    fontSize: '0.875rem',
    color: '#64748b',
    fontWeight: '500'
  },
  profileContainer: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '2rem',
    maxWidth: '900px'
  },
  profileSection: {
    backgroundColor: 'white',
    borderRadius: '16px',
    padding: '2rem',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    border: '1px solid #e2e8f0'
  },
  sectionTitle: {
    fontSize: '1.5rem',
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: '1.5rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  },
  profileForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem'
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  },
  label: {
    fontSize: '0.875rem',
    fontWeight: '600',
    color: '#374151'
  },
  input: {
    padding: '0.75rem 1rem',
    border: '2px solid #e5e7eb',
    borderRadius: '8px',
    fontSize: '0.875rem',
    transition: 'all 0.2s ease',
    fontFamily: 'inherit'
  },
  select: {
    padding: '0.75rem 1rem',
    border: '2px solid #e5e7eb',
    borderRadius: '8px',
    fontSize: '0.875rem',
    backgroundColor: 'white',
    fontFamily: 'inherit',
    cursor: 'pointer'
  },
  helpText: {
    fontSize: '0.75rem',
    color: '#9ca3af',
    marginTop: '0.25rem',
    fontStyle: 'italic'
  },
  btnPrimary: {
    padding: '0.75rem 1.5rem',
    background: 'linear-gradient(135deg, #1e40af 0%, #3730a3 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '0.875rem',
    fontWeight: '600',
    cursor: 'pointer',
    alignSelf: 'flex-start',
    transition: 'all 0.2s ease',
    boxShadow: '0 4px 12px rgba(30, 64, 175, 0.3)'
  }
};

// Добавляем анимацию спиннера
const spinnerStyles = `
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
`;
const styleSheet = document.createElement('style');
styleSheet.textContent = spinnerStyles;
document.head.appendChild(styleSheet);

export default TeacherProfile;

