// src/pages/student/Profile.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import { getUserName, isAuthenticated } from '../../services/auth';

const StudentProfile = () => {
  const [profile, setProfile] = useState({ name: '', email: '', group: '', course: '', specialty: '' });
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
  const [settings, setSettings] = useState({ language: 'ru' });
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated()) { navigate('/login'); return; }
    const userName = getUserName();
    setProfile({ name: userName || 'Студент', email: 'student@example.com', group: 'Группа 1', course: '3 курс', specialty: 'Информатика' });
  }, [navigate]);

  const handleProfileSubmit = (e) => { e.preventDefault(); alert('Профиль успешно обновлен!'); };
  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmNewPassword) { alert('Пароли не совпадают!'); return; }
    alert('Пароль успешно изменен!');
    setPasswordData({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
  };

  const initials = profile.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

  const field = (label, name, value, type = 'text', onChange) => (
    <div style={s.formGroup}>
      <label style={s.label}>{label}</label>
      <input type={type} name={name} value={value} onChange={onChange}
        style={s.input}
        onFocus={e => { e.target.style.borderColor = '#3b82f6'; e.target.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.15)'; }}
        onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.boxShadow = 'none'; }}
      />
    </div>
  );

  return (
    <div style={s.page}>
      <Navbar role="student" />
      <div style={s.body}>
        <Sidebar role="student" />
        <main style={s.main}>
          {/* Header */}
          <div style={s.header}>
            <div style={s.avatarWrap}>
              <div style={s.avatar}>{initials}</div>
              <div>
                <h1 style={s.title}>{profile.name}</h1>
                <p style={s.subtitle}>🎓 Студент · {profile.specialty}</p>
              </div>
            </div>
          </div>

          <div style={s.grid}>
            {/* Personal info */}
            <div style={s.card}>
              <h2 style={s.cardTitle}>👤 Личные данные</h2>
              <form onSubmit={handleProfileSubmit} style={s.form}>
                {field('Полное имя', 'name', profile.name, 'text', e => setProfile(p => ({ ...p, [e.target.name]: e.target.value })))}
                {field('Email', 'email', profile.email, 'email', e => setProfile(p => ({ ...p, [e.target.name]: e.target.value })))}
                {field('Группа', 'group', profile.group, 'text', e => setProfile(p => ({ ...p, [e.target.name]: e.target.value })))}
                {field('Курс', 'course', profile.course, 'text', e => setProfile(p => ({ ...p, [e.target.name]: e.target.value })))}
                {field('Специальность', 'specialty', profile.specialty, 'text', e => setProfile(p => ({ ...p, [e.target.name]: e.target.value })))}
                <button type="submit" style={s.btn}>Сохранить изменения</button>
              </form>
            </div>

            {/* Password */}
            <div style={s.card}>
              <h2 style={s.cardTitle}>🔐 Изменение пароля</h2>
              <form onSubmit={handlePasswordSubmit} style={s.form}>
                {field('Текущий пароль', 'currentPassword', passwordData.currentPassword, 'password', e => setPasswordData(p => ({ ...p, [e.target.name]: e.target.value })))}
                {field('Новый пароль', 'newPassword', passwordData.newPassword, 'password', e => setPasswordData(p => ({ ...p, [e.target.name]: e.target.value })))}
                {field('Подтвердите пароль', 'confirmNewPassword', passwordData.confirmNewPassword, 'password', e => setPasswordData(p => ({ ...p, [e.target.name]: e.target.value })))}
                <button type="submit" style={s.btn}>Изменить пароль</button>
              </form>
            </div>

            {/* Settings */}
            <div style={s.card}>
              <h2 style={s.cardTitle}>⚙️ Настройки интерфейса</h2>
              <form onSubmit={e => { e.preventDefault(); alert('Настройки сохранены!'); }} style={s.form}>
                <div style={s.formGroup}>
                  <label style={s.label}>Язык интерфейса</label>
                  <select value={settings.language} onChange={e => setSettings(p => ({ ...p, language: e.target.value }))} style={s.select}>
                    <option value="ru">🇷🇺 Русский</option>
                    <option value="en">🇬🇧 English</option>
                    <option value="kk">🇰🇿 Қазақша</option>
                  </select>
                </div>
                <button type="submit" style={s.btn}>Сохранить настройки</button>
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

const s = {
  page: { minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#0a1628', fontFamily: "'Inter',-apple-system,sans-serif" },
  body: { display: 'flex', flex: 1 },
  main: { flex: 1, padding: '2rem', overflowY: 'auto', background: 'linear-gradient(160deg,#0a1628 0%,#0f1e3a 100%)' },
  header: { background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '1.75rem 2rem', marginBottom: '1.5rem' },
  avatarWrap: { display: 'flex', alignItems: 'center', gap: '1.25rem' },
  avatar: { width: '64px', height: '64px', borderRadius: '16px', background: 'linear-gradient(135deg,#3b82f6,#1d4ed8)', color: '#fff', fontWeight: '800', fontSize: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 24px rgba(59,130,246,0.4)', flexShrink: 0 },
  title: { fontSize: '1.75rem', fontWeight: '800', color: '#fff', margin: '0 0 0.25rem 0', letterSpacing: '-0.02em' },
  subtitle: { color: 'rgba(255,255,255,0.45)', fontSize: '0.9rem', margin: 0, fontWeight: '500' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.25rem' },
  card: { background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '1.75rem' },
  cardTitle: { fontSize: '1rem', fontWeight: '700', color: '#fff', marginBottom: '1.25rem', paddingBottom: '0.875rem', borderBottom: '1px solid rgba(255,255,255,0.07)' },
  form: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  formGroup: { display: 'flex', flexDirection: 'column', gap: '0.375rem' },
  label: { fontSize: '0.8125rem', fontWeight: '600', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.05em' },
  input: { padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', fontSize: '0.9375rem', color: '#fff', outline: 'none', fontFamily: 'inherit', transition: 'all 0.2s ease' },
  select: { padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', fontSize: '0.9375rem', color: '#fff', outline: 'none', fontFamily: 'inherit' },
  btn: { padding: '0.75rem 1.5rem', background: 'linear-gradient(135deg,#3b82f6,#1d4ed8)', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '0.9375rem', fontWeight: '700', cursor: 'pointer', alignSelf: 'flex-start', boxShadow: '0 4px 12px rgba(59,130,246,0.4)' },
};

export default StudentProfile;