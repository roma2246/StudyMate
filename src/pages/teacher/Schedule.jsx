// src/pages/teacher/Schedule.jsx
import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import { getStudents, getSubjects, createSchedule, updateSchedule, deleteSchedule, getScheduleByStudent } from '../../services/api';

const DAY_COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#06b6d4', '#ec4899'];
const DAYS = [
  { value: 1, label: 'Понедельник', short: 'ПН' },
  { value: 2, label: 'Вторник', short: 'ВТ' },
  { value: 3, label: 'Среда', short: 'СР' },
  { value: 4, label: 'Четверг', short: 'ЧТ' },
  { value: 5, label: 'Пятница', short: 'ПТ' },
  { value: 6, label: 'Суббота', short: 'СБ' },
  { value: 7, label: 'Воскресенье', short: 'ВС' },
];

const TeacherSchedule = () => {
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [formData, setFormData] = useState({ studentId: '', subjectId: '', dayOfWeek: 1, startTime: '09:00', endTime: '10:30' });

  useEffect(() => { loadBase(); }, []);
  useEffect(() => { if (selectedStudent) loadSchedule(selectedStudent); }, [selectedStudent]);

  const loadBase = async () => {
    try {
      setLoading(true);
      const [s, sub] = await Promise.all([getStudents(), getSubjects()]);
      setStudents(s); setSubjects(sub);
    } catch { } finally { setLoading(false); }
  };

  const loadSchedule = async (id) => {
    try { const d = await getScheduleByStudent(id); setSchedules(d); } catch { setSchedules([]); }
  };

  const handleInput = (e) => {
    const { name, value } = e.target;
    setFormData(p => ({ ...p, [name]: ['studentId', 'subjectId', 'dayOfWeek'].includes(name) ? Number(value) : value }));
  };

  const handleStudentSelect = (e) => {
    const id = Number(e.target.value);
    setSelectedStudent(id || null);
    if (id) setFormData(p => ({ ...p, studentId: id }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      editingSchedule ? await updateSchedule(editingSchedule.id, formData) : await createSchedule(formData);
      setFormData({ studentId: selectedStudent || '', subjectId: '', dayOfWeek: 1, startTime: '09:00', endTime: '10:30' });
      setEditingSchedule(null); setShowModal(false);
      if (selectedStudent) loadSchedule(selectedStudent);
    } catch (e) { alert('Ошибка: ' + (e.message || '')); }
  };

  const handleEdit = (item) => {
    setEditingSchedule(item);
    setFormData({ studentId: item.student?.id || selectedStudent || '', subjectId: item.subject?.id || '', dayOfWeek: item.dayOfWeek || 1, startTime: item.startTime || '09:00', endTime: item.endTime || '10:30' });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Удалить занятие?')) try { await deleteSchedule(id); if (selectedStudent) loadSchedule(selectedStudent); } catch { }
  };

  const openCreate = () => {
    if (!selectedStudent) { alert('Сначала выберите студента'); return; }
    setEditingSchedule(null);
    setFormData({ studentId: selectedStudent, subjectId: '', dayOfWeek: 1, startTime: '09:00', endTime: '10:30' });
    setShowModal(true);
  };

  const grouped = schedules.reduce((acc, item) => {
    const d = item.dayOfWeek || 1;
    if (!acc[d]) acc[d] = [];
    acc[d].push(item);
    return acc;
  }, {});

  return (
    <div style={s.page}>
      <Navbar role="teacher" />
      <div style={s.body}>
        <Sidebar role="teacher" />
        <main style={s.main}>
          <div style={s.header}>
            <div>
              <h1 style={s.title}>📅 Расписание</h1>
              <p style={s.subtitle}>Управление расписанием студентов</p>
            </div>
            <button style={s.addBtn} onClick={openCreate}>+ Добавить занятие</button>
          </div>

          {/* Student selector */}
          <div style={s.selectorCard}>
            <label style={s.label}>Студент</label>
            <select value={selectedStudent || ''} onChange={handleStudentSelect} style={s.select}>
              <option value="">— Выберите студента —</option>
              {students.map(stu => <option key={stu.id} value={stu.id}>{stu.user?.name || `Студент #${stu.id}`}</option>)}
            </select>
          </div>

          {loading ? (
            <div style={s.loading}>⏳ Загрузка...</div>
          ) : !selectedStudent ? (
            <div style={s.empty}>Выберите студента для просмотра и редактирования расписания</div>
          ) : Object.keys(grouped).length === 0 ? (
            <div style={s.empty}>Расписание пусто. Добавьте первое занятие.</div>
          ) : (
            <div style={{ display: 'grid', gap: '1.25rem' }}>
              {DAYS.map((day, dayIdx) => {
                const items = grouped[day.value];
                if (!items?.length) return null;
                const color = DAY_COLORS[dayIdx % DAY_COLORS.length];
                return (
                  <div key={day.value} style={s.dayCard}>
                    <div style={{ ...s.dayHead, borderLeft: `4px solid ${color}` }}>
                      <div style={{ ...s.dayBadge, color, background: `${color}20`, borderColor: `${color}40` }}>{day.short}</div>
                      <div>
                        <div style={s.dayName}>{day.label}</div>
                        <div style={s.dayCnt}>{items.length} занятий</div>
                      </div>
                    </div>
                    <div style={s.dayItems}>
                      {items.map(item => {
                        const subjectName = subjects.find(s => s.id === item.subject?.id)?.name || '—';
                        return (
                          <div key={item.id} style={{ ...s.lessonRow, borderLeft: `3px solid ${color}` }}>
                            <div style={{ ...s.timeBox, color }}>
                              <div style={s.timeStart}>{item.startTime || '--:--'}</div>
                              <div style={s.timeSep}>│</div>
                              <div style={s.timeEnd}>{item.endTime || '--:--'}</div>
                            </div>
                            <div style={{ flex: 1 }}>
                              <div style={s.lessonName}>{subjectName}</div>
                            </div>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                              <button style={s.editBtn} onClick={() => handleEdit(item)}>✏️</button>
                              <button style={s.delBtn} onClick={() => handleDelete(item.id)}>🗑</button>
                            </div>
                          </div>
                        );
                      })}
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
              <h3 style={s.mTitle}>{editingSchedule ? '✏️ Редактировать занятие' : '+ Добавить занятие'}</h3>
              <button onClick={() => setShowModal(false)} style={s.mClose}>✕</button>
            </div>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div><label style={s.label}>Студент</label>
                <select name="studentId" value={formData.studentId} onChange={handleInput} required disabled={!!editingSchedule} style={s.select}>
                  <option value="">Выберите студента</option>
                  {students.map(stu => <option key={stu.id} value={stu.id}>{stu.user?.name || `Студент #${stu.id}`}</option>)}
                </select>
              </div>
              <div><label style={s.label}>Предмет</label>
                <select name="subjectId" value={formData.subjectId} onChange={handleInput} required style={s.select}>
                  <option value="">Выберите предмет</option>
                  {subjects.map(sub => <option key={sub.id} value={sub.id}>{sub.name}</option>)}
                </select>
              </div>
              <div><label style={s.label}>День недели</label>
                <select name="dayOfWeek" value={formData.dayOfWeek} onChange={handleInput} required style={s.select}>
                  {DAYS.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
                </select>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div><label style={s.label}>Начало</label>
                  <input type="time" name="startTime" value={formData.startTime} onChange={handleInput} required style={s.input} />
                </div>
                <div><label style={s.label}>Конец</label>
                  <input type="time" name="endTime" value={formData.endTime} onChange={handleInput} required style={s.input} />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setShowModal(false)} style={s.cancelBtn}>Отмена</button>
                <button type="submit" style={s.submitBtn}>{editingSchedule ? 'Сохранить' : 'Добавить'}</button>
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
  addBtn: { padding: '0.625rem 1.25rem', background: 'linear-gradient(135deg,#8b5cf6,#5b21b6)', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '0.875rem', fontWeight: '700', cursor: 'pointer', alignSelf: 'center' },
  selectorCard: { background: 'rgba(15, 23, 42, 0.45)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '12px', padding: '1.25rem', marginBottom: '1.25rem' },
  loading: { color: 'rgba(255,255,255,0.5)', textAlign: 'center', padding: '3rem' },
  empty: { textAlign: 'center', padding: '4rem', color: 'rgba(255,255,255,0.3)', fontSize: '1.125rem', background: 'rgba(255,255,255,0.03)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.06)' },
  dayCard: { background: 'rgba(15, 23, 42, 0.45)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '16px', overflow: 'hidden' },
  dayHead: { display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 1.5rem', background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.06)' },
  dayBadge: { width: '36px', height: '36px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '0.75rem', border: '1px solid', flexShrink: 0 },
  dayName: { fontSize: '1rem', fontWeight: '700', color: '#fff', marginBottom: '0.125rem' },
  dayCnt: { fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', fontWeight: '500' },
  dayItems: { padding: '1rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.625rem' },
  lessonRow: { display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.025)', borderRadius: '10px' },
  timeBox: { display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0, width: '48px' },
  timeStart: { fontSize: '0.8125rem', fontWeight: '700' },
  timeSep: { fontSize: '0.5rem', color: 'rgba(255,255,255,0.2)' },
  timeEnd: { fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', fontWeight: '500' },
  lessonName: { fontSize: '0.9rem', fontWeight: '700', color: '#fff' },
  editBtn: { padding: '0.375rem 0.625rem', background: 'rgba(59,130,246,0.12)', color: '#60a5fa', border: '1px solid rgba(59,130,246,0.25)', borderRadius: '8px', fontSize: '0.875rem', cursor: 'pointer' },
  delBtn: { padding: '0.375rem 0.625rem', background: 'rgba(239,68,68,0.1)', color: '#fca5a5', border: '1px solid rgba(239,68,68,0.25)', borderRadius: '8px', fontSize: '0.875rem', cursor: 'pointer' },
  overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' },
  modal: { background: '#0f1e3a', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '20px', padding: '2rem', width: '100%', maxWidth: '480px', maxHeight: '85vh', overflowY: 'auto' },
  mHead: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' },
  mTitle: { fontSize: '1.125rem', fontWeight: '800', color: '#fff', margin: 0 },
  mClose: { background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.6)', width: '32px', height: '32px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.875rem' },
  label: { display: 'block', fontSize: '0.8125rem', fontWeight: '600', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' },
  input: { width: '100%', padding: '0.75rem 1rem', background: 'rgba(15, 23, 42, 0.45)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', fontSize: '0.9375rem', color: '#fff', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' },
  select: { width: '100%', padding: '0.75rem 1rem', background: 'rgba(15, 23, 42, 0.45)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', fontSize: '0.9375rem', color: '#fff', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box', cursor: 'pointer' },
  cancelBtn: { padding: '0.625rem 1.25rem', background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '10px', fontSize: '0.875rem', fontWeight: '600', cursor: 'pointer' },
  submitBtn: { padding: '0.625rem 1.25rem', background: 'linear-gradient(135deg,#8b5cf6,#5b21b6)', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '0.875rem', fontWeight: '700', cursor: 'pointer' },
};

export default TeacherSchedule;
