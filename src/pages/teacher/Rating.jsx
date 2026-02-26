import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import Chart from '../../components/Chart';
import { getStudents, getStudentGPA } from '../../services/api';

const TeacherRating = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [gpaData, setGpaData] = useState([]);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const studentsData = await getStudents();
      if (!Array.isArray(studentsData)) { setStudents([]); setGpaData([]); return; }

      const withGPA = await Promise.all(studentsData.map(async s => {
        try {
          const r = await getStudentGPA(s.id);
          return { id: s.id, name: s.user?.name || `Студент #${s.id}`, gpa: r?.gpa || 0 };
        } catch { return { id: s.id, name: s.user?.name || `Студент #${s.id}`, gpa: 0 }; }
      }));

      const sorted = withGPA.sort((a, b) => b.gpa - a.gpa);
      setStudents(sorted);
      setGpaData(sorted.slice(0, 7).map((s, i) => ({
        label: s.name.split(' ')[0],
        value: s.gpa,
        color: ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#06b6d4', '#ec4899'][i % 7]
      })));
    } catch { setStudents([]); setGpaData([]); } finally { setLoading(false); }
  };

  const gpaInfo = (gpa) => {
    if (gpa >= 90) return { label: 'Отлично', color: '#10b981' };
    if (gpa >= 75) return { label: 'Хорошо', color: '#3b82f6' };
    if (gpa >= 60) return { label: 'Удовл.', color: '#f59e0b' };
    return { label: 'Плохо', color: '#ef4444' };
  };

  return (
    <div style={s.page}>
      <Navbar role="teacher" />
      <div style={s.body}>
        <Sidebar role="teacher" />
        <main style={s.main}>
          <div style={s.header}>
            <div>
              <h1 style={s.title}>🏆 Рейтинг студентов</h1>
              <p style={s.subtitle}>Топ студентов по среднему баллу</p>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button style={s.exportBtn} onClick={() => alert('Экспорт в Excel не реализован')}>📊 Excel</button>
              <button style={s.exportBtn} onClick={() => alert('Экспорт в PDF не реализован')}>📄 PDF</button>
            </div>
          </div>

          {loading ? (
            <div style={s.loading}>⏳ Загрузка рейтинга...</div>
          ) : (
            <>
              {/* Chart */}
              {gpaData.length > 0 && (
                <div style={s.chartCard}>
                  <h2 style={s.chartTitle}>📈 Топ-7 студентов по GPA</h2>
                  <Chart type="bar" data={gpaData} />
                </div>
              )}

              {/* Rating table */}
              <div style={s.tableCard}>
                <div style={s.tableHead}>
                  <div style={{ width: '60px', ...s.thCell }}>Место</div>
                  <div style={{ flex: 1, ...s.thCell }}>Студент</div>
                  <div style={{ width: '140px', ...s.thCell }}>GPA</div>
                  <div style={{ width: '120px', ...s.thCell }}>Уровень</div>
                </div>
                {students.map((student, i) => {
                  const info = gpaInfo(student.gpa);
                  return (
                    <div key={student.id} style={{ ...s.tableRow, background: i < 3 ? 'rgba(139,92,246,0.05)' : 'transparent' }}>
                      <div style={{ width: '60px', fontSize: '1.25rem', display: 'flex', alignItems: 'center' }}>
                        {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : <span style={s.rankNum}>#{i + 1}</span>}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={s.studentName}>{student.name}</div>
                      </div>
                      <div style={{ width: '140px' }}>
                        <div style={{ ...s.gpaBar }}>
                          <div style={{ ...s.gpaFill, width: `${Math.min(student.gpa, 100)}%`, background: info.color }} />
                        </div>
                        <div style={{ ...s.gpaValue, color: info.color }}>{student.gpa.toFixed(1)}</div>
                      </div>
                      <div style={{ width: '120px' }}>
                        <span style={{ ...s.level, color: info.color, background: `${info.color}15`, borderColor: `${info.color}30` }}>
                          {info.label}
                        </span>
                      </div>
                    </div>
                  );
                })}
                {students.length === 0 && <div style={s.empty}>Нет данных о студентах</div>}
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

const s = {
  page: { minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'transparent', fontFamily: "'Inter',-apple-system,sans-serif" },
  body: { display: 'flex', flex: 1 },
  main: { flex: 1, padding: '2rem', overflowY: 'auto', background: 'transparent' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', background: 'rgba(15, 23, 42, 0.45)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '16px', padding: '1.5rem 2rem', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' },
  title: { fontSize: '1.75rem', fontWeight: '800', color: '#a78bfa', margin: '0 0 0.25rem 0', letterSpacing: '-0.02em' },
  subtitle: { color: 'rgba(255,255,255,0.45)', fontSize: '0.9rem', margin: 0 },
  exportBtn: { padding: '0.5rem 1rem', background: 'rgba(15, 23, 42, 0.45)', color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '9px', fontSize: '0.8125rem', fontWeight: '600', cursor: 'pointer' },
  loading: { color: 'rgba(255,255,255,0.5)', textAlign: 'center', padding: '3rem' },
  chartCard: { background: 'rgba(15, 23, 42, 0.45)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '16px', padding: '1.5rem', marginBottom: '1.25rem' },
  chartTitle: { fontSize: '1rem', fontWeight: '700', color: 'rgba(255,255,255,0.85)', margin: '0 0 1rem 0' },
  tableCard: { background: 'rgba(15, 23, 42, 0.45)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '16px', overflow: 'hidden' },
  tableHead: { display: 'flex', alignItems: 'center', padding: '0.75rem 1.5rem', background: 'rgba(15, 23, 42, 0.45)', borderBottom: '1px solid rgba(255,255,255,0.12)' },
  thCell: { fontSize: '0.7375rem', fontWeight: '700', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.06em' },
  tableRow: { display: 'flex', alignItems: 'center', padding: '0.875rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', gap: '1rem' },
  rankNum: { fontSize: '0.875rem', fontWeight: '700', color: 'rgba(255,255,255,0.4)' },
  studentName: { fontSize: '0.9rem', fontWeight: '700', color: '#fff' },
  gpaBar: { height: '4px', background: 'rgba(255,255,255,0.07)', borderRadius: '100px', overflow: 'hidden', marginBottom: '0.25rem' },
  gpaFill: { height: '100%', borderRadius: '100px', transition: 'width 0.4s ease' },
  gpaValue: { fontSize: '0.875rem', fontWeight: '800' },
  level: { padding: '0.25rem 0.625rem', borderRadius: '100px', fontSize: '0.75rem', fontWeight: '700', border: '1px solid' },
  empty: { color: 'rgba(255,255,255,0.3)', textAlign: 'center', padding: '3rem' },
};

export default TeacherRating;