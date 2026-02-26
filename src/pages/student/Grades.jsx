// src/pages/student/Grades.jsx
import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import { getGradesByStudent, getStudentGPA, getStudentByUserId, getSubjects } from '../../services/api';
import { getCurrentUser } from '../../services/auth';

const StudentGrades = () => {
  const [grades, setGrades] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [gpa, setGpa] = useState(null);
  const [studentId, setStudentId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadStudentId(); }, []);
  useEffect(() => { if (studentId) loadData(); }, [studentId]);

  const loadStudentId = async () => {
    try {
      const user = getCurrentUser();
      if (user?.id) {
        const student = await getStudentByUserId(user.id);
        if (student?.id) setStudentId(student.id);
      }
    } catch (e) { console.error(e); }
  };

  const loadData = async () => {
    try {
      setLoading(true);
      const [gradesData, gpaData, subjectsData] = await Promise.all([
        getGradesByStudent(studentId),
        getStudentGPA(studentId),
        getSubjects()
      ]);
      setGrades(gradesData);
      setGpa(gpaData);
      setSubjects(subjectsData);
    } catch (e) {
      setGrades([]); setGpa(null);
    } finally { setLoading(false); }
  };

  const getSubjectName = (subjectId) => {
    const s = subjects.find(s => s.id === subjectId);
    return s?.name || 'Неизвестно';
  };

  const gradeInfo = (value) => {
    if (value >= 90) return { grade: 5, color: '#10b981', label: 'Отлично' };
    if (value >= 75) return { grade: 4, color: '#3b82f6', label: 'Хорошо' };
    if (value >= 60) return { grade: 3, color: '#f59e0b', label: 'Удовл.' };
    if (value >= 40) return { grade: 2, color: '#ef4444', label: 'Неудовл.' };
    return { grade: 1, color: '#dc2626', label: 'Плохо' };
  };

  const groupedBySubject = grades.reduce((acc, grade) => {
    const id = grade.subject?.id;
    if (!id) return acc;
    if (!acc[id]) acc[id] = { subjectId: id, subjectName: getSubjectName(id), grades: [] };
    acc[id].grades.push(grade);
    return acc;
  }, {});

  const subjectStats = Object.values(groupedBySubject).map(sg => {
    const avg = sg.grades.reduce((s, g) => s + g.value, 0) / sg.grades.length;
    return { ...sg, average: Math.round(avg * 100) / 100, info: gradeInfo(avg) };
  });

  return (
    <div style={s.page}>
      <Navbar role="student" />
      <div style={s.body}>
        <Sidebar role="student" />
        <main style={s.main}>
          {/* Header */}
          <div style={s.header}>
            <div>
              <h1 style={s.title}>📊 Мои оценки</h1>
              <p style={s.subtitle}>Успеваемость по всем предметам</p>
            </div>
          </div>

          {loading ? (
            <div style={s.loading}>⏳ Загрузка оценок...</div>
          ) : (
            <>
              {/* GPA Banner */}
              {gpa && (
                <div style={s.gpaBanner}>
                  <div style={s.gpaLeft}>
                    <div style={s.gpaLabel}>Средний балл (GPA)</div>
                    <div style={s.gpaNum}>{Number(gpa.gpa).toFixed(2)}</div>
                    <div style={s.gpaSub}>Всего оценок: {gpa.totalGrades}</div>
                  </div>
                  <div style={s.gpaScale}>
                    {[
                      { range: '90–100', label: 'Отлично (5)', color: '#10b981' },
                      { range: '75–89', label: 'Хорошо (4)', color: '#3b82f6' },
                      { range: '60–74', label: 'Удовл. (3)', color: '#f59e0b' },
                      { range: '0–59', label: 'Плохо (1-2)', color: '#ef4444' },
                    ].map(r => (
                      <div key={r.range} style={s.gpaScaleItem}>
                        <span style={{ ...s.gpaScaleDot, background: r.color }} />
                        <span style={s.gpaScaleRange}>{r.range}</span>
                        <span style={s.gpaScaleLabel}>{r.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {subjectStats.length === 0 ? (
                <div style={s.empty}>📚 У вас пока нет оценок</div>
              ) : (
                <div style={{ display: 'grid', gap: '1.25rem' }}>
                  {subjectStats.map(subject => (
                    <div key={subject.subjectId} style={s.subjectCard}>
                      {/* Subject header */}
                      <div style={s.subjectHeader}>
                        <div>
                          <h3 style={s.subjectName}>{subject.subjectName}</h3>
                          <span style={s.subjectCount}>{subject.grades.length} оценок</span>
                        </div>
                        <div style={s.subjectAvg}>
                          <div style={s.avgLabel}>Средний балл</div>
                          <div style={{ ...s.avgNum, color: subject.info.color }}>{subject.average.toFixed(2)}</div>
                          <div style={{ ...s.avgGrade, color: subject.info.color }}>
                            ({subject.info.grade}) {subject.info.label}
                          </div>
                        </div>
                      </div>
                      {/* Grade list */}
                      <div style={s.gradeList}>
                        {subject.grades.map((grade, idx) => {
                          const info = gradeInfo(grade.value);
                          return (
                            <div key={grade.id || idx} style={{ ...s.gradeRow, borderLeft: `3px solid ${info.color}` }}>
                              <div>
                                <div style={s.gradeRowTitle}>Оценка #{idx + 1}</div>
                                <div style={s.gradeRowSub}>Балл: {grade.value}</div>
                              </div>
                              <div style={{ ...s.gradeBadge, color: info.color, borderColor: `${info.color}50`, background: `${info.color}15` }}>
                                {info.grade}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
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
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(12px)', padding: '1.5rem 2rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.08)' },
  title: { fontSize: '1.75rem', fontWeight: '800', color: '#60a5fa', margin: '0 0 0.25rem 0', letterSpacing: '-0.02em' },
  subtitle: { color: 'rgba(255,255,255,0.45)', fontSize: '0.9rem', margin: 0 },
  loading: { color: 'rgba(255,255,255,0.5)', textAlign: 'center', padding: '3rem', fontSize: '1rem' },
  // GPA Banner
  gpaBanner: { display: 'flex', gap: '2rem', alignItems: 'center', justifyContent: 'space-between', background: 'linear-gradient(135deg,rgba(59,130,246,0.2),rgba(29,78,216,0.15))', border: '1px solid rgba(59,130,246,0.3)', borderRadius: '16px', padding: '1.75rem 2rem', marginBottom: '1.5rem', flexWrap: 'wrap' },
  gpaLeft: { display: 'flex', flexDirection: 'column', gap: '0.25rem' },
  gpaLabel: { fontSize: '0.8125rem', fontWeight: '700', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.08em' },
  gpaNum: { fontSize: '4rem', fontWeight: '900', color: '#60a5fa', lineHeight: 1, letterSpacing: '-0.03em' },
  gpaSub: { fontSize: '0.875rem', color: 'rgba(255,255,255,0.4)', fontWeight: '500' },
  gpaScale: { display: 'flex', flexDirection: 'column', gap: '0.5rem' },
  gpaScaleItem: { display: 'flex', alignItems: 'center', gap: '0.5rem' },
  gpaScaleDot: { width: '8px', height: '8px', borderRadius: '50%', flexShrink: 0 },
  gpaScaleRange: { fontSize: '0.8125rem', color: 'rgba(255,255,255,0.6)', fontWeight: '700', width: '55px' },
  gpaScaleLabel: { fontSize: '0.8125rem', color: 'rgba(255,255,255,0.4)' },
  // Subject card
  subjectCard: { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', overflow: 'hidden' },
  subjectHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem 1.5rem', background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.06)' },
  subjectName: { fontSize: '1.125rem', fontWeight: '700', color: '#fff', margin: '0 0 0.25rem 0' },
  subjectCount: { fontSize: '0.8rem', color: 'rgba(255,255,255,0.35)', fontWeight: '500' },
  subjectAvg: { textAlign: 'right' },
  avgLabel: { fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' },
  avgNum: { fontSize: '2rem', fontWeight: '800', lineHeight: 1 },
  avgGrade: { fontSize: '0.8125rem', fontWeight: '600', marginTop: '0.25rem' },
  gradeList: { padding: '1rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' },
  gradeRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.875rem 1rem', background: 'rgba(255,255,255,0.025)', borderRadius: '10px', paddingLeft: '1rem' },
  gradeRowTitle: { fontSize: '0.875rem', fontWeight: '700', color: 'rgba(255,255,255,0.8)', marginBottom: '0.2rem' },
  gradeRowSub: { fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', fontWeight: '500' },
  gradeBadge: { fontSize: '1.25rem', fontWeight: '800', width: '44px', height: '44px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid', flexShrink: 0 },
  empty: { textAlign: 'center', padding: '4rem', color: 'rgba(255,255,255,0.3)', fontSize: '1.125rem', background: 'rgba(255,255,255,0.03)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.06)' },
};

export default StudentGrades;