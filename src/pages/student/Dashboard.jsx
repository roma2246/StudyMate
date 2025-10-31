// src/pages/student/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import Card from '../../components/Card';
import Chart from '../../components/Chart';
import Table from '../../components/Table';
import { getUserName, isAuthenticated } from '../../services/auth';

const StudentDashboard = () => {
  const [gpaData, setGpaData] = useState([]);
  const [gradeDistribution, setGradeDistribution] = useState([]);
  const [recentGrades, setRecentGrades] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [loading, setLoading] = useState(true);
  const studentName = getUserName();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }
    loadData();
  }, [navigate]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Mock GPA data by subject
      const mockGpaData = [
        { label: 'Математика', value: 4.5, color: '#3b82f6' },
        { label: 'Физика', value: 4.0, color: '#ef4444' },
        { label: 'Химия', value: 3.8, color: '#10b981' },
        { label: 'Биология', value: 4.2, color: '#f59e0b' },
        { label: 'Информатика', value: 5.0, color: '#8b5cf6' }
      ];
      
      setGpaData(mockGpaData);
      
      // Mock grade distribution (for pie chart)
      const mockDistribution = [
        { label: 'Отлично (5)', value: 12, color: '#10b981' },
        { label: 'Хорошо (4)', value: 9, color: '#3b82f6' },
        { label: 'Удовлетворительно (3)', value: 3, color: '#f59e0b' },
        { label: 'Неудовлетворительно (2)', value: 1, color: '#ef4444' }
      ];
      setGradeDistribution(mockDistribution);
      
      // Mock recent grades
      const mockGrades = [
        { 
          id: 1,
          subject: 'Математика', 
          grade: 5, 
          date: '2023-10-15',
          type: 'Контрольная работа',
          teacher: 'Иванова А.П.'
        },
        { 
          id: 2,
          subject: 'Физика', 
          grade: 4, 
          date: '2023-10-14',
          type: 'Лабораторная работа',
          teacher: 'Петров С.М.'
        },
        { 
          id: 3,
          subject: 'Химия', 
          grade: 4, 
          date: '2023-10-13',
          type: 'Тест',
          teacher: 'Сидорова О.И.'
        },
        { 
          id: 4,
          subject: 'Биология', 
          grade: 5, 
          date: '2023-10-12',
          type: 'Проект',
          teacher: 'Козлова Е.В.'
        },
        { 
          id: 5,
          subject: 'Информатика', 
          grade: 5, 
          date: '2023-10-11',
          type: 'Практическая работа',
          teacher: 'Николаев Д.С.'
        }
      ];
      
      setRecentGrades(mockGrades);

      // Mock upcoming items (assignments/exams)
      const mockUpcoming = [
        { 
          id: 1,
          type: 'Домашнее задание', 
          subject: 'Физика', 
          dueDate: '2023-10-20',
          priority: 'high',
          description: 'Задачи по термодинамике'
        },
        { 
          id: 2,
          type: 'Контрольная', 
          subject: 'Химия', 
          dueDate: '2023-10-22',
          priority: 'medium',
          description: 'Органическая химия'
        },
        { 
          id: 3,
          type: 'Проект', 
          subject: 'Информатика', 
          dueDate: '2023-10-28',
          priority: 'low',
          description: 'Разработка веб-приложения'
        }
      ];
      setUpcoming(mockUpcoming);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    loadData();
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  };

  const getPriorityText = (priority) => {
    switch (priority) {
      case 'high': return 'Высокий';
      case 'medium': return 'Средний';
      case 'low': return 'Низкий';
      default: return 'Не указан';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ru-RU');
  };

  return (
    <div style={styles.app}>
      <Navbar role="student" />
      <div style={styles.appBody}>
        <Sidebar role="student" />
        <main style={styles.mainContent}>
          <div style={styles.pageHeader}>
            <div>
              <h1 style={styles.pageTitle}>
                Добро пожаловать, {studentName || 'Студент'}! 🎓
              </h1>
              <p style={styles.pageSubtitle}>
                Обзор вашей успеваемости и предстоящих событий
              </p>
            </div>
            <div style={styles.pageActions}>
              <button 
                style={styles.btnOutline} 
                onClick={handleRefresh}
                disabled={loading}
              >
                {loading ? '🔄' : '🔄'} Обновить
              </button>
              <button style={styles.btnPrimary}>
                📋 Мои цели
              </button>
            </div>
          </div>
          
          {loading ? (
            <div style={styles.loadingContainer}>
              <div style={styles.spinner}></div>
              <p style={styles.loadingText}>Загружаем ваши данные...</p>
            </div>
          ) : (
            <>
              {/* Статистика */}
              <div style={styles.dashboardStats}>
                <Card 
                  title="Средний балл" 
                  value="4.3" 
                  subtitle="из 5.0"
                  icon="📊" 
                  color="purple" 
                  trend="+0.2"
                />
                <Card 
                  title="Завершено заданий" 
                  value="18" 
                  subtitle="из 21"
                  icon="✅" 
                  color="green" 
                  trend="+3"
                />
                <Card 
                  title="Ожидает сдачи" 
                  value="3" 
                  subtitle="ближайшие 7 дней"
                  icon="⏳" 
                  color="yellow" 
                />
                <Card 
                  title="Посещаемость" 
                  value="92%" 
                  subtitle="в этом месяце"
                  icon="📅" 
                  color="blue" 
                  trend="+5%"
                />
              </div>
              
              {/* Графики */}
              <div style={styles.dashboardCharts}>
                <div style={styles.chartContainer}>
                  <Chart 
                    type="bar" 
                    title="Средний балл по предметам" 
                    data={gpaData}
                    height={300}
                  />
                </div>
                <div style={styles.chartContainer}>
                  <Chart 
                    type="pie" 
                    title="Распределение оценок" 
                    data={gradeDistribution}
                    height={300}
                  />
                </div>
              </div>
              
              {/* Последние оценки и предстоящие события */}
              <div style={styles.dashboardGrid}>
                <div style={styles.gridColumn}>
                  <div style={styles.sectionCard}>
                    <div style={styles.sectionHeader}>
                      <h2 style={styles.sectionTitle}>📝 Последние оценки</h2>
                      <span style={styles.viewAll}>Все оценки →</span>
                    </div>
                    <div style={styles.tableContainer}>
                      <Table 
                        columns={[
                          { key: 'subject', header: 'Предмет', width: '25%' },
                          { key: 'type', header: 'Тип работы', width: '30%' },
                          { key: 'grade', header: 'Оценка', width: '15%' },
                          { key: 'date', header: 'Дата', width: '20%' },
                          { key: 'teacher', header: 'Преподаватель', width: '25%' }
                        ]}
                        data={recentGrades}
                        showHeader={true}
                        striped={true}
                      />
                    </div>
                  </div>
                </div>
                
                <div style={styles.gridColumn}>
                  <div style={styles.sectionCard}>
                    <div style={styles.sectionHeader}>
                      <h2 style={styles.sectionTitle}>📅 Ближайшие события</h2>
                      <span style={styles.viewAll}>Календарь →</span>
                    </div>
                    <div style={styles.upcomingList}>
                      {upcoming.length === 0 ? (
                        <div style={styles.noEvents}>
                          🎉 Нет предстоящих событий
                        </div>
                      ) : (
                        <div style={styles.upcomingItems}>
                          {upcoming.map((item) => (
                            <div key={item.id} style={styles.upcomingItem}>
                              <div style={styles.upcomingIcon}>
                                {item.type === 'Домашнее задание' && '📚'}
                                {item.type === 'Контрольная' && '📝'}
                                {item.type === 'Проект' && '💼'}
                              </div>
                              <div style={styles.upcomingContent}>
                                <div style={styles.upcomingTitle}>
                                  <strong>{item.subject}</strong>
                                  <span style={styles.upcomingType}>{item.type}</span>
                                </div>
                                <div style={styles.upcomingDescription}>
                                  {item.description}
                                </div>
                                <div style={styles.upcomingMeta}>
                                  <span style={styles.dueDate}>
                                    📅 до {formatDate(item.dueDate)}
                                  </span>
                                  <span 
                                    style={{
                                      ...styles.priority,
                                      color: getPriorityColor(item.priority)
                                    }}
                                  >
                                    ● {getPriorityText(item.priority)} приоритет
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Быстрые действия */}
              <div style={styles.quickActions}>
                <h2 style={styles.sectionTitle}>⚡ Быстрые действия</h2>
                <div style={styles.actionButtons}>
                  <button 
                    style={styles.actionBtn}
                    onClick={() => navigate('/student/grades')}
                  >
                    📖 Посмотреть все оценки
                  </button>
                  <button 
                    style={styles.actionBtn}
                    onClick={() => navigate('/student/profile')}
                  >
                    👤 Редактировать профиль
                  </button>
                  <button style={styles.actionBtn}>
                    📚 Загрузить материалы
                  </button>
                  <button style={styles.actionBtn}>
                    💬 Связаться с преподавателем
                  </button>
                </div>
              </div>
            </>
          )}
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
  pageHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '2rem',
    background: 'white',
    padding: '2rem',
    borderRadius: '16px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    border: '1px solid #e2e8f0'
  },
  pageTitle: {
    fontSize: '2.25rem',
    fontWeight: '800',
    color: '#1e293b',
    margin: '0 0 0.5rem 0',
    background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text'
  },
  pageSubtitle: {
    margin: 0,
    color: '#64748b',
    fontSize: '1.125rem',
    fontWeight: '400'
  },
  pageActions: {
    display: 'flex',
    gap: '1rem',
    alignItems: 'center'
  },
  btnPrimary: {
    padding: '0.75rem 1.5rem',
    background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontSize: '0.875rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
  },
  btnOutline: {
    padding: '0.75rem 1.5rem',
    background: 'white',
    color: '#475569',
    border: '2px solid #e2e8f0',
    borderRadius: '12px',
    fontSize: '0.875rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  },
  dashboardStats: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '1.5rem',
    marginBottom: '2rem'
  },
  dashboardCharts: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr',
    gap: '1.5rem',
    marginBottom: '2rem'
  },
  chartContainer: {
    background: 'white',
    borderRadius: '16px',
    padding: '1.5rem',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    border: '1px solid #e2e8f0'
  },
  dashboardGrid: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr',
    gap: '1.5rem',
    marginBottom: '2rem'
  },
  gridColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem'
  },
  sectionCard: {
    background: 'white',
    borderRadius: '16px',
    padding: '1.5rem',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    border: '1px solid #e2e8f0',
    height: 'fit-content'
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem',
    paddingBottom: '1rem',
    borderBottom: '2px solid #f1f5f9'
  },
  sectionTitle: {
    fontSize: '1.25rem',
    fontWeight: '700',
    color: '#1e293b',
    margin: 0,
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  },
  viewAll: {
    color: '#3b82f6',
    fontSize: '0.875rem',
    fontWeight: '600',
    cursor: 'pointer',
    textDecoration: 'none'
  },
  tableContainer: {
    overflowX: 'auto'
  },
  upcomingList: {
    minHeight: '200px'
  },
  noEvents: {
    color: '#94a3b8',
    textAlign: 'center',
    padding: '3rem 1rem',
    fontSize: '1.125rem',
    fontWeight: '500'
  },
  upcomingItems: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  upcomingItem: {
    display: 'flex',
    gap: '1rem',
    padding: '1rem',
    background: '#f8fafc',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
    transition: 'all 0.2s ease'
  },
  upcomingIcon: {
    fontSize: '1.5rem',
    flexShrink: 0
  },
  upcomingContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  },
  upcomingTitle: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '0.5rem'
  },
  upcomingType: {
    background: '#e0e7ff',
    color: '#3730a3',
    padding: '0.25rem 0.75rem',
    borderRadius: '20px',
    fontSize: '0.75rem',
    fontWeight: '600'
  },
  upcomingDescription: {
    color: '#64748b',
    fontSize: '0.875rem'
  },
  upcomingMeta: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '0.5rem',
    fontSize: '0.75rem'
  },
  dueDate: {
    color: '#64748b',
    fontWeight: '500'
  },
  priority: {
    fontWeight: '600',
    fontSize: '0.75rem'
  },
  quickActions: {
    background: 'white',
    borderRadius: '16px',
    padding: '1.5rem',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    border: '1px solid #e2e8f0'
  },
  actionButtons: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1rem',
    marginTop: '1rem'
  },
  actionBtn: {
    padding: '1rem 1.5rem',
    background: 'white',
    color: '#475569',
    border: '2px solid #e2e8f0',
    borderRadius: '12px',
    fontSize: '0.875rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    textAlign: 'left',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
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
    borderTop: '4px solid #3b82f6',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  },
  loadingText: {
    color: '#64748b',
    fontSize: '1.125rem',
    fontWeight: '500',
    margin: 0
  }
};

// Добавляем анимацию спиннера
const spinnerStyles = `
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
`;

// Добавляем стили в документ
const styleSheet = document.styleSheets[0];
styleSheet.insertRule(spinnerStyles, styleSheet.cssRules.length);

export default StudentDashboard;