// src/pages/student/Profile.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import { getUserName, isAuthenticated } from '../../services/auth';

const StudentProfile = () => {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    group: '',
    course: '',
    specialty: ''
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

  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }
    
    // Загружаем данные профиля
    const userName = getUserName();
    setProfile({
      name: userName || 'Студент',
      email: 'student@example.com',
      group: 'Группа 1',
      course: '3 курс',
      specialty: 'Информатика'
    });
  }, [navigate]);

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
    alert('Настройки успешно сохранены!');
  };

  return (
    <div style={styles.app}>
      <Navbar role="student" />
      <div style={styles.appBody}>
        <Sidebar role="student" />
        <main style={styles.mainContent}>
          <div style={styles.pageHeader}>
            <h1 style={styles.pageTitle}>Профиль</h1>
          </div>
          
          <div style={styles.profileContainer}>
            <div style={styles.profileSection}>
              <h2 style={styles.sectionTitle}>Личные данные</h2>
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
                  />
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
                  />
                </div>
                
                <div style={styles.formGroup}>
                  <label htmlFor="group" style={styles.label}>Группа</label>
                  <input
                    type="text"
                    id="group"
                    name="group"
                    value={profile.group}
                    onChange={handleProfileChange}
                    style={styles.input}
                  />
                </div>
                
                <div style={styles.formGroup}>
                  <label htmlFor="course" style={styles.label}>Курс</label>
                  <input
                    type="text"
                    id="course"
                    name="course"
                    value={profile.course}
                    onChange={handleProfileChange}
                    style={styles.input}
                  />
                </div>
                
                <div style={styles.formGroup}>
                  <label htmlFor="specialty" style={styles.label}>Специальность</label>
                  <input
                    type="text"
                    id="specialty"
                    name="specialty"
                    value={profile.specialty}
                    onChange={handleProfileChange}
                    style={styles.input}
                  />
                </div>
                
                <button type="submit" style={styles.btnPrimary}>
                  Сохранить изменения
                </button>
              </form>
            </div>
            
            <div style={styles.profileSection}>
              <h2 style={styles.sectionTitle}>Изменение пароля</h2>
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
                  />
                </div>
                
                <button type="submit" style={styles.btnPrimary}>
                  Изменить пароль
                </button>
              </form>
            </div>
            
            <div style={styles.profileSection}>
              <h2 style={styles.sectionTitle}>Настройки интерфейса</h2>
              <form onSubmit={handleSettingsSubmit} style={styles.profileForm}>
                <div style={styles.formGroup}>
                  <label htmlFor="theme" style={styles.label}>Тема</label>
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
                  <label htmlFor="language" style={styles.label}>Язык</label>
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
                  Сохранить настройки
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
    flexDirection: 'column'
  },
  appBody: {
    display: 'flex',
    flex: 1
  },
  mainContent: {
    flex: 1,
    padding: '2rem',
    overflowY: 'auto'
  },
  pageHeader: {
    marginBottom: '2rem'
  },
  pageTitle: {
    fontSize: '2rem',
    fontWeight: '700',
    color: '#1f2937',
    margin: 0
  },
  profileContainer: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '2rem',
    maxWidth: '800px'
  },
  profileSection: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '2rem',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    border: '1px solid #e5e7eb'
  },
  sectionTitle: {
    fontSize: '1.5rem',
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: '1.5rem'
  },
  profileForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  },
  label: {
    fontSize: '0.875rem',
    fontWeight: '500',
    color: '#374151'
  },
  input: {
    padding: '0.75rem',
    border: '1px solid #d1d5db',
    borderRadius: '0.5rem',
    fontSize: '0.875rem',
    transition: 'all 0.2s ease'
  },
  select: {
    padding: '0.75rem',
    border: '1px solid #d1d5db',
    borderRadius: '0.5rem',
    fontSize: '0.875rem',
    backgroundColor: 'white'
  },
  btnPrimary: {
    padding: '0.75rem 1.5rem',
    background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '0.5rem',
    fontSize: '0.875rem',
    fontWeight: '500',
    cursor: 'pointer',
    alignSelf: 'flex-start'
  }
};

export default StudentProfile;