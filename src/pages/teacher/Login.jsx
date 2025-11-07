// src/pages/teacher/Login.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login, getUserRole } from '../../services/auth';

const TeacherLogin = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

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
      const result = await login(formData.username, formData.password);
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
      <div style={styles.gradientBackground}></div>
      
      <div style={styles.mainContainer}>
        <div style={styles.leftSection}>
          <div style={styles.logoSection}>
            <h1 style={styles.logo}>StudyMate</h1>
            <p style={styles.tagline}>Панель преподавателя</p>
          </div>
          
          <div style={styles.features}>
            <div style={styles.feature}>
              <span style={styles.featureIcon}>👨‍🏫</span>
              <span style={styles.featureText}>Управление курсами</span>
            </div>
            <div style={styles.feature}>
              <span style={styles.featureIcon}>📝</span>
              <span style={styles.featureText}>Оценка студентов</span>
            </div>
            <div style={styles.feature}>
              <span style={styles.featureIcon}>📊</span>
              <span style={styles.featureText}>Аналитика и отчеты</span>
            </div>
          </div>
        </div>

        <div style={styles.rightSection}>
          <div style={styles.formContainer}>
            <div style={styles.formHeader}>
              <h2 style={styles.formTitle}>Вход для преподавателей</h2>
              <p style={styles.formSubtitle}>Войдите в панель управления</p>
            </div>
            
            {error && (
              <div style={styles.errorAlert}>
                <span style={styles.alertIcon}>⚠️</span>
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit} style={styles.form}>
              <div style={styles.inputGroup}>
                <label style={styles.inputLabel}>Email</label>
                <input
                  type="email"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="example@mail.com"
                  style={styles.input}
                  required
                />
              </div>
              
              <div style={styles.inputGroup}>
                <label style={styles.inputLabel}>Пароль</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Введите пароль"
                  style={styles.input}
                  required
                />
              </div>
              
              <button 
                type="submit" 
                style={{
                  ...styles.submitButton,
                  ...(loading && styles.submitButtonDisabled)
                }}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div style={styles.spinner}></div>
                    Вход...
                  </>
                ) : (
                  'Войти'
                )}
              </button>
            </form>
            
            <div style={styles.footer}>
              <p style={styles.footerText}>
                Нет аккаунта?{' '}
                <Link to="/teacher/register" style={styles.footerLink}>
                  Зарегистрироваться
                </Link>
              </p>
              <p style={styles.footerText}>
                Вы студент?{' '}
                <Link to="/student/login" style={styles.footerLink}>
                  Войти как студент
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        input:focus {
          border-color: #7c3aed !important;
          box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.1) !important;
        }
        
        button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(124, 58, 237, 0.4) !important;
        }
        
        a:hover {
          color: #6d28d9 !important;
        }
      `}</style>
    </div>
  );
};

const styles = {
  page: {
    minHeight: '100vh',
    width: '100vw',
    background: '#ffffff',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0',
    margin: '0',
    overflow: 'hidden',
    position: 'relative'
  },
  
  gradientBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(135deg, rgba(124,58,237,0.1) 0%, rgba(168,85,247,0.05) 100%)',
    zIndex: 0
  },
  
  mainContainer: {
    width: '95vw',
    height: '95vh',
    background: 'rgba(255, 255, 255, 0.9)',
    borderRadius: '20px',
    boxShadow: '0 25px 50px rgba(0, 0, 0, 0.15)',
    display: 'flex',
    overflow: 'hidden',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.5)',
    position: 'relative',
    zIndex: 1
  },
  
  leftSection: {
    flex: 1,
    background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)',
    color: 'white',
    padding: '60px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    position: 'relative'
  },
  
  logoSection: {
    marginBottom: '60px'
  },
  
  logo: {
    fontSize: '64px',
    fontWeight: '800',
    marginBottom: '20px',
    background: 'linear-gradient(135deg, #fff 0%, #e9d5ff 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text'
  },
  
  tagline: {
    fontSize: '24px',
    opacity: 0.9,
    lineHeight: 1.4,
    fontWeight: '300'
  },
  
  features: {
    display: 'flex',
    flexDirection: 'column',
    gap: '25px'
  },
  
  feature: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    fontSize: '18px',
    fontWeight: '500'
  },
  
  featureIcon: {
    fontSize: '24px',
    width: '50px',
    height: '50px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(255, 255, 255, 0.15)',
    borderRadius: '12px',
    backdropFilter: 'blur(10px)'
  },
  
  featureText: {
    fontSize: '18px'
  },
  
  rightSection: {
    flex: '0 0 500px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px',
    background: 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(10px)'
  },
  
  formContainer: {
    width: '100%',
    maxWidth: '380px'
  },
  
  formHeader: {
    textAlign: 'center',
    marginBottom: '40px'
  },
  
  formTitle: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: '12px'
  },
  
  formSubtitle: {
    fontSize: '16px',
    color: '#6b7280',
    fontWeight: '400'
  },
  
  errorAlert: {
    background: '#fef2f2',
    border: '1px solid #fecaca',
    color: '#dc2626',
    padding: '16px',
    borderRadius: '12px',
    marginBottom: '24px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    fontSize: '14px',
    fontWeight: '500'
  },
  
  alertIcon: {
    fontSize: '18px'
  },
  
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px'
  },
  
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  
  inputLabel: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#374151',
    marginBottom: '4px'
  },
  
  input: {
    padding: '16px',
    border: '2px solid #e5e7eb',
    borderRadius: '12px',
    fontSize: '16px',
    transition: 'all 0.2s ease',
    outline: 'none',
    fontWeight: '400',
    background: '#ffffff',
    width: '100%',
    boxSizing: 'border-box',
    color: '#1f2937'
  },
  
  submitButton: {
    background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
    color: 'white',
    border: 'none',
    padding: '18px',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    marginTop: '8px',
    boxShadow: '0 4px 15px rgba(124, 58, 237, 0.4)',
    width: '100%'
  },
  
  submitButtonDisabled: {
    opacity: 0.6,
    cursor: 'not-allowed'
  },
  
  spinner: {
    width: '20px',
    height: '20px',
    border: '2px solid transparent',
    borderTop: '2px solid white',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  },
  
  footer: {
    textAlign: 'center',
    marginTop: '32px',
    paddingTop: '24px',
    borderTop: '1px solid #f3f4f6'
  },
  
  footerText: {
    color: '#6b7280',
    fontSize: '14px',
    fontWeight: '400',
    marginTop: '8px'
  },
  
  footerLink: {
    color: '#7c3aed',
    textDecoration: 'none',
    fontWeight: '600',
    transition: 'color 0.2s ease'
  }
};

export default TeacherLogin;
