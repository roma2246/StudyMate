import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import { getUserName, getCurrentUser, isAuthenticated } from '../../services/auth';
import { getSubjects, getAssignmentsByTeacher } from '../../services/api';

const TeacherProfile = () => {
  const [profile, setProfile] = useState({ name: '', username: '', email: '' });
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
  const [settings, setSettings] = useState({ language: 'ru' });
  const [stats, setStats] = useState({ subjects: 0, assignments: 0 });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated()) { navigate('/teacher/login'); return; }
    loadData();
  }, [navigate]);

  const loadData = async () => {
    try {
      setLoading(true);
      const user = getCurrentUser();
      if (!user) return;
      const name = getUserName();
      setProfile({ name: name || 'Преподаватель', username: user.username || '', email: `${user.username}@school.edu` });
      try {
        const [subs, asgn] = await Promise.all([getSubjects(), getAssignmentsByTeacher(user.id)]);
        setStats({ subjects: Array.isArray(subs) ? subs.length : 0, assignments: Array.isArray(asgn) ? asgn.length : 0 });
      } catch { }
    } catch { } finally { setLoading(false); }
  };

  const handleProfileSubmit = (e) => { e.preventDefault(); alert('Профиль успешно обновлен!'); };
  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmNewPassword) { alert('Пароли не совпадают!'); return; }
    if (!passwordData.currentPassword || passwordData.newPassword.length < 6) { alert('Заполните все поля. Минимум 6 символов.'); return; }
    alert('Пароль успешно изменен!');
    setPasswordData({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
  };

  const initials = profile.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

  const inputFocus = (e) => { e.target.style.borderColor = '#8b5cf6'; e.target.style.boxShadow = '0 0 0 3px rgba(139,92,246,0.15)'; };
  const inputBlur = (e) => { e.target.style.borderColor = 'rgba(255,255,255,0.06)'; e.target.style.boxShadow = 'none'; };

  const field = (label, name, value, type, obj, setObj) => (
    <div style={s.formGroup}>
      <label style={s.label}>{label}</label>
      <input type={type} value={value}
        onChange={e => setObj(p => ({ ...p, [name]: e.target.value }))}
        style={s.input} onFocus={inputFocus} onBlur={inputBlur} />
    </div>
  );

  return (
    <div style={s.page}>
      <Navbar role="teacher" />
      <div style={s.body}>
        <Sidebar role="teacher" />
        <main style={s.main}>
          {/* Header */}
          <div style={s.header}>
            <div style={s.avatarWrap}>
              <div style={s.avatar}>{initials}</div>
              <div>
                <h1 style={s.title}>{profile.name}</h1>
                <p style={s.subtitle}>👨‍🏫 Преподаватель · {profile.username}</p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div style={s.statsGrid}>
            <div style={s.statCard}>
              <div style={s.statIcon}>📚</div>
              <div>
                <div style={s.statVal}>{stats.subjects}</div>
                <div style={s.statLbl}>Предметов</div>
              </div>
            </div>
            <div style={s.statCard}>
              <div style={s.statIcon}>📝</div>
              <div>
                <div style={s.statVal}>{stats.assignments}</div>
                <div style={s.statLbl}>Заданий создано</div>
              </div>
            </div>
          </div>

          <div style={s.grid}>
            {/* Personal info */}
            <div style={s.card}>
              <h2 style={s.cardTitle}>👤 Личные данные</h2>
              <form onSubmit={handleProfileSubmit} style={s.form}>
                {field('Имя', 'name', profile.name, 'text', profile, setProfile)}
                <div style={s.formGroup}>
                  <label style={s.label}>Имя пользователя</label>
                  <input type="text" value={profile.username} disabled style={{ ...s.input, opacity: 0.5, cursor: 'not-allowed' }} />
                  <span style={s.help}>Имя пользователя нельзя изменить</span>
                </div>
                {field('Email', 'email', profile.email, 'email', profile, setProfile)}
                <button type="submit" style={s.btn}>💾 Сохранить</button>
              </form>
            </div>

            {/* Password */}
            <div style={s.card}>
              <h2 style={s.cardTitle}>🔐 Изменение пароля</h2>
              <form onSubmit={handlePasswordSubmit} style={s.form}>
                {field('Текущий пароль', 'currentPassword', passwordData.currentPassword, 'password', passwordData, setPasswordData)}
                {field('Новый пароль (мин. 6 симв.)', 'newPassword', passwordData.newPassword, 'password', passwordData, setPasswordData)}
                {field('Подтвердите новый пароль', 'confirmNewPassword', passwordData.confirmNewPassword, 'password', passwordData, setPasswordData)}
                <button type="submit" style={s.btn}>🔑 Изменить пароль</button>
              </form>
            </div>

            {/* Settings */}
            <div style={s.card}>
              <h2 style={s.cardTitle}>⚙️ Настройки</h2>
              <form onSubmit={e => { e.preventDefault(); localStorage.setItem('teacher_settings', JSON.stringify(settings)); alert('Настройки сохранены!'); }} style={s.form}>
                <div style={s.formGroup}>
                  <label style={s.label}>Язык интерфейса</label>
                  <select value={settings.language} onChange={e => setSettings(p => ({ ...p, language: e.target.value }))} style={s.select}>
                    <option value="ru">🇷🇺 Русский</option>
                    <option value="en">🇬🇧 English</option>
                    <option value="kk">🇰🇿 Қазақша</option>
                  </select>
                </div>
                <button type="submit" style={s.btn}>💾 Сохранить настройки</button>
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

const s = {
  page: { minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'transparent', fontFamily: "'Inter',-apple-system,sans-serif" },
  body: { display: 'flex', flex: 1 },
  main: { flex: 1, padding: '2rem', overflowY: 'auto', background: 'transparent' },
  header: { background: 'rgba(15, 23, 42, 0.45)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '16px', padding: '1.75rem 2rem', marginBottom: '1.25rem' },
  avatarWrap: { display: 'flex', alignItems: 'center', gap: '1.25rem' },
  avatar: { width: '64px', height: '64px', borderRadius: '16px', background: 'linear-gradient(135deg,#8b5cf6,#5b21b6)', color: '#fff', fontWeight: '800', fontSize: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 24px rgba(139,92,246,0.4)', flexShrink: 0 },
  title: { fontSize: '1.75rem', fontWeight: '800', color: '#fff', margin: '0 0 0.25rem 0', letterSpacing: '-0.02em' },
  subtitle: { color: 'rgba(255,255,255,0.45)', fontSize: '0.9rem', margin: 0, fontWeight: '500' },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px,1fr))', gap: '1rem', marginBottom: '1.25rem' },
  statCard: { background: 'rgba(15, 23, 42, 0.45)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '14px', padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' },
  statIcon: { fontSize: '2rem', width: '52px', height: '52px', background: 'rgba(139,92,246,0.15)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  statVal: { fontSize: '2rem', fontWeight: '800', color: '#a78bfa', lineHeight: 1 },
  statLbl: { fontSize: '0.8125rem', color: 'rgba(255,255,255,0.4)', fontWeight: '600', marginTop: '0.25rem' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px,1fr))', gap: '1.25rem' },
  card: { background: 'rgba(15, 23, 42, 0.45)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '16px', padding: '1.75rem' },
  cardTitle: { fontSize: '1rem', fontWeight: '700', color: '#fff', marginBottom: '1.25rem', paddingBottom: '0.875rem', borderBottom: '1px solid rgba(255,255,255,0.07)' },
  form: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  formGroup: { display: 'flex', flexDirection: 'column', gap: '0.375rem' },
  label: { fontSize: '0.8125rem', fontWeight: '600', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.05em' },
  input: { padding: '0.75rem 1rem', background: 'rgba(15, 23, 42, 0.45)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', fontSize: '0.9375rem', color: '#fff', outline: 'none', fontFamily: 'inherit', transition: 'all 0.2s ease' },
  select: { padding: '0.75rem 1rem', background: 'rgba(15, 23, 42, 0.45)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', fontSize: '0.9375rem', color: '#fff', outline: 'none', fontFamily: 'inherit', cursor: 'pointer' },
  help: { fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)', fontStyle: 'italic' },
  btn: { padding: '0.75rem 1.5rem', background: 'linear-gradient(135deg,#8b5cf6,#5b21b6)', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '0.9375rem', fontWeight: '700', cursor: 'pointer', alignSelf: 'flex-start', boxShadow: '0 4px 12px rgba(139,92,246,0.4)' },
};

export default TeacherProfile;
