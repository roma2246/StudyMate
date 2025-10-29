import React, { useState } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import { getUserName } from '../../services/auth';

const StudentProfile = () => {
  const [profile, setProfile] = useState({
    name: getUserName() || 'Студент',
    email: 'student@example.com',
    group: 'Группа 1',
    course: '3 курс',
    specialty: 'Информатика'
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
    <div className="app">
      <Navbar role="student" />
      <div className="app-body">
        <Sidebar role="student" />
        <main className="main-content">
          <div className="page-header">
            <h1>Профиль</h1>
          </div>
          
          <div className="profile-container">
            <div className="profile-section">
              <h2>Личные данные</h2>
              <form onSubmit={handleProfileSubmit} className="profile-form">
                <div className="form-group">
                  <label htmlFor="name">Имя</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={profile.name}
                    onChange={handleProfileChange}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={profile.email}
                    onChange={handleProfileChange}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="group">Группа</label>
                  <input
                    type="text"
                    id="group"
                    name="group"
                    value={profile.group}
                    onChange={handleProfileChange}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="course">Курс</label>
                  <input
                    type="text"
                    id="course"
                    name="course"
                    value={profile.course}
                    onChange={handleProfileChange}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="specialty">Специальность</label>
                  <input
                    type="text"
                    id="specialty"
                    name="specialty"
                    value={profile.specialty}
                    onChange={handleProfileChange}
                  />
                </div>
                
                <button type="submit" className="btn btn-primary">
                  Сохранить изменения
                </button>
              </form>
            </div>
            
            <div className="profile-section">
              <h2>Изменение пароля</h2>
              <form onSubmit={handlePasswordSubmit} className="profile-form">
                <div className="form-group">
                  <label htmlFor="currentPassword">Текущий пароль</label>
                  <input
                    type="password"
                    id="currentPassword"
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="newPassword">Новый пароль</label>
                  <input
                    type="password"
                    id="newPassword"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="confirmNewPassword">Подтвердите новый пароль</label>
                  <input
                    type="password"
                    id="confirmNewPassword"
                    name="confirmNewPassword"
                    value={passwordData.confirmNewPassword}
                    onChange={handlePasswordChange}
                  />
                </div>
                
                <button type="submit" className="btn btn-primary">
                  Изменить пароль
                </button>
              </form>
            </div>
            
            <div className="profile-section">
              <h2>Настройки интерфейса</h2>
              <form onSubmit={handleSettingsSubmit} className="profile-form">
                <div className="form-group">
                  <label htmlFor="theme">Тема</label>
                  <select
                    id="theme"
                    name="theme"
                    value={settings.theme}
                    onChange={handleSettingsChange}
                  >
                    <option value="light">Светлая</option>
                    <option value="dark">Темная</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label htmlFor="language">Язык</label>
                  <select
                    id="language"
                    name="language"
                    value={settings.language}
                    onChange={handleSettingsChange}
                  >
                    <option value="ru">Русский</option>
                    <option value="en">English</option>
                    <option value="kk">Қазақша</option>
                  </select>
                </div>
                
                <button type="submit" className="btn btn-primary">
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

export default StudentProfile;