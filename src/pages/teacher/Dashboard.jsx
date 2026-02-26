// src/pages/teacher/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import Card from '../../components/Card';
import Chart from '../../components/Chart';
import { getUserName, isAuthenticated } from '../../services/auth';
import { getStudents, getSubjects, getGrades, getStudentGPA } from '../../services/api';

const TeacherDashboard = () => {
  const [stats, setStats] = useState({ students: 0, subjects: 0, grades: 0, averageGpa: 0 });
  const [topStudents, setTopStudents] = useState([]);
  const [gpaDistribution, setGpaDistribution] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const teacherName = getUserName();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated()) { navigate('/login'); return; }
    loadData();
  }, [navigate]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [students, subjects, grades] = await Promise.all([getStudents(), getSubjects(), getGrades()]);

      const gradeVals = grades.filter(g => g.value);
      const averageGpa = gradeVals.length > 0 ? gradeVals.reduce((s, g) => s + g.value, 0) / gradeVals.length : 0;
      setStats({ students: students.length, subjects: subjects.length, grades: grades.length, averageGpa: Math.round(averageGpa * 10) / 10 });

      const studentsWithGPA = await Promise.all(students.map(async student => {
        try {
          const gpa = await getStudentGPA(student.id);
          return { id: student.id, name: student.user?.name || `Студент #${student.id}`, gpa: Math.round(gpa * 10) / 10, group: student.group || '—' };
        } catch {
          const sg = grades.filter(g => g.student?.id === student.id || g.studentId === student.id);
          const gpa = sg.length > 0 ? sg.reduce((a, g) => a + (g.value || 0), 0) / sg.length : 0;
          return { id: student.id, name: student.user?.name || `Студент #${student.id}`, gpa: Math.round(gpa * 10) / 10, group: student.group || '—' };
        }
      }));
      setTopStudents(studentsWithGPA.filter(s => s.gpa > 0).sort((a, b) => b.gpa - a.gpa).slice(0, 5));

      const subjectsMap = new Map(subjects.map(s => [s.id, s.name]));
      const gpaMap = {}, cntMap = {};
      grades.forEach(g => {
        const name = subjectsMap.get(g.subject?.id || g.subjectId) || 'Прочее';
        if (!gpaMap[name]) { gpaMap[name] = 0; cntMap[name] = 0; }
        if (g.value) { gpaMap[name] += g.value; cntMap[name]++; }
      });
      const colors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4', '#ec4899'];
      setGpaDistribution(Object.keys(gpaMap).map((name, i) => ({ label: name, value: Math.round(gpaMap[name] / cntMap[name] * 10) / 10, color: colors[i % colors.length] })).sort((a, b) => b.value - a.value));

      const studentsMap = new Map(students.map(s => [s.id, s.user?.name || `Студент #${s.id}`]));
      setRecentActivity(grades.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)).slice(0, 5).map(g => ({
        id: g.id,
        student: studentsMap.get(g.student?.id || g.studentId) || 'Студент',
        subject: subjectsMap.get(g.subject?.id || g.subjectId) || '—',
        grade: g.value || '—',
        date: g.createdAt ? new Date(g.createdAt).toLocaleString('ru-RU') : '—'
      })));
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  return (
    <div style={s.page}>
      <Navbar role="teacher" />
      <div style={s.body}>
        <Sidebar role="teacher" />
        <main style={s.main}>
          {/* Header */}
          <div style={s.header}>
            <div>
              <h1 style={s.title}>👨‍🏫 Панель преподавателя</h1>
              <p style={s.subtitle}>Добро пожаловать, {teacherName || 'Преподаватель'}! Обзор системы управления обучением.</p>
            </div>
            <div style={s.headerActions}>
              <button style={s.btnOutline} onClick={loadData} disabled={loading}>🔄 Обновить</button>
              <button style={s.btnPrimary}>📊 Полный отчёт</button>
            </div>
          </div>

          {loading ? (
            <div style={s.loading}>⏳ Загрузка данных...</div>
          ) : (
            <>
              {/* Stats */}
              <div style={s.statsGrid}>
                <Card title="Студенты" value={stats.students} subtitle="в системе" icon="👥" color="blue" />
                <Card title="Предметы" value={stats.subjects} subtitle="активных" icon="📚" color="green" />
                <Card title="Оценки" value={stats.grades} subtitle="выставлено" icon="📝" color="purple" />
                <Card title="Средний GPA" value={stats.averageGpa} subtitle="по всем предметам" icon="📊" color="yellow" />
              </div>

              <div style={s.grid}>
                {/* Left */}
                <div style={s.col}>
                  <div style={s.card}>
                    <div style={s.cardHeader}>
                      <h2 style={s.cardTitle}>📈 Успеваемость по предметам</h2>
                    </div>
                    <Chart type="bar" data={gpaDistribution} />
                  </div>

                  <div style={s.card}>
                    <div style={s.cardHeader}>
                      <h2 style={s.cardTitle}>📋 Последние оценки</h2>
                    </div>
                    {recentActivity.length === 0 ? (
                      <div style={s.empty}>Нет данных</div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {recentActivity.map(a => (
                          <div key={a.id} style={s.actItem}>
                            <span style={s.actIcon}>📝</span>
                            <div style={{ flex: 1 }}>
                              <div style={s.actName}>{a.student}</div>
                              <div style={s.actMeta}>{a.subject} · {a.date}</div>
                            </div>
                            <div style={s.actGrade}>{a.grade}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Right */}
                <div style={s.col}>
                  <div style={s.card}>
                    <div style={s.cardHeader}>
                      <h2 style={s.cardTitle}>🏆 Топ студентов</h2>
                    </div>
                    {topStudents.length === 0 ? (
                      <div style={s.empty}>Нет данных</div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                        {topStudents.map((student, i) => (
                          <div key={student.id} style={s.rankRow}>
                            <div style={s.rank}>{i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`}</div>
                            <div style={{ flex: 1 }}>
                              <div style={s.rankName}>{student.name}</div>
                              <div style={s.rankGroup}>{student.group}</div>
                            </div>
                            <div style={s.rankGpa}><strong>{student.gpa}</strong><span style={s.rankGpaLabel}>GPA</span></div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div style={s.card}>
                    <div style={s.cardHeader}>
                      <h2 style={s.cardTitle}>⚡ Быстрые действия</h2>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                      {[
                        { icon: '📝', label: 'Добавить оценку', path: '/teacher/grades' },
                        { icon: '👥', label: 'Управление студентами', path: '/teacher/students' },
                        { icon: '📚', label: 'Редактировать предметы', path: '/teacher/subjects' },
                        { icon: '📊', label: 'Посмотреть рейтинг', path: '/teacher/rating' },
                      ].map(a => (
                        <button key={a.path} style={s.qBtn} onClick={() => navigate(a.path)}>
                          <span style={{ fontSize: '1.125rem' }}>{a.icon}</span>
                          <span>{a.label}</span>
                        </button>
                      ))}
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

const s = {
  page: { minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#0a1628', fontFamily: "'Inter',-apple-system,sans-serif" },
  body: { display: 'flex', flex: 1 },
  main: { flex: 1, padding: '2rem', overflowY: 'auto', background: 'linear-gradient(160deg,#0a1628 0%,#0f1e3a 100%)' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '1.5rem 2rem', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' },
  title: { fontSize: '1.75rem', fontWeight: '800', color: '#a78bfa', margin: '0 0 0.25rem 0', letterSpacing: '-0.02em' },
  subtitle: { color: 'rgba(255,255,255,0.45)', fontSize: '0.9rem', margin: 0 },
  headerActions: { display: 'flex', gap: '0.75rem', alignItems: 'center', flexShrink: 0 },
  btnPrimary: { padding: '0.5rem 1.125rem', background: 'linear-gradient(135deg,#8b5cf6,#5b21b6)', color: '#fff', border: 'none', borderRadius: '9px', fontSize: '0.875rem', fontWeight: '700', cursor: 'pointer', boxShadow: '0 4px 12px rgba(139,92,246,0.4)' },
  btnOutline: { padding: '0.5rem 1.125rem', background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '9px', fontSize: '0.875rem', fontWeight: '600', cursor: 'pointer' },
  loading: { color: 'rgba(255,255,255,0.5)', textAlign: 'center', padding: '3rem', fontSize: '1rem' },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' },
  grid: { display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.25rem' },
  col: { display: 'flex', flexDirection: 'column', gap: '1.25rem' },
  card: { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '1.5rem' },
  cardHeader: { marginBottom: '1.25rem', paddingBottom: '0.875rem', borderBottom: '1px solid rgba(255,255,255,0.07)' },
  cardTitle: { fontSize: '1rem', fontWeight: '700', color: 'rgba(255,255,255,0.9)', margin: 0 },
  empty: { color: 'rgba(255,255,255,0.25)', textAlign: 'center', padding: '1.5rem', fontSize: '0.9rem' },
  actItem: { display: 'flex', alignItems: 'center', gap: '0.875rem', padding: '0.75rem', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)' },
  actIcon: { fontSize: '1.125rem', flexShrink: 0 },
  actName: { fontSize: '0.875rem', fontWeight: '700', color: '#fff', marginBottom: '0.125rem' },
  actMeta: { fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', fontWeight: '500' },
  actGrade: { fontSize: '1.125rem', fontWeight: '800', color: '#60a5fa', flexShrink: 0 },
  rankRow: { display: 'flex', alignItems: 'center', gap: '0.875rem', padding: '0.75rem', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)' },
  rank: { fontSize: '1.125rem', fontWeight: '700', color: 'rgba(255,255,255,0.6)', minWidth: '2rem' },
  rankName: { fontSize: '0.875rem', fontWeight: '700', color: '#fff', marginBottom: '0.125rem' },
  rankGroup: { fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', fontWeight: '500' },
  rankGpa: { display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'rgba(245,158,11,0.2)', border: '1px solid rgba(245,158,11,0.3)', color: '#fbbf24', padding: '0.375rem 0.625rem', borderRadius: '8px', minWidth: '48px' },
  rankGpaLabel: { fontSize: '0.6rem', opacity: 0.7 },
  qBtn: { display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.875rem 1rem', background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.75)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', fontSize: '0.875rem', fontWeight: '600', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s ease' },
};

export default TeacherDashboard;