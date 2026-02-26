// src/pages/student/Login.jsx
import React, { memo, useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login, getUserRole } from '../../services/auth';

const StudentLogin = () => {
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
      if (role !== 'student') {
        setError('Этот аккаунт не для студентов. Используйте вход для преподавателей.');
        return;
      }
      navigate('/student/dashboard');
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

      <div style={styles.card}>
        {/* Left panel */}
        <div style={styles.left}>
          {/* Dot grid decoration */}
          <div style={styles.dotGrid} />
          {/* Decorative circles */}
          <div style={styles.circleTopRight} />
          <div style={styles.circleBottomLeft} />

          <div style={styles.leftContent}>
            <div style={styles.brand}>
              <div style={styles.brandPill}>Студентам</div>
              <h1 style={styles.brandName}>StudyMate</h1>
              <p style={styles.brandTagline}>Система управления учебным процессом</p>
            </div>

            {/* About block */}
            <div style={styles.aboutBlock}>
              <p style={styles.aboutText}>
                StudyMate — это удобная система для студентов и преподавателей.
                Здесь ты можешь следить за своими оценками, сдавать задания,
                видеть расписание и отслеживать прогресс в обучении — всё в одном месте.
              </p>
              <div style={styles.divider} />
              <p style={styles.aboutHint}>Войди в аккаунт, чтобы увидеть свой дашборд.</p>
            </div>

            {/* Feature lines */}
            <div style={styles.features}>
              {[
                { num: '01', text: 'Интерактивные задания' },
                { num: '02', text: 'Детальная статистика' },
                { num: '03', text: 'Отслеживание прогресса' },
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

        {/* Right form */}
        <div style={styles.right}>
          <div style={styles.formWrap}>
            <h2 style={styles.formTitle}>Вход для студентов</h2>
            <p style={styles.formSub}>Войдите в свой аккаунт</p>

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
                className="login-btn"
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
                <Link to="/student/register" style={styles.link}>Зарегистрироваться</Link>
              </p>
              <p style={styles.footerLine}>
                Вы преподаватель?{' '}
                <Link to="/teacher/login" style={styles.link}>Войти как преподаватель</Link>
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
  .login-btn:hover:not(:disabled) {
    transform: translateY(-2px) !important;
    box-shadow: 0 10px 30px rgba(37,99,235,0.45) !important;
  }
  .login-field:focus {
    border-color: #3b82f6 !important;
    box-shadow: 0 0 0 3px rgba(59,130,246,0.15) !important;
    background: #fff !important;
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
  /* Subtle dark overlay so the card reads better */
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
    maxWidth: '940px',
    minHeight: '580px',
    borderRadius: '24px',
    overflow: 'hidden',
    boxShadow: '0 32px 80px rgba(0,0,0,0.18)',
  },
  /* ---- LEFT PANEL ---- */
  left: {
    flex: 1,
    background: 'linear-gradient(160deg, #0f172a 0%, #1e3a8a 60%, #1d4ed8 100%)',
    color: 'white',
    padding: '0',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  /* Dot grid */
  dotGrid: {
    position: 'absolute',
    inset: 0,
    backgroundImage: 'radial-gradient(rgba(255,255,255,0.12) 1px, transparent 1px)',
    backgroundSize: '28px 28px',
    zIndex: 0,
  },
  /* Decorative circles */
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
    padding: '3rem 3rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem',
  },
  brand: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.375rem',
  },
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
    fontSize: '2.25rem',
    fontWeight: '800',
    color: '#fff',
    lineHeight: 1.1,
    letterSpacing: '-0.02em',
  },
  brandTagline: {
    fontSize: '0.9375rem',
    color: 'rgba(255,255,255,0.55)',
    fontWeight: '400',
    lineHeight: 1.5,
  },
  /* About block */
  aboutBlock: {
    background: 'rgba(15, 23, 42, 0.45)',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: '16px',
    padding: '1.25rem 1.375rem',
  },
  aboutText: {
    fontSize: '0.9375rem',
    color: 'rgba(255,255,255,0.75)',
    fontWeight: '400',
    lineHeight: 1.7,
    margin: 0,
  },
  divider: {
    height: '1px',
    background: 'rgba(15, 23, 42, 0.45)',
    margin: '0.875rem 0',
  },
  aboutHint: {
    fontSize: '0.8125rem',
    color: 'rgba(255,255,255,0.4)',
    fontWeight: '500',
    margin: 0,
    fontStyle: 'italic',
  },
  /* Feature rows */
  features: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.875rem',
  },
  feature: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.875rem',
  },
  featureNum: {
    fontSize: '0.7rem',
    fontWeight: '700',
    color: 'rgba(255,255,255,0.35)',
    letterSpacing: '0.05em',
    flexShrink: 0,
    width: '18px',
  },
  featureLine: {
    width: '28px',
    height: '1.5px',
    background: 'rgba(255,255,255,0.2)',
    flexShrink: 0,
  },
  featureText: {
    fontSize: '0.9375rem',
    fontWeight: '500',
    color: 'rgba(255,255,255,0.8)',
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
    background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
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
    boxShadow: '0 4px 16px rgba(37,99,235,0.35)',
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
    color: '#2563eb',
    fontWeight: '600',
    textDecoration: 'none',
  },
};

export default StudentLogin;
