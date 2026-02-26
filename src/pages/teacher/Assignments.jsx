import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import { getAssignmentsByTeacher, getStudents, getSubjects, createAssignment, deleteAssignment, getSubmissionsByAssignment, setSubmissionGrade } from '../../services/api';
import { getCurrentUser } from '../../services/auth';

const TeacherAssignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [submissions, setSubmissions] = useState({});
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showGradeModal, setShowGradeModal] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [gradeValue, setGradeValue] = useState('');
  const [formData, setFormData] = useState({ studentId: '', subjectId: '', title: '', description: '', deadline: '' });

  useEffect(() => { const u = getCurrentUser(); if (u) loadData(u.id); }, []);

  const loadData = async (userId) => {
    try {
      setLoading(true);
      const [aData, sData, subData] = await Promise.all([getAssignmentsByTeacher(userId), getStudents(), getSubjects()]);
      const aArr = Array.isArray(aData) ? aData : [];
      setAssignments(aArr); setStudents(Array.isArray(sData) ? sData : []); setSubjects(Array.isArray(subData) ? subData : []);
      const map = {};
      for (const a of aArr) {
        try { const subs = await getSubmissionsByAssignment(a.id); map[a.id] = Array.isArray(subs) ? subs : []; } catch { map[a.id] = []; }
      }
      setSubmissions(map);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = getCurrentUser();
      await createAssignment({ teacherId: user.id, studentId: Number(formData.studentId), subjectId: Number(formData.subjectId), title: formData.title, description: formData.description, deadline: formData.deadline });
      setShowModal(false); setFormData({ studentId: '', subjectId: '', title: '', description: '', deadline: '' });
      if (user) loadData(user.id);
    } catch (e) { alert('Ошибка: ' + e.message); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Удалить задание?')) return;
    try { await deleteAssignment(id); const u = getCurrentUser(); if (u) loadData(u.id); } catch { alert('Ошибка удаления'); }
  };

  const handleSaveGrade = async (e) => {
    e.preventDefault();
    const v = Number(gradeValue);
    if (isNaN(v) || v < 0 || v > 100) { alert('Оценка от 0 до 100'); return; }
    try {
      await setSubmissionGrade(selectedSubmission.id, v);
      setShowGradeModal(false); setSelectedSubmission(null); setGradeValue('');
      const u = getCurrentUser(); if (u) loadData(u.id);
    } catch (e) { alert('Ошибка: ' + (e.message || '')); }
  };

  return (
    <div style={s.page}>
      <Navbar role="teacher" />
      <div style={s.body}>
        <Sidebar role="teacher" />
        <main style={s.main}>
          <div style={s.header}>
            <div>
              <h1 style={s.title}>📋 Задания</h1>
              <p style={s.subtitle}>Управление заданиями и оценка ответов</p>
            </div>
            <button style={s.addBtn} onClick={() => setShowModal(true)}>+ Создать задание</button>
          </div>

          {loading ? (
            <div style={s.loading}>⏳ Загрузка заданий...</div>
          ) : assignments.length === 0 ? (
            <div style={s.empty}>Нет заданий. Создайте первое задание.</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {assignments.map(assignment => {
                const subs = submissions[assignment.id] || [];
                return (
                  <div key={assignment.id} style={s.aCard}>
                    <div style={s.aHead}>
                      <div style={{ flex: 1 }}>
                        <h3 style={s.aTitle}>{assignment.title}</h3>
                        <div style={s.aMeta}>
                          <span style={s.tag}>👤 {assignment.student?.user?.name || '—'}</span>
                          <span style={s.tag}>📚 {assignment.subject?.name || '—'}</span>
                          {assignment.deadline && <span style={s.tag}>⏰ {new Date(assignment.deadline).toLocaleString('ru-RU')}</span>}
                        </div>
                        {assignment.description && <p style={s.aDesc}>{assignment.description}</p>}
                      </div>
                      <button style={s.delBtn} onClick={() => handleDelete(assignment.id)}>🗑 Удалить</button>
                    </div>

                    {/* Submissions */}
                    <div style={s.subsSection}>
                      <h4 style={s.subsTitle}>Ответы студентов ({subs.length})</h4>
                      {subs.length === 0 ? (
                        <div style={s.noSubs}>Пока нет ответов</div>
                      ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                          {subs.map(sub => (
                            <div key={sub.id} style={s.subItem}>
                              <div style={s.subHeader}>
                                <div>
                                  <div style={s.subName}>{sub.student?.user?.name || '—'}</div>
                                  <div style={s.subDate}>{sub.submittedAt ? new Date(sub.submittedAt).toLocaleString('ru-RU') : ''}</div>
                                  {sub.grade != null && (
                                    <div style={s.gradeTag}>✓ Оценка: {sub.grade}/100</div>
                                  )}
                                </div>
                                <button
                                  onClick={() => { setSelectedSubmission({ ...sub, assignment }); setGradeValue(sub.grade != null ? String(sub.grade) : ''); setShowGradeModal(true); }}
                                  style={{ ...s.gradeBtn, background: sub.grade != null ? 'rgba(16,185,129,0.2)' : 'rgba(245,158,11,0.2)', color: sub.grade != null ? '#34d399' : '#fbbf24', borderColor: sub.grade != null ? 'rgba(16,185,129,0.3)' : 'rgba(245,158,11,0.3)' }}
                                >
                                  {sub.grade != null ? '📝 Изменить оценку' : '⭐ Выставить оценку'}
                                </button>
                              </div>
                              {sub.answerText && (
                                <div style={s.answerBox}>
                                  <div style={s.answerLabel}>Текст ответа</div>
                                  <div style={s.answerText}>{sub.answerText}</div>
                                </div>
                              )}
                              {sub.fileName && (
                                <a href={`http://localhost:8080/api/assignment-submissions/${sub.id}/file`}
                                  target="_blank" rel="noopener noreferrer" style={s.fileLink}>
                                  📎 {sub.fileName}
                                </a>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>

      {/* Create assignment modal */}
      {showModal && (
        <div style={s.overlay} onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div style={s.modal}>
            <div style={s.mHead}><h3 style={s.mTitle}>+ Создать задание</h3><button onClick={() => setShowModal(false)} style={s.mClose}>✕</button></div>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div><label style={s.label}>Студент</label>
                <select value={formData.studentId} onChange={e => setFormData(p => ({ ...p, studentId: e.target.value }))} style={s.select} required>
                  <option value="">Выберите студента</option>
                  {students.map(stu => <option key={stu.id} value={stu.id}>{stu.user?.name || `Студент #${stu.id}`}</option>)}
                </select>
              </div>
              <div><label style={s.label}>Предмет</label>
                <select value={formData.subjectId} onChange={e => setFormData(p => ({ ...p, subjectId: e.target.value }))} style={s.select} required>
                  <option value="">Выберите предмет</option>
                  {subjects.map(sub => <option key={sub.id} value={sub.id}>{sub.name}</option>)}
                </select>
              </div>
              <div><label style={s.label}>Название</label><input type="text" value={formData.title} onChange={e => setFormData(p => ({ ...p, title: e.target.value }))} style={s.input} required /></div>
              <div><label style={s.label}>Описание</label><textarea value={formData.description} onChange={e => setFormData(p => ({ ...p, description: e.target.value }))} rows={3} style={s.textarea} required /></div>
              <div><label style={s.label}>Дедлайн</label><input type="datetime-local" value={formData.deadline} onChange={e => setFormData(p => ({ ...p, deadline: e.target.value }))} style={s.input} required /></div>
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setShowModal(false)} style={s.cancelBtn}>Отмена</button>
                <button type="submit" style={s.submitBtn}>Создать</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Grade modal */}
      {showGradeModal && selectedSubmission && (
        <div style={s.overlay} onClick={e => { if (e.target === e.currentTarget) { setShowGradeModal(false); setSelectedSubmission(null); setGradeValue(''); } }}>
          <div style={s.modal}>
            <div style={s.mHead}><h3 style={s.mTitle}>⭐ Выставить оценку</h3><button onClick={() => { setShowGradeModal(false); setSelectedSubmission(null); setGradeValue(''); }} style={s.mClose}>✕</button></div>
            <div style={s.gradeInfo}>
              <div style={s.gradeInfoRow}><strong style={{ color: 'rgba(255,255,255,0.55)' }}>Студент:</strong> {selectedSubmission.student?.user?.name || '—'}</div>
              <div style={s.gradeInfoRow}><strong style={{ color: 'rgba(255,255,255,0.55)' }}>Задание:</strong> {selectedSubmission.assignment?.title || '—'}</div>
              {selectedSubmission.answerText && <div style={s.answerPreview}>{selectedSubmission.answerText}</div>}
              {selectedSubmission.fileName && <a href={`http://localhost:8080/api/assignment-submissions/${selectedSubmission.id}/file`} target="_blank" rel="noopener noreferrer" style={s.fileLink}>📎 {selectedSubmission.fileName}</a>}
            </div>
            <form onSubmit={handleSaveGrade} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div><label style={s.label}>Оценка (0–100)</label><input type="number" min="0" max="100" step="0.1" value={gradeValue} onChange={e => setGradeValue(e.target.value)} placeholder="Введите оценку" style={s.input} required /></div>
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => { setShowGradeModal(false); setSelectedSubmission(null); setGradeValue(''); }} style={s.cancelBtn}>Отмена</button>
                <button type="submit" style={s.submitBtn}>Сохранить оценку</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const s = {
  page: { minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#0a1628', fontFamily: "'Inter',-apple-system,sans-serif" },
  body: { display: 'flex', flex: 1 },
  main: { flex: 1, padding: '2rem', overflowY: 'auto', background: 'linear-gradient(160deg,#0a1628 0%,#0f1e3a 100%)' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '1.5rem 2rem', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' },
  title: { fontSize: '1.75rem', fontWeight: '800', color: '#a78bfa', margin: '0 0 0.25rem 0', letterSpacing: '-0.02em' },
  subtitle: { color: 'rgba(255,255,255,0.45)', fontSize: '0.9rem', margin: 0 },
  addBtn: { padding: '0.625rem 1.25rem', background: 'linear-gradient(135deg,#8b5cf6,#5b21b6)', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '0.875rem', fontWeight: '700', cursor: 'pointer', alignSelf: 'center', boxShadow: '0 4px 12px rgba(139,92,246,0.4)' },
  loading: { color: 'rgba(255,255,255,0.5)', textAlign: 'center', padding: '3rem' },
  empty: { textAlign: 'center', padding: '4rem', color: 'rgba(255,255,255,0.3)', fontSize: '1.125rem', background: 'rgba(255,255,255,0.03)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.06)' },
  aCard: { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', overflow: 'hidden' },
  aHead: { display: 'flex', gap: '1rem', justifyContent: 'space-between', padding: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.06)' },
  aTitle: { fontSize: '1.0625rem', fontWeight: '700', color: '#fff', margin: '0 0 0.5rem 0' },
  aMeta: { display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.5rem' },
  tag: { fontSize: '0.75rem', color: 'rgba(255,255,255,0.45)', background: 'rgba(255,255,255,0.06)', padding: '0.25rem 0.625rem', borderRadius: '100px', fontWeight: '600' },
  aDesc: { fontSize: '0.875rem', color: 'rgba(255,255,255,0.4)', margin: 0, lineHeight: 1.5 },
  delBtn: { padding: '0.375rem 0.75rem', background: 'rgba(239,68,68,0.1)', color: '#fca5a5', border: '1px solid rgba(239,68,68,0.25)', borderRadius: '8px', fontSize: '0.75rem', fontWeight: '600', cursor: 'pointer', flexShrink: 0, alignSelf: 'flex-start' },
  subsSection: { padding: '1rem 1.5rem' },
  subsTitle: { fontSize: '0.875rem', fontWeight: '700', color: 'rgba(255,255,255,0.7)', margin: '0 0 0.875rem 0' },
  noSubs: { fontSize: '0.8125rem', color: 'rgba(255,255,255,0.25)', fontStyle: 'italic', padding: '0.5rem' },
  subItem: { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', padding: '0.875rem' },
  subHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', marginBottom: '0.625rem' },
  subName: { fontSize: '0.875rem', fontWeight: '700', color: '#fff', marginBottom: '0.15rem' },
  subDate: { fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)', fontWeight: '500' },
  gradeTag: { fontSize: '0.75rem', color: '#34d399', background: 'rgba(16,185,129,0.12)', padding: '0.2rem 0.5rem', borderRadius: '6px', fontWeight: '700', marginTop: '0.35rem', display: 'inline-block' },
  gradeBtn: { padding: '0.375rem 0.875rem', border: '1px solid', borderRadius: '8px', fontSize: '0.75rem', fontWeight: '700', cursor: 'pointer', flexShrink: 0 },
  answerBox: { background: 'rgba(255,255,255,0.04)', borderRadius: '8px', padding: '0.75rem', marginTop: '0.5rem' },
  answerLabel: { fontSize: '0.7rem', fontWeight: '700', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '0.375rem' },
  answerText: { fontSize: '0.875rem', color: 'rgba(255,255,255,0.65)', lineHeight: 1.5 },
  fileLink: { display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.875rem', color: '#60a5fa', textDecoration: 'none', marginTop: '0.5rem', fontWeight: '600' },
  overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' },
  modal: { background: '#0f1e3a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', padding: '2rem', width: '100%', maxWidth: '560px', maxHeight: '85vh', overflowY: 'auto' },
  mHead: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' },
  mTitle: { fontSize: '1.125rem', fontWeight: '800', color: '#fff', margin: 0 },
  mClose: { background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)', width: '32px', height: '32px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.875rem' },
  label: { display: 'block', fontSize: '0.8125rem', fontWeight: '600', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' },
  input: { width: '100%', padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', fontSize: '0.9375rem', color: '#fff', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' },
  select: { width: '100%', padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', fontSize: '0.9375rem', color: '#fff', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box', cursor: 'pointer' },
  textarea: { width: '100%', padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', fontSize: '0.9375rem', color: '#fff', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box', resize: 'vertical' },
  cancelBtn: { padding: '0.625rem 1.25rem', background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '10px', fontSize: '0.875rem', fontWeight: '600', cursor: 'pointer' },
  submitBtn: { padding: '0.625rem 1.25rem', background: 'linear-gradient(135deg,#8b5cf6,#5b21b6)', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '0.875rem', fontWeight: '700', cursor: 'pointer' },
  gradeInfo: { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px', padding: '1rem', marginBottom: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' },
  gradeInfoRow: { fontSize: '0.875rem', color: 'rgba(255,255,255,0.7)' },
  answerPreview: { fontSize: '0.875rem', color: 'rgba(255,255,255,0.55)', lineHeight: 1.5, maxHeight: '120px', overflowY: 'auto', background: 'rgba(255,255,255,0.04)', borderRadius: '8px', padding: '0.625rem', marginTop: '0.5rem' },
};

export default TeacherAssignments;
