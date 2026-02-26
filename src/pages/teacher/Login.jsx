// src/pages/teacher/Login.jsx
import React, { memo, useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login, getUserRole } from '../../services/auth';

const TeacherLogin = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [size, setSize] = useState({ w: window.innerWidth, h: window.innerHeight });
  const navigate = useNavigate();

  useEffect(() => {
    const onResize = () => setSize({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username.trim() || !formData.password.trim()) {
      setError('Пожалуйста, заполните все поля');
      return;
    }
    if (!formData.username.includes('@')) {
      setError('Введите корректный email с символом @');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await login(formData.username, formData.password);
      const role = getUserRole();
      if (role !== 'teacher') {
        setError('Этот аккаунт не для преподавателей. Используйте вход для студентов.');
        return;
      }
      navigate('/teacher/dashboard');
    } catch (err) {
      setError(err.message || 'Ошибка при входе в систему');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <style>{globalCSS}</style>

      {/* Using global shader background from App.jsx */}
      <div style={styles.overlay} />

      <div style={styles.card}>
        {/* Left panel */}
        <div style={styles.left}>
          <div style={styles.brandIcon}>S</div>
          <h1 style={styles.brandName}>StudyMate</h1>
          <p style={styles.brandTagline}>Панель преподавателя</p>

          <div style={styles.features}>
            {[
              { icon: '👨‍🏫', text: 'Управление курсами' },
              { icon: '📝', text: 'Оценка студентов' },
              { icon: '📊', text: 'Аналитика и отчёты' },
            ].map(f => (
              <div key={f.text} style={styles.feature}>
                <span style={styles.featureIcon}>{f.icon}</span>
                <span>{f.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right form */}
        <div style={styles.right}>
          <div style={styles.formWrap}>
            <h2 style={styles.formTitle}>Вход для преподавателей</h2>
            <p style={styles.formSub}>Войдите в панель управления</p>

            {error && (
              <div style={styles.errorBox}>
                <span>⚠️</span> {error}
              </div>
            )}

            <form onSubmit={handleSubmit} style={styles.form}>
              <div style={styles.fieldGroup}>
                <label style={styles.label}>Email</label>
                <input
                  type="email" name="username"
                  value={formData.username} onChange={handleChange}
                  placeholder="example@mail.com"
                  style={styles.input} required
                />
              </div>
              <div style={styles.fieldGroup}>
                <label style={styles.label}>Пароль</label>
                <input
                  type="password" name="password"
                  value={formData.password} onChange={handleChange}
                  placeholder="Введите пароль"
                  style={styles.input} required
                />
              </div>
              <button
                type="submit"
                className="teacher-login-btn"
                style={{ ...styles.btn, ...(loading ? styles.btnDisabled : {}) }}
                disabled={loading}
              >
                {loading
                  ? <><span style={styles.spinner} />Вход...</>
                  : 'Войти в систему'}
              </button>
            </form>

            <div style={styles.footer}>
              <p style={styles.footerLine}>
                Нет аккаунта?{' '}
                <Link to="/teacher/register" style={styles.link}>Зарегистрироваться</Link>
              </p>
              <p style={styles.footerLine}>
                Вы студент?{' '}
                <Link to="/student/login" style={styles.link}>Войти как студент</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const globalCSS = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
  @keyframes blobMove1 {
    0%,100% { transform: translate(0,0) scale(1); }
    50%      { transform: translate(40px,-30px) scale(1.08); }
  }
  @keyframes blobMove2 {
    0%,100% { transform: translate(0,0) scale(1); }
    50%      { transform: translate(-30px,40px) scale(1.05); }
  }
  @keyframes blobMove3 {
    0%,100% { transform: translate(0,0) scale(1); }
    50%      { transform: translate(20px,20px) scale(1.1); }
  }
  @keyframes spinBtn { to { transform: rotate(360deg); } }
  .teacher-login-btn:hover:not(:disabled) {
    transform: translateY(-2px) !important;
    box-shadow: 0 10px 30px rgba(109,40,217,0.45) !important;
  }
`;

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
    zIndex: 1,
    display: 'flex',
    width: '100%',
    maxWidth: '900px',
    minHeight: '560px',
    borderRadius: '24px',
    overflow: 'hidden',
    boxShadow: '0 32px 80px rgba(0,0,0,0.18)',
  },
  left: {
    flex: 1,
    background: 'linear-gradient(145deg, #6d28d9 0%, #9333ea 100%)',
    color: 'white',
    padding: '3.5rem',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  brandIcon: {
    width: '56px', height: '56px',
    borderRadius: '16px',
    background: 'rgba(255,255,255,0.2)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '1.75rem', fontWeight: '800',
    marginBottom: '1.25rem',
  },
  brandName: {
    fontSize: '2.5rem',
    fontWeight: '800',
    marginBottom: '0.5rem',
    color: '#fff',
  },
  brandTagline: {
    fontSize: '1.0625rem',
    opacity: 0.8,
    fontWeight: '400',
    marginBottom: '2.5rem',
  },
  features: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.125rem',
  },
  feature: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    fontSize: '1rem',
    fontWeight: '500',
  },
  featureIcon: {
    width: '44px', height: '44px',
    background: 'rgba(255,255,255,0.15)',
    borderRadius: '12px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '1.25rem',
    flexShrink: 0,
  },
  right: {
    flex: '0 0 420px',
    background: 'rgba(255,255,255,0.97)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2.5rem',
  },
  formWrap: {
    width: '100%',
    maxWidth: '370px',
  },
  formTitle: {
    fontSize: '1.625rem',
    fontWeight: '800',
    color: '#1e293b',
    marginBottom: '0.375rem',
  },
  formSub: {
    fontSize: '0.9375rem',
    color: '#64748b',
    marginBottom: '1.75rem',
  },
  errorBox: {
    background: '#fef2f2',
    border: '1px solid #fecaca',
    color: '#dc2626',
    padding: '0.875rem 1rem',
    borderRadius: '12px',
    marginBottom: '1.25rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.875rem',
    fontWeight: '500',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.125rem',
  },
  fieldGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.375rem',
  },
  label: {
    fontSize: '0.8rem',
    fontWeight: '700',
    color: '#475569',
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
  },
  input: {
    padding: '0.875rem 1rem',
    border: '1.5px solid #e2e8f0',
    borderRadius: '12px',
    fontSize: '0.9375rem',
    fontFamily: "'Inter', sans-serif",
    color: '#1e293b',
    background: '#f8fafc',
    outline: 'none',
    transition: 'all 0.18s ease',
    width: '100%',
    boxSizing: 'border-box',
  },
  btn: {
    marginTop: '0.5rem',
    width: '100%',
    padding: '1rem',
    background: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontSize: '1rem',
    fontWeight: '700',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.625rem',
    boxShadow: '0 4px 16px rgba(109,40,217,0.35)',
    transition: 'all 0.2s ease',
  },
  btnDisabled: {
    opacity: 0.65,
    cursor: 'not-allowed',
  },
  spinner: {
    width: '18px', height: '18px',
    border: '2.5px solid rgba(255,255,255,0.4)',
    borderTopColor: 'white',
    borderRadius: '50%',
    animation: 'spinBtn 0.75s linear infinite',
    display: 'inline-block',
  },
  footer: {
    marginTop: '1.5rem',
    paddingTop: '1.25rem',
    borderTop: '1px solid #f1f5f9',
  },
  footerLine: {
    fontSize: '0.875rem',
    color: '#64748b',
    marginTop: '0.5rem',
    textAlign: 'center',
  },
  link: {
    color: '#7c3aed',
    fontWeight: '600',
    textDecoration: 'none',
  },
};

export default TeacherLogin;
