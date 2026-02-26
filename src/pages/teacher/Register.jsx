// src/pages/teacher/Register.jsx
import React, { memo, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../../services/auth';

const TeacherRegister = () => {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) { setError('Пожалуйста, введите имя'); return false; }
    if (!formData.username.trim()) { setError('Пожалуйста, введите email'); return false; }
    if (!formData.username.includes('@')) { setError('Email должен содержать символ @'); return false; }
    if (formData.password.length < 6) { setError('Пароль должен содержать минимум 6 символов'); return false; }
    if (formData.password !== formData.confirmPassword) { setError('Пароли не совпадают'); return false; }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true); setError(''); setSuccess('');
    try {
      await register(formData.name, formData.username, 'teacher', formData.password);
      setSuccess('Аккаунт успешно создан! Перенаправление...');
      setTimeout(() => navigate('/teacher/dashboard'), 2000);
    } catch (err) {
      setError(err.message || 'Ошибка при создании аккаунта');
    } finally {
      setLoading(false);
    }
  };

  const globalCSS = `
    @keyframes spinRegT { to { transform: rotate(360deg); } }
    .teacher-reg-input:focus {
      border-color: #7c3aed !important;
      box-shadow: 0 0 0 3px rgba(124,58,237,0.15) !important;
      background: #fff !important;
    }
    .teacher-reg-btn:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 10px 30px rgba(109,40,217,0.45) !important;
    }
  `;

  return (
    <div style={styles.page}>
      <style>{globalCSS}</style>

      {/* Using global shader background from App.jsx */}
      <div style={styles.overlay} />

      <div style={styles.card}>
        {/* Left panel */}
        <div style={styles.left}>
          <div style={styles.dotGrid} />
          <div style={styles.circleTopRight} />
          <div style={styles.circleBottomLeft} />

          <div style={styles.leftContent}>
            <div style={styles.brand}>
              <div style={styles.brandPill}>Преподавателям</div>
              <h1 style={styles.brandName}>StudyMate</h1>
              <p style={styles.brandTagline}>Платформа управления учебным процессом</p>
            </div>

            <div style={styles.aboutBlock}>
              <p style={styles.aboutText}>
                Создайте аккаунт преподавателя и управляйте группами,
                заданиями и оценками студентов. Полная аналитика успеваемости — на одном экране.
              </p>
              <div style={styles.divider} />
              <p style={styles.aboutHint}>Регистрация займёт меньше минуты.</p>
            </div>

            <div style={styles.features}>
              {[
                { num: '01', text: 'Управление группами' },
                { num: '02', text: 'Выставление оценок' },
                { num: '03', text: 'Аналитика и отчёты' },
              ].map(f => (
                <div key={f.num} style={styles.feature}>
                  <span style={styles.featureNum}>{f.num}</span>
                  <div style={styles.featureLine} />
                  <span style={styles.featureText}>{f.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right panel — form */}
        <div style={styles.right}>
          <div style={styles.formWrap}>
            <h2 style={styles.title}>Регистрация преподавателя</h2>
            <p style={styles.subtitle}>Создайте аккаунт преподавателя</p>

            {error && <div style={styles.errorBox}>⚠️ {error}</div>}
            {success && <div style={styles.successBox}>✅ {success}</div>}

            <form onSubmit={handleSubmit} style={styles.form}>
              {[
                { label: 'ПОЛНОЕ ИМЯ', name: 'name', type: 'text', placeholder: 'Введите ваше полное имя' },
                { label: 'EMAIL', name: 'username', type: 'email', placeholder: 'example@mail.com' },
                { label: 'ПАРОЛЬ', name: 'password', type: 'password', placeholder: 'Минимум 6 символов' },
                { label: 'ПОДТВЕРДИТЕ ПАРОЛЬ', name: 'confirmPassword', type: 'password', placeholder: 'Повторите пароль' },
              ].map(f => (
                <div key={f.name} style={styles.inputGroup}>
                  <label style={styles.label}>{f.label}</label>
                  <input
                    className="teacher-reg-input"
                    type={f.type}
                    name={f.name}
                    value={formData[f.name]}
                    onChange={handleChange}
                    placeholder={f.placeholder}
                    style={styles.input}
                    required
                  />
                </div>
              ))}

              <button
                className="teacher-reg-btn"
                type="submit"
                disabled={loading}
                style={{ ...styles.btn, ...(loading ? styles.btnDisabled : {}) }}
              >
                {loading ? (
                  <>
                    <div style={styles.spinner} />
                    Создание аккаунта...
                  </>
                ) : 'Зарегистрироваться'}
              </button>
            </form>

            <div style={styles.footer}>
              <p style={styles.footerText}>
                Уже есть аккаунт?{' '}
                <Link to="/teacher/login" style={styles.link}>Войти</Link>
              </p>
              <p style={styles.footerText}>
                Вы студент?{' '}
                <Link to="/student/register" style={styles.link}>Регистрация студента</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  page: {
    minHeight: '100vh',
    width: '100vw',
    background: 'transparent',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: "'Inter', -apple-system, sans-serif",
    position: 'relative',
    overflow: 'hidden',
    padding: '1rem',
  },
  overlay: {
    position: 'absolute',
    inset: 0,
    background: 'transparent',
    zIndex: 1,
  },
  card: {
    position: 'relative',
    zIndex: 2,
    display: 'flex',
    width: '100%',
    maxWidth: '960px',
    minHeight: '620px',
    borderRadius: '24px',
    overflow: 'hidden',
    boxShadow: '0 32px 80px rgba(0,0,0,0.4)',
  },
  left: {
    flex: 1,
    background: 'linear-gradient(160deg, #0d0a1f 0%, #2e1065 60%, #5b21b6 100%)',
    color: 'white',
    padding: '0',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  dotGrid: {
    position: 'absolute',
    inset: 0,
    backgroundImage: 'radial-gradient(rgba(255,255,255,0.12) 1px, transparent 1px)',
    backgroundSize: '28px 28px',
    zIndex: 0,
  },
  circleTopRight: {
    position: 'absolute',
    width: '260px', height: '260px',
    borderRadius: '50%',
    border: '1px solid rgba(255,255,255,0.12)',
    top: '-80px', right: '-80px',
    zIndex: 0,
  },
  circleBottomLeft: {
    position: 'absolute',
    width: '180px', height: '180px',
    borderRadius: '50%',
    border: '1px solid rgba(255,255,255,0.06)',
    bottom: '-60px', left: '-60px',
    zIndex: 0,
  },
  leftContent: {
    position: 'relative',
    zIndex: 1,
    padding: '3rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.75rem',
  },
  brand: { display: 'flex', flexDirection: 'column', gap: '0.375rem' },
  brandPill: {
    display: 'inline-block',
    padding: '0.25rem 0.875rem',
    borderRadius: '20px',
    background: 'rgba(255,255,255,0.12)',
    border: '1px solid rgba(255,255,255,0.2)',
    fontSize: '0.75rem',
    fontWeight: '600',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    color: 'rgba(255,255,255,0.8)',
    width: 'fit-content',
    marginBottom: '0.5rem',
  },
  brandName: {
    fontSize: '2.25rem', fontWeight: '800', color: '#fff',
    lineHeight: 1.1, letterSpacing: '-0.02em',
  },
  brandTagline: {
    fontSize: '0.9375rem', color: 'rgba(255,255,255,0.55)',
    fontWeight: '400', lineHeight: 1.5,
  },
  aboutBlock: {
    background: 'rgba(15, 23, 42, 0.45)',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: '16px',
    padding: '1.25rem 1.375rem',
  },
  aboutText: {
    fontSize: '0.9375rem', color: 'rgba(255,255,255,0.75)',
    fontWeight: '400', lineHeight: 1.7, margin: 0,
  },
  divider: { height: '1px', background: 'rgba(15, 23, 42, 0.45)', margin: '0.875rem 0' },
  aboutHint: {
    fontSize: '0.8125rem', color: 'rgba(255,255,255,0.4)',
    fontWeight: '500', margin: 0, fontStyle: 'italic',
  },
  features: { display: 'flex', flexDirection: 'column', gap: '0.875rem' },
  feature: { display: 'flex', alignItems: 'center', gap: '0.875rem' },
  featureNum: {
    fontSize: '0.7rem', fontWeight: '700',
    color: 'rgba(255,255,255,0.35)', letterSpacing: '0.05em',
    flexShrink: 0, width: '18px',
  },
  featureLine: {
    width: '28px', height: '1.5px',
    background: 'rgba(255,255,255,0.2)', flexShrink: 0,
  },
  featureText: {
    fontSize: '0.9375rem', fontWeight: '500', color: 'rgba(255,255,255,0.8)',
  },
  /* Right panel */
  right: {
    flex: '0 0 440px',
    background: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2.5rem',
  },
  formWrap: { width: '100%', maxWidth: '360px' },
  title: {
    fontSize: '1.75rem', fontWeight: '800', color: '#111827',
    letterSpacing: '-0.02em', marginBottom: '0.375rem',
  },
  subtitle: { fontSize: '0.9375rem', color: '#6b7280', marginBottom: '1.5rem' },
  errorBox: {
    background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626',
    padding: '0.75rem 1rem', borderRadius: '10px', marginBottom: '1rem',
    fontSize: '0.875rem', fontWeight: '500',
  },
  successBox: {
    background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#16a34a',
    padding: '0.75rem 1rem', borderRadius: '10px', marginBottom: '1rem',
    fontSize: '0.875rem', fontWeight: '500',
  },
  form: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '0.375rem' },
  label: {
    fontSize: '0.7rem', fontWeight: '700', color: '#6b7280',
    letterSpacing: '0.08em', textTransform: 'uppercase',
  },
  input: {
    padding: '0.75rem 1rem',
    border: '1.5px solid #e5e7eb',
    borderRadius: '10px',
    fontSize: '0.9375rem',
    outline: 'none',
    background: '#f8fafc',
    color: '#111827',
    transition: 'all 0.2s',
    width: '100%',
    boxSizing: 'border-box',
  },
  btn: {
    background: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
    color: '#fff',
    border: 'none',
    padding: '0.875rem',
    borderRadius: '10px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    marginTop: '0.5rem',
    transition: 'all 0.25s',
    width: '100%',
    boxShadow: '0 4px 14px rgba(124,58,237,0.35)',
  },
  btnDisabled: { opacity: 0.6, cursor: 'not-allowed', transform: 'none' },
  spinner: {
    width: '16px', height: '16px',
    border: '2px solid transparent',
    borderTop: '2px solid #fff',
    borderRadius: '50%',
    animation: 'spinRegT 0.8s linear infinite',
  },
  footer: {
    textAlign: 'center', marginTop: '1.5rem',
    paddingTop: '1.25rem', borderTop: '1px solid #f3f4f6',
  },
  footerText: { color: '#9ca3af', fontSize: '0.875rem', marginTop: '0.5rem' },
  link: { color: '#7c3aed', textDecoration: 'none', fontWeight: '600' },
};

export default TeacherRegister;
