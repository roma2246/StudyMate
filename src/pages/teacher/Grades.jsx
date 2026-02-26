// src/pages/teacher/Grades.jsx
import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import { getGrades, getStudents, getSubjects, createGrade, updateGrade, deleteGrade } from '../../services/api';

const TeacherGrades = () => {
  const [grades, setGrades] = useState([]);
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingGrade, setEditingGrade] = useState(null);
  const [filters, setFilters] = useState({ subjectId: '', studentId: '' });
  const [formData, setFormData] = useState({ studentId: '', subjectId: '', value: '' });

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [g, s, sub] = await Promise.all([getGrades(), getStudents(), getSubjects()]);
      setGrades(g); setStudents(s); setSubjects(sub);
    } catch { } finally { setLoading(false); }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value === '' ? '' : Number(value) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.studentId) { alert('Выберите студента'); return; }
    if (!formData.subjectId) { alert('Выберите предмет'); return; }
    if (!formData.value || Number(formData.value) < 0 || Number(formData.value) > 100) { alert('Введите оценку от 0 до 100'); return; }
    try {
      const payload = { studentId: Number(formData.studentId), subjectId: Number(formData.subjectId), value: Number(formData.value) };
      editingGrade ? await updateGrade(editingGrade.id, payload) : await createGrade(payload);
      setFormData({ studentId: '', subjectId: '', value: '' }); setEditingGrade(null); setShowModal(false); loadData();
    } catch (e) { alert('Ошибка: ' + (e.message || '')); }
  };

  const handleEdit = (grade) => { setEditingGrade(grade); setFormData({ studentId: grade.student?.id || '', subjectId: grade.subject?.id || '', value: grade.value || '' }); setShowModal(true); };
  const handleDelete = async (id) => {
    if (window.confirm('Удалить оценку?')) try { await deleteGrade(id); loadData(); } catch { alert('Ошибка удаления'); }
  };

  const toGrade5 = (v) => { if (v >= 90) return { g: 5, c: '#10b981' }; if (v >= 75) return { g: 4, c: '#3b82f6' }; if (v >= 60) return { g: 3, c: '#f59e0b' }; if (v >= 40) return { g: 2, c: '#ef4444' }; return { g: 1, c: '#dc2626' }; };

  const filteredGrades = grades.filter(g => {
    if (filters.subjectId && g.subject?.id !== filters.subjectId) return false;
    if (filters.studentId && g.student?.id !== filters.studentId) return false;
    return true;
  });

  return (
    <div style={s.page}>
      <Navbar role="teacher" />
      <div style={s.body}>
        <Sidebar role="teacher" />
        <main style={s.main}>
          <div style={s.header}>
            <div>
              <h1 style={s.title}>📝 Оценки студентов</h1>
              <p style={s.subtitle}>Управление успеваемостью</p>
            </div>
            <button style={s.addBtn} onClick={() => { setEditingGrade(null); setFormData({ studentId: '', subjectId: '', value: '' }); setShowModal(true); }}>
              + Добавить оценку
            </button>
          </div>

          {/* Filters */}
          <div style={s.filters}>
            <div style={{ flex: 1 }}>
              <label style={s.label}>Фильтр по предмету</label>
              <select name="subjectId" value={filters.subjectId} onChange={handleFilterChange} style={s.select}>
                <option value="">Все предметы</option>
                {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <label style={s.label}>Фильтр по студенту</label>
              <select name="studentId" value={filters.studentId} onChange={handleFilterChange} style={s.select}>
                <option value="">Все студенты</option>
                {students.map(stu => <option key={stu.id} value={stu.id}>{stu.user?.name || `Студент #${stu.id}`}</option>)}
              </select>
            </div>
          </div>

          {loading ? (
            <div style={s.loading}>⏳ Загрузка...</div>
          ) : filteredGrades.length === 0 ? (
            <div style={s.empty}>Оценки не найдены. Добавьте первую оценку.</div>
          ) : (
            <div style={s.tableCard}>
              <div style={s.tableHead}>
                <div style={{ flex: 2, ...s.th }}>Студент</div>
                <div style={{ flex: 2, ...s.th }}>Предмет</div>
                <div style={{ flex: 1, ...s.th, textAlign: 'center' }}>0–100</div>
                <div style={{ flex: 1, ...s.th, textAlign: 'center' }}>5-балл</div>
                <div style={{ flex: 2, ...s.th, textAlign: 'right' }}>Действия</div>
              </div>
              {filteredGrades.map(grade => {
                const info = toGrade5(grade.value);
                const studentName = students.find(s => s.id === (grade.student?.id))?.user?.name || '—';
                const subjectName = subjects.find(s => s.id === (grade.subject?.id))?.name || '—';
                return (
                  <div key={grade.id} style={s.tableRow}>
                    <div style={{ flex: 2, ...s.td }}>{studentName}</div>
                    <div style={{ flex: 2, ...s.td }}>{subjectName}</div>
                    <div style={{ flex: 1, textAlign: 'center' }}>
                      <span style={{ ...s.badge, color: info.c, background: `${info.c}18`, borderColor: `${info.c}40` }}>{grade.value}</span>
                    </div>
                    <div style={{ flex: 1, textAlign: 'center' }}>
                      <span style={{ ...s.badge, color: info.c, background: `${info.c}18`, borderColor: `${info.c}40` }}>{info.g}</span>
                    </div>
                    <div style={{ flex: 2, display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                      <button style={s.editBtn} onClick={() => handleEdit(grade)}>Редакт.</button>
                      <button style={s.delBtn} onClick={() => handleDelete(grade.id)}>Удалить</button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>

      {showModal && (
        <div style={s.overlay} onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div style={s.modal}>
            <div style={s.mHead}>
              <h3 style={s.mTitle}>{editingGrade ? '✏️ Редактировать оценку' : '+ Добавить оценку'}</h3>
              <button onClick={() => setShowModal(false)} style={s.mClose}>✕</button>
            </div>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={s.label}>Студент</label>
                <select value={formData.studentId} onChange={e => setFormData(p => ({ ...p, studentId: e.target.value }))} style={s.select} required>
                  <option value="">Выберите студента</option>
                  {students.map(stu => <option key={stu.id} value={stu.id}>{stu.user?.name || `Студент #${stu.id}`}</option>)}
                </select>
              </div>
              <div>
                <label style={s.label}>Предмет</label>
                <select value={formData.subjectId} onChange={e => setFormData(p => ({ ...p, subjectId: e.target.value }))} style={s.select} required>
                  <option value="">Выберите предмет</option>
                  {subjects.map(sub => <option key={sub.id} value={sub.id}>{sub.name}</option>)}
                </select>
              </div>
              <div>
                <label style={s.label}>Оценка (0–100 баллов)</label>
                <input type="number" min="0" max="100" step="1" value={formData.value}
                  onChange={e => setFormData(p => ({ ...p, value: e.target.value }))}
                  placeholder="Введите число от 0 до 100" style={s.input} required />
                <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem', margin: '0.375rem 0 0 0' }}>
                  90–100 = 5 · 75–89 = 4 · 60–74 = 3 · 40–59 = 2 · 0–39 = 1
                </p>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setShowModal(false)} style={s.cancelBtn}>Отмена</button>
                <button type="submit" style={s.submitBtn}>{editingGrade ? 'Сохранить' : 'Добавить'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
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
  addBtn: { padding: '0.625rem 1.25rem', background: 'linear-gradient(135deg,#8b5cf6,#5b21b6)', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '0.875rem', fontWeight: '700', cursor: 'pointer', alignSelf: 'center', boxShadow: '0 4px 12px rgba(139,92,246,0.4)' },
  filters: { display: 'flex', gap: '1rem', marginBottom: '1.25rem', flexWrap: 'wrap' },
  loading: { color: 'rgba(255,255,255,0.5)', textAlign: 'center', padding: '3rem' },
  empty: { textAlign: 'center', padding: '4rem', color: 'rgba(255,255,255,0.3)', fontSize: '1.125rem', background: 'rgba(255,255,255,0.03)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.06)' },
  tableCard: { background: 'rgba(15, 23, 42, 0.45)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '16px', overflow: 'hidden' },
  tableHead: { display: 'flex', alignItems: 'center', padding: '0.75rem 1.5rem', background: 'rgba(15, 23, 42, 0.45)', borderBottom: '1px solid rgba(255,255,255,0.07)' },
  th: { fontSize: '0.7375rem', fontWeight: '700', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.06em' },
  tableRow: { display: 'flex', alignItems: 'center', padding: '0.875rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', gap: '1rem' },
  td: { fontSize: '0.875rem', color: 'rgba(255,255,255,0.8)', fontWeight: '600' },
  badge: { padding: '0.25rem 0.625rem', borderRadius: '100px', fontSize: '0.8125rem', fontWeight: '800', border: '1px solid' },
  editBtn: { padding: '0.375rem 0.75rem', background: 'rgba(59,130,246,0.15)', color: '#60a5fa', border: '1px solid rgba(59,130,246,0.3)', borderRadius: '8px', fontSize: '0.75rem', fontWeight: '600', cursor: 'pointer' },
  delBtn: { padding: '0.375rem 0.75rem', background: 'rgba(239,68,68,0.12)', color: '#fca5a5', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '8px', fontSize: '0.75rem', fontWeight: '600', cursor: 'pointer' },
  overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' },
  modal: { background: '#0f1e3a', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '20px', padding: '2rem', width: '100%', maxWidth: '480px' },
  mHead: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' },
  mTitle: { fontSize: '1.125rem', fontWeight: '800', color: '#fff', margin: 0 },
  mClose: { background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.6)', width: '32px', height: '32px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.875rem' },
  label: { display: 'block', fontSize: '0.8125rem', fontWeight: '600', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' },
  input: { width: '100%', padding: '0.75rem 1rem', background: 'rgba(15, 23, 42, 0.45)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', fontSize: '0.9375rem', color: '#fff', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' },
  select: { width: '100%', padding: '0.75rem 1rem', background: 'rgba(15, 23, 42, 0.45)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', fontSize: '0.9375rem', color: '#fff', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box', cursor: 'pointer' },
  cancelBtn: { padding: '0.625rem 1.25rem', background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '10px', fontSize: '0.875rem', fontWeight: '600', cursor: 'pointer' },
  submitBtn: { padding: '0.625rem 1.25rem', background: 'linear-gradient(135deg,#8b5cf6,#5b21b6)', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '0.875rem', fontWeight: '700', cursor: 'pointer' },
};

export default TeacherGrades;