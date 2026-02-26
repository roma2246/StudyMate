// src/pages/student/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import Card from '../../components/Card';
import Chart from '../../components/Chart';
import Table from '../../components/Table';
import { getUserName, isAuthenticated, getCurrentUser } from '../../services/auth';
import { getStudentByUserId, getGradesByStudent, getStudentGPA, getAssignmentsByStudent } from '../../services/api';
import { getSubjects } from '../../services/api';

const StudentDashboard = () => {
  const [gpaData, setGpaData] = useState([]);
  const [gradeDistribution, setGradeDistribution] = useState([]);
  const [recentGrades, setRecentGrades] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [stats, setStats] = useState({
    averageGPA: 0,
    completedAssignments: 0,
    totalAssignments: 0,
    upcomingAssignments: 0
  });
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

      const currentUser = getCurrentUser();
      if (!currentUser || !currentUser.id) {
        console.error('User not authenticated');
        return;
      }

      const student = await getStudentByUserId(currentUser.id);
      if (!student || !student.id) {
        console.error('Student not found for userId:', currentUser.id);
        return;
      }

      let grades = [];
      try {
        grades = await getGradesByStudent(student.id);
      } catch (error) {
        console.error('Failed to load grades:', error);
        grades = [];
      }

      if (!Array.isArray(grades)) {
        grades = [];
      }

      let averageGPA = 0;
      try {
        const gpaResponse = await getStudentGPA(student.id);
        averageGPA = gpaResponse?.gpa || 0;
      } catch (error) {
        if (grades && grades.length > 0) {
          const sum = grades.reduce((acc, g) => {
            const val = g.value || 0;
            return acc + val / 20;
          }, 0);
          averageGPA = sum / grades.length;
        }
      }

      const subjects = await getSubjects();
      const subjectsMap = new Map(subjects.map(s => [s.id, s.name]));

      const gpaBySubject = {};
      const subjectCounts = {};

      grades.forEach(grade => {
        const subjectId = grade.subject?.id || grade.subjectId;
        const subjectName = subjectsMap.get(subjectId) || 'Неизвестный предмет';

        if (!gpaBySubject[subjectName]) {
          gpaBySubject[subjectName] = 0;
          subjectCounts[subjectName] = 0;
        }
        gpaBySubject[subjectName] += grade.value || 0;
        subjectCounts[subjectName]++;
      });

      const gpaDataArray = Object.keys(gpaBySubject).map((subjectName, index) => {
        const avg = gpaBySubject[subjectName] / subjectCounts[subjectName];
        const avg5 = avg / 20;
        const colors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4'];
        return {
          label: subjectName,
          value: Math.round(avg5 * 10) / 10,
          color: colors[index % colors.length]
        };
      }).sort((a, b) => b.value - a.value);

      setGpaData(gpaDataArray);

      const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

      grades.forEach(grade => {
        const value = grade.value;
        if (value != null) {
          let grade5 = 1;
          if (value >= 90) grade5 = 5;
          else if (value >= 75) grade5 = 4;
          else if (value >= 60) grade5 = 3;
          else if (value >= 40) grade5 = 2;
          else grade5 = 1;
          distribution[grade5]++;
        }
      });

      const gradeDistributionArray = [
        { label: 'Отлично (5)', value: distribution[5], color: '#10b981' },
        { label: 'Хорошо (4)', value: distribution[4], color: '#3b82f6' },
        { label: 'Удовлетворительно (3)', value: distribution[3], color: '#f59e0b' },
        { label: 'Неудовлетворительно (2)', value: distribution[2], color: '#ef4444' },
        { label: 'Плохо (1)', value: distribution[1], color: '#991b1b' }
      ].filter(item => item.value > 0);

      setGradeDistribution(gradeDistributionArray);

      const recentGradesArray = grades
        .sort((a, b) => (b.id || 0) - (a.id || 0))
        .slice(0, 5)
        .map(grade => ({
          id: grade.id,
          subject: subjectsMap.get(grade.subject?.id || grade.subjectId) || 'Неизвестный предмет',
          grade: grade.value,
          date: new Date().toLocaleDateString('ru-RU'),
          type: 'Оценка',
          teacher: 'Преподаватель'
        }));

      setRecentGrades(recentGradesArray);

      const assignments = await getAssignmentsByStudent(currentUser.id);

      const now = new Date();
      const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

      const upcomingAssignments = assignments
        .filter(a => {
          const deadline = new Date(a.deadline);
          return deadline >= now && deadline <= weekFromNow;
        })
        .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
        .slice(0, 5)
        .map(a => {
          const deadline = new Date(a.deadline);
          const daysUntil = Math.ceil((deadline - now) / (1000 * 60 * 60 * 24));

          let priority = 'low';
          if (daysUntil <= 1) priority = 'high';
          else if (daysUntil <= 3) priority = 'medium';

          return {
            id: a.id,
            type: 'Задание',
            subject: subjectsMap.get(a.subject?.id || a.subjectId) || 'Неизвестный предмет',
            dueDate: a.deadline,
            priority: priority,
            description: a.description || a.title
          };
        });

      setUpcoming(upcomingAssignments);

      const completedSubmissions = assignments.filter(a => {
        return new Date(a.deadline) < now;
      }).length;

      setStats({
        averageGPA: Math.round(averageGPA * 10) / 10,
        completedAssignments: completedSubmissions,
        totalAssignments: assignments.length || 0,
        upcomingAssignments: upcomingAssignments.length || 0
      });

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
      case 'high': return '#f87171';
      case 'medium': return '#fbbf24';
      case 'low': return '#34d399';
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
                🔄 Обновить
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
                  value={stats.averageGPA || 0}
                  subtitle="из 5.0"
                  icon="📊"
                  color="purple"
                />
                <Card
                  title="Завершено заданий"
                  value={stats.completedAssignments || 0}
                  subtitle={`из ${stats.totalAssignments || 0}`}
                  icon="✅"
                  color="green"
                />
                <Card
                  title="Ожидает сдачи"
                  value={stats.upcomingAssignments || 0}
                  subtitle="ближайшие 7 дней"
                  icon="⏳"
                  color="yellow"
                />
                <Card
                  title="Всего заданий"
                  value={stats.totalAssignments || 0}
                  subtitle="в системе"
                  icon="📅"
                  color="blue"
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

              {/* Последние оценки и события */}
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
                                {item.type === 'Задание' && '📋'}
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
    backgroundColor: '#0a1628',
    fontFamily: "'Inter', -apple-system, sans-serif",
  },
  appBody: {
    display: 'flex',
    flex: 1,
  },
  mainContent: {
    flex: 1,
    padding: '2rem',
    overflowY: 'auto',
    background: 'linear-gradient(160deg, #0a1628 0%, #0f1e3a 100%)',
  },
  pageHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '2rem',
    background: 'rgba(255,255,255,0.04)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    padding: '1.5rem 2rem',
    borderRadius: '16px',
    border: '1px solid rgba(255,255,255,0.08)',
    boxShadow: '0 4px 24px rgba(0,0,0,0.25)',
  },
  pageTitle: {
    fontSize: '2rem',
    fontWeight: '800',
    margin: '0 0 0.375rem 0',
    color: '#60a5fa',
    letterSpacing: '-0.02em',
  },
  pageSubtitle: {
    margin: 0,
    color: 'rgba(255,255,255,0.45)',
    fontSize: '0.9375rem',
    fontWeight: '400',
  },
  pageActions: {
    display: 'flex',
    gap: '0.75rem',
    alignItems: 'center',
  },
  btnPrimary: {
    padding: '0.625rem 1.25rem',
    background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    fontSize: '0.875rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 4px 12px rgba(59,130,246,0.35)',
  },
  btnOutline: {
    padding: '0.625rem 1.25rem',
    background: 'rgba(255,255,255,0.06)',
    color: 'rgba(255,255,255,0.7)',
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: '10px',
    fontSize: '0.875rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  dashboardStats: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '1.25rem',
    marginBottom: '1.75rem',
  },
  dashboardCharts: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr',
    gap: '1.25rem',
    marginBottom: '1.75rem',
  },
  chartContainer: {
    background: 'rgba(255,255,255,0.04)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    borderRadius: '16px',
    padding: '1.5rem',
    border: '1px solid rgba(255,255,255,0.08)',
    boxShadow: '0 4px 24px rgba(0,0,0,0.2)',
  },
  dashboardGrid: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr',
    gap: '1.25rem',
    marginBottom: '1.75rem',
  },
  gridColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
  },
  sectionCard: {
    background: 'rgba(255,255,255,0.04)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    borderRadius: '16px',
    padding: '1.5rem',
    border: '1px solid rgba(255,255,255,0.08)',
    boxShadow: '0 4px 24px rgba(0,0,0,0.2)',
    height: 'fit-content',
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.25rem',
    paddingBottom: '1rem',
    borderBottom: '1px solid rgba(255,255,255,0.08)',
  },
  sectionTitle: {
    fontSize: '1.0625rem',
    fontWeight: '700',
    color: 'rgba(255,255,255,0.9)',
    margin: 0,
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  viewAll: {
    color: '#60a5fa',
    fontSize: '0.8125rem',
    fontWeight: '600',
    cursor: 'pointer',
  },
  tableContainer: {
    overflowX: 'auto',
  },
  upcomingList: {
    minHeight: '180px',
  },
  noEvents: {
    color: 'rgba(255,255,255,0.35)',
    textAlign: 'center',
    padding: '3rem 1rem',
    fontSize: '1rem',
    fontWeight: '500',
  },
  upcomingItems: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.875rem',
  },
  upcomingItem: {
    display: 'flex',
    gap: '1rem',
    padding: '1rem',
    background: 'rgba(255,255,255,0.04)',
    borderRadius: '12px',
    border: '1px solid rgba(255,255,255,0.07)',
    transition: 'all 0.2s ease',
  },
  upcomingIcon: {
    fontSize: '1.5rem',
    flexShrink: 0,
  },
  upcomingContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '0.375rem',
  },
  upcomingTitle: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '0.5rem',
    color: 'rgba(255,255,255,0.85)',
    fontWeight: '600',
    fontSize: '0.9375rem',
  },
  upcomingType: {
    background: 'rgba(99,102,241,0.2)',
    color: '#a5b4fc',
    padding: '0.2rem 0.625rem',
    borderRadius: '20px',
    fontSize: '0.75rem',
    fontWeight: '600',
  },
  upcomingDescription: {
    color: 'rgba(255,255,255,0.45)',
    fontSize: '0.875rem',
  },
  upcomingMeta: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '0.5rem',
    fontSize: '0.75rem',
  },
  dueDate: {
    color: 'rgba(255,255,255,0.4)',
    fontWeight: '500',
  },
  priority: {
    fontWeight: '600',
    fontSize: '0.75rem',
  },
  quickActions: {
    background: 'rgba(255,255,255,0.04)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    borderRadius: '16px',
    padding: '1.5rem',
    border: '1px solid rgba(255,255,255,0.08)',
    boxShadow: '0 4px 24px rgba(0,0,0,0.2)',
  },
  actionButtons: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '0.875rem',
    marginTop: '1rem',
  },
  actionBtn: {
    padding: '0.875rem 1.25rem',
    background: 'rgba(255,255,255,0.05)',
    color: 'rgba(255,255,255,0.7)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '12px',
    fontSize: '0.875rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    textAlign: 'left',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '4rem 2rem',
    gap: '1rem',
  },
  spinner: {
    width: '44px',
    height: '44px',
    border: '3px solid rgba(255,255,255,0.1)',
    borderTop: '3px solid #3b82f6',
    borderRadius: '50%',
    animation: 'dashSpin 0.9s linear infinite',
  },
  loadingText: {
    color: 'rgba(255,255,255,0.45)',
    fontSize: '1rem',
    fontWeight: '500',
    margin: 0,
  },
};

// Inject spinner animation
const _styleTag = document.createElement('style');
_styleTag.textContent = '@keyframes dashSpin { to { transform: rotate(360deg); } }';
if (!document.getElementById('dash-spin-style')) {
  _styleTag.id = 'dash-spin-style';
  document.head.appendChild(_styleTag);
}

export default StudentDashboard;