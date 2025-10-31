// src/pages/teacher/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import Card from '../../components/Card';
import Chart from '../../components/Chart';
import Table from '../../components/Table';
import { getUserName, isAuthenticated } from '../../services/auth';

const TeacherDashboard = () => {
  const [stats, setStats] = useState({
    students: 0,
    subjects: 0,
    grades: 0,
    averageGpa: 0
  });
  
  const [topStudents, setTopStudents] = useState([]);
  const [gpaDistribution, setGpaDistribution] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const teacherName = getUserName();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }
    loadDashboardData();
  }, [navigate]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Mock data for admin dashboard
      setStats({
        students: 32,
        subjects: 5,
        grades: 156,
        averageGpa: 4.1
      });
      
      setTopStudents([
        { id: 1, name: 'Иван Иванов', gpa: 4.8, group: 'Группа 1' },
        { id: 2, name: 'Мария Петрова', gpa: 4.7, group: 'Группа 2' },
        { id: 3, name: 'Алексей Сидоров', gpa: 4.6, group: 'Группа 1' },
        { id: 4, name: 'Елена Козлова', gpa: 4.5, group: 'Группа 3' },
        { id: 5, name: 'Дмитрий Смирнов', gpa: 4.4, group: 'Группа 2' }
      ]);
      
      setGpaDistribution([
        { label: 'Математика', value: 4.3, color: '#3b82f6' },
        { label: 'Физика', value: 4.1, color: '#ef4444' },
        { label: 'Химия', value: 3.9, color: '#10b981' },
        { label: 'Биология', value: 4.2, color: '#f59e0b' },
        { label: 'Информатика', value: 4.5, color: '#8b5cf6' }
      ]);

      setRecentActivity([
        { id: 1, student: 'Иван Иванов', action: 'Добавлена оценка', subject: 'Математика', grade: 5, date: '2023-10-15 14:30' },
        { id: 2, student: 'Мария Петрова', action: 'Обновлен профиль', subject: '-', grade: '-', date: '2023-10-15 13:15' },
        { id: 3, student: 'Алексей Сидоров', action: 'Добавлена оценка', subject: 'Физика', grade: 4, date: '2023-10-14 16:45' },
        { id: 4, student: 'Елена Козлова', action: 'Добавлен комментарий', subject: 'Биология', grade: '-', date: '2023-10-14 11:20' },
        { id: 5, student: 'Дмитрий Смирнов', action: 'Добавлена оценка', subject: 'Информатика', grade: 5, date: '2023-10-13 15:10' }
      ]);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    loadDashboardData();
  };

  const getActionIcon = (action) => {
    switch (action) {
      case 'Добавлена оценка': return '📝';
      case 'Обновлен профиль': return '👤';
      case 'Добавлен комментарий': return '💬';
      default: return '📋';
    }
  };

  return (
    <div style={styles.app}>
      <Navbar role="teacher" />
      <div style={styles.appBody}>
        <Sidebar role="teacher" />
        <main style={styles.mainContent}>
          <div style={styles.pageHeader}>
            <div>
              <h1 style={styles.pageTitle}>
                Админ-панель, {teacherName || 'Преподаватель'}! 👨‍🏫
              </h1>
              <p style={styles.pageSubtitle}>
                Обзор системы управления обучением
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
                📊 Полный отчет
              </button>
            </div>
          </div>
          
          {loading ? (
            <div style={styles.loadingContainer}>
              <div style={styles.spinner}></div>
              <p style={styles.loadingText}>Загружаем данные системы...</p>
            </div>
          ) : (
            <>
              {/* Статистика */}
              <div style={styles.dashboardStats}>
                <Card 
                  title="Студенты" 
                  value={stats.students} 
                  subtitle="в системе"
                  icon="👥" 
                  color="blue" 
                  trend="+2"
                />
                <Card 
                  title="Предметы" 
                  value={stats.subjects} 
                  subtitle="активных"
                  icon="📚" 
                  color="green" 
                />
                <Card 
                  title="Оценки" 
                  value={stats.grades} 
                  subtitle="выставлено"
                  icon="📝" 
                  color="purple" 
                  trend="+12"
                />
                <Card 
                  title="Средний GPA" 
                  value={stats.averageGpa} 
                  subtitle="по всем предметам"
                  icon="📊" 
                  color="yellow" 
                  trend="+0.2"
                />
              </div>
              
              {/* Графики и таблицы */}
              <div style={styles.dashboardGrid}>
                <div style={styles.gridColumn}>
                  <div style={styles.sectionCard}>
                    <div style={styles.sectionHeader}>
                      <h2 style={styles.sectionTitle}>📈 Успеваемость по предметам</h2>
                    </div>
                    <Chart 
                      type="bar" 
                      data={gpaDistribution}
                      height={300}
                    />
                  </div>
                  
                  <div style={styles.sectionCard}>
                    <div style={styles.sectionHeader}>
                      <h2 style={styles.sectionTitle}>📋 Последние действия</h2>
                      <span style={styles.viewAll}>Все действия →</span>
                    </div>
                    <div style={styles.activityList}>
                      {recentActivity.map((activity) => (
                        <div key={activity.id} style={styles.activityItem}>
                          <div style={styles.activityIcon}>
                            {getActionIcon(activity.action)}
                          </div>
                          <div style={styles.activityContent}>
                            <div style={styles.activityTitle}>
                              <strong>{activity.student}</strong>
                              <span style={styles.activityAction}>{activity.action}</span>
                            </div>
                            <div style={styles.activityDetails}>
                              {activity.subject !== '-' && (
                                <span style={styles.activitySubject}>{activity.subject}</span>
                              )}
                              {activity.grade !== '-' && (
                                <span style={styles.activityGrade}>Оценка: {activity.grade}</span>
                              )}
                              <span style={styles.activityDate}>{activity.date}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div style={styles.gridColumn}>
                  <div style={styles.sectionCard}>
                    <div style={styles.sectionHeader}>
                      <h2 style={styles.sectionTitle}>🏆 Топ студентов</h2>
                      <span style={styles.viewAll}>Весь рейтинг →</span>
                    </div>
                    <div style={styles.topStudentsList}>
                      {topStudents.map((student, index) => (
                        <div key={student.id} style={styles.topStudentItem}>
                          <div style={styles.studentRank}>
                            {index === 0 && '🥇'}
                            {index === 1 && '🥈'}
                            {index === 2 && '🥉'}
                            {index > 2 && `#${index + 1}`}
                          </div>
                          <div style={styles.studentInfo}>
                            <div style={styles.studentName}>{student.name}</div>
                            <div style={styles.studentGroup}>{student.group}</div>
                          </div>
                          <div style={styles.studentGpa}>
                            <strong>{student.gpa}</strong>
                            <span style={styles.gpaLabel}>GPA</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div style={styles.sectionCard}>
                    <div style={styles.sectionHeader}>
                      <h2 style={styles.sectionTitle}>⚡ Быстрые действия</h2>
                    </div>
                    <div style={styles.quickActions}>
                      <button 
                        style={styles.quickActionBtn}
                        onClick={() => navigate('/teacher/grades')}
                      >
                        <span style={styles.actionIcon}>📝</span>
                        <span>Добавить оценку</span>
                      </button>
                      <button 
                        style={styles.quickActionBtn}
                        onClick={() => navigate('/teacher/students')}
                      >
                        <span style={styles.actionIcon}>👥</span>
                        <span>Управление студентами</span>
                      </button>
                      <button 
                        style={styles.quickActionBtn}
                        onClick={() => navigate('/teacher/subjects')}
                      >
                        <span style={styles.actionIcon}>📚</span>
                        <span>Редактировать предметы</span>
                      </button>
                      <button 
                        style={styles.quickActionBtn}
                        onClick={() => navigate('/teacher/rating')}
                      >
                        <span style={styles.actionIcon}>📊</span>
                        <span>Посмотреть рейтинг</span>
                      </button>
                    </div>
                  </div>
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
    background: 'linear-gradient(135deg, #1e40af 0%, #3730a3 100%)',
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
    background: 'linear-gradient(135deg, #1e40af 0%, #3730a3 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontSize: '0.875rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 4px 12px rgba(30, 64, 175, 0.3)'
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
  dashboardGrid: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr',
    gap: '1.5rem'
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
    border: '1px solid #e2e8f0'
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
  activityList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  activityItem: {
    display: 'flex',
    gap: '1rem',
    padding: '1rem',
    background: '#f8fafc',
    borderRadius: '12px',
    border: '1px solid #e2e8f0'
  },
  activityIcon: {
    fontSize: '1.25rem',
    flexShrink: 0
  },
  activityContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem'
  },
  activityTitle: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '0.5rem'
  },
  activityAction: {
    background: '#e0e7ff',
    color: '#3730a3',
    padding: '0.25rem 0.75rem',
    borderRadius: '20px',
    fontSize: '0.75rem',
    fontWeight: '600'
  },
  activityDetails: {
    display: 'flex',
    gap: '1rem',
    flexWrap: 'wrap',
    fontSize: '0.75rem',
    color: '#64748b'
  },
  activitySubject: {
    background: '#f1f5f9',
    padding: '0.25rem 0.5rem',
    borderRadius: '6px'
  },
  activityGrade: {
    background: '#f0fdf4',
    color: '#166534',
    padding: '0.25rem 0.5rem',
    borderRadius: '6px'
  },
  topStudentsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem'
  },
  topStudentItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '1rem',
    background: '#f8fafc',
    borderRadius: '12px',
    border: '1px solid #e2e8f0'
  },
  studentRank: {
    fontSize: '1.125rem',
    fontWeight: '700',
    color: '#475569',
    minWidth: '2rem'
  },
  studentInfo: {
    flex: 1
  },
  studentName: {
    fontWeight: '600',
    color: '#1e293b'
  },
  studentGroup: {
    fontSize: '0.75rem',
    color: '#64748b'
  },
  studentGpa: {
    textAlign: 'center',
    background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    color: 'white',
    padding: '0.5rem 0.75rem',
    borderRadius: '8px',
    minWidth: '4rem'
  },
  gpaLabel: {
    fontSize: '0.625rem',
    opacity: 0.9
  },
  quickActions: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '0.75rem'
  },
  quickActionBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '1rem',
    background: 'white',
    color: '#475569',
    border: '2px solid #e2e8f0',
    borderRadius: '12px',
    fontSize: '0.875rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    textAlign: 'left'
  },
  actionIcon: {
    fontSize: '1.25rem'
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
    borderTop: '4px solid #1e40af',
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

export default TeacherDashboard;