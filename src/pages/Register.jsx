// src/pages/Register.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../services/auth';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    role: 'student',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Пожалуйста, введите имя');
      return false;
    }
    
    if (!formData.username.trim()) {
      setError('Пожалуйста, введите имя пользователя');
      return false;
    }
    
    if (formData.password.length < 6) {
      setError('Пароль должен содержать минимум 6 символов');
      return false;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError('Пароли не совпадают');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log('=== НАЧАЛО РЕГИСТРАЦИИ ===');
    console.log('Форма данных:', formData);
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const result = await register(formData.name, formData.username, formData.role, formData.password);
      console.log('Регистрация успешна:', result);
      
      setSuccess('Аккаунт успешно создан! Перенаправление...');
      
      setTimeout(() => {
        const role = result.role;
        console.log('Роль после регистрации:', role);
        if (role === 'teacher') {
          navigate('/teacher/dashboard');
        } else {
          navigate('/student/dashboard');
        }
      }, 2000);
    } catch (err) {
      console.error('Ошибка регистрации:', err);
      setError(err.message || 'Ошибка при создании аккаунта');
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
            <p style={styles.tagline}>Платформа для эффективного обучения и преподавания</p>
          </div>
          
          <div style={styles.features}>
            <div style={styles.feature}>
              <span style={styles.featureIcon}>🎓</span>
              <div>
                <h3 style={styles.featureTitle}>Для студентов</h3>
                <p style={styles.featureText}>Доступ к курсам, заданиям и прогрессу</p>
              </div>
            </div>
            <div style={styles.feature}>
              <span style={styles.featureIcon}>👨‍🏫</span>
              <div>
                <h3 style={styles.featureTitle}>Для преподавателей</h3>
                <p style={styles.featureText}>Создание курсов и управление обучением</p>
              </div>
            </div>
          </div>
        </div>

        <div style={styles.rightSection}>
          <div style={styles.formContainer}>
            <div style={styles.formHeader}>
              <h2 style={styles.formTitle}>Создать аккаунт</h2>
              <p style={styles.formSubtitle}>Заполните форму для регистрации</p>
            </div>
            
            {error && (
              <div style={styles.errorAlert}>
                <span style={styles.alertIcon}>⚠️</span>
                {error}
              </div>
            )}
            
            {success && (
              <div style={styles.successAlert}>
                <span style={styles.alertIcon}>✅</span>
                {success}
              </div>
            )}
            
            <form onSubmit={handleSubmit} style={styles.form}>
              <div style={styles.inputGroup}>
                <label style={styles.inputLabel}>Полное имя</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Введите ваше полное имя"
                  style={styles.input}
                  required
                />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.inputLabel}>Имя пользователя (логин)</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Введите имя пользователя для входа"
                  style={styles.input}
                  required
                />
              </div>
              
              <div style={styles.inputGroup}>
                <label style={styles.inputLabel}>Роль</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  style={styles.select}
                  required
                >
                  <option value="student">Студент</option>
                  <option value="teacher">Преподаватель</option>
                </select>
              </div>
              
              <div style={styles.inputGroup}>
                <label style={styles.inputLabel}>Пароль</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Введите пароль (мин. 6 символов)"
                  style={styles.input}
                  required
                />
              </div>
              
              <div style={styles.inputGroup}>
                <label style={styles.inputLabel}>Подтвердите пароль</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Подтвердите пароль"
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
                    Создание...
                  </>
                ) : (
                  'Создать аккаунт'
                )}
              </button>
            </form>
            
            <div style={styles.footer}>
              <p style={styles.footerText}>
                Уже есть аккаунт?{' '}
                <Link to="/login" style={styles.footerLink}>
                  Войти
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
        
        input:focus, select:focus {
          border-color: #3b82f6 !important;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1) !important;
        }
        
        button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(59, 130, 246, 0.4) !important;
        }
        
        a:hover {
          color: #1d4ed8 !important;
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
    background: 'linear-gradient(135deg, rgba(255,255,255,1) 0%, rgba(248,250,252,1) 25%, rgba(241,245,249,1) 50%, rgba(248,250,252,1) 75%, rgba(255,255,255,1) 100%)',
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
    background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
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
    background: 'linear-gradient(135deg, #fff 0%, #e0e7ff 100%)',
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
    gap: '30px'
  },
  
  feature: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '20px'
  },
  
  featureIcon: {
    fontSize: '28px',
    width: '60px',
    height: '60px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(255, 255, 255, 0.15)',
    borderRadius: '15px',
    backdropFilter: 'blur(10px)',
    flexShrink: 0
  },
  
  featureTitle: {
    fontSize: '20px',
    fontWeight: '600',
    marginBottom: '8px'
  },
  
  featureText: {
    fontSize: '16px',
    opacity: 0.9,
    lineHeight: 1.5
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
  
  successAlert: {
    background: '#f0fdf4',
    border: '1px solid #bbf7d0',
    color: '#16a34a',
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
  
  select: {
    padding: '16px',
    border: '2px solid #e5e7eb',
    borderRadius: '12px',
    fontSize: '16px',
    background: '#ffffff',
    cursor: 'pointer',
    outline: 'none',
    transition: 'all 0.2s ease',
    fontWeight: '400',
    width: '100%',
    boxSizing: 'border-box'
  },
  
  submitButton: {
    background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
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
    boxShadow: '0 4px 15px rgba(59, 130, 246, 0.4)',
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
    fontWeight: '400'
  },
  
  footerLink: {
    color: '#3b82f6',
    textDecoration: 'none',
    fontWeight: '600',
    transition: 'color 0.2s ease'
  }
};

export default Register;