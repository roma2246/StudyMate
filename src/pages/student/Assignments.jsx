// src/pages/student/Assignments.jsx
import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import { getAssignmentsByStudent, createSubmission, getSubmissionsByStudent } from '../../services/api';
import { getCurrentUser } from '../../services/auth';

const StudentAssignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState({});
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [answerText, setAnswerText] = useState('');
  const [file, setFile] = useState(null);

  useEffect(() => {
    const user = getCurrentUser();
    if (user) loadAssignments(user.id);
  }, []);

  const loadAssignments = async (userId) => {
    try {
      setLoading(true);
      const [aData, sData] = await Promise.all([
        getAssignmentsByStudent(userId),
        getSubmissionsByStudent(userId)
      ]);
      setAssignments(Array.isArray(aData) ? aData : []);
      const map = {};
      if (Array.isArray(sData)) sData.forEach(sub => { map[sub.assignment?.id] = sub; });
      setSubmissions(map);
    } catch (e) {
      setAssignments([]); setSubmissions({});
    } finally { setLoading(false); }
  };

  const handleOpenModal = (assignment) => {
    setSelectedAssignment(assignment);
    setAnswerText(''); setFile(null); setShowModal(true);
  };

  const handleSubmitAnswer = async (e) => {
    e.preventDefault();
    if (!selectedAssignment) return;
    if (!answerText.trim() && !file) { alert('Введите текст или загрузите файл'); return; }
    try {
      await createSubmission(selectedAssignment.id, selectedAssignment.student.id, answerText.trim(), file);
      setShowModal(false); setAnswerText(''); setFile(null); setSelectedAssignment(null);
      const user = getCurrentUser();
      if (user) loadAssignments(user.id);
      alert('Ответ успешно отправлен!');
    } catch (e) { alert('Ошибка: ' + (e.message || 'Неизвестная ошибка')); }
  };

  const formatDate = (d) => {
    if (!d) return '';
    return new Date(d).toLocaleString('ru-RU', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
  };

  const isOverdue = (deadline) => deadline && new Date(deadline) < new Date();

  return (
    <div style={s.page}>
      <Navbar role="student" />
      <div style={s.body}>
        <Sidebar role="student" />
        <main style={s.main}>
          <div style={s.header}>
            <div>
              <h1 style={s.title}>📋 Мои задания</h1>
              <p style={s.subtitle}>Выполненные и предстоящие задания</p>
            </div>
          </div>

          {loading ? (
            <div style={s.loading}>⏳ Загрузка заданий...</div>
          ) : assignments.length === 0 ? (
            <div style={s.empty}>📋 Пока нет заданий</div>
          ) : (
            <div style={{ display: 'grid', gap: '1rem' }}>
              {assignments.map((assignment) => {
                const submission = submissions[assignment.id];
                const done = !!submission;
                const overdue = !done && isOverdue(assignment.deadline);

                return (
                  <div key={assignment.id} style={{
                    ...s.card,
                    borderLeft: `4px solid ${done ? '#10b981' : overdue ? '#ef4444' : '#3b82f6'}`
                  }}>
                    <div style={s.cardTop}>
                      <div style={s.cardLeft}>
                        <div style={s.cardTitle}>{assignment.title}</div>
                        <div style={s.cardMeta}>
                          {assignment.subject?.name && (
                            <span style={s.tag}>📚 {assignment.subject.name}</span>
                          )}
                          {assignment.deadline && (
                            <span style={{ ...s.tag, color: overdue ? '#fca5a5' : 'rgba(255,255,255,0.5)', background: overdue ? 'rgba(239,68,68,0.12)' : 'rgba(15, 23, 42, 0.45)' }}>
                              ⏰ {formatDate(assignment.deadline)}{overdue ? ' (просрочено)' : ''}
                            </span>
                          )}
                        </div>
                        {assignment.description && (
                          <p style={s.cardDesc}>{assignment.description}</p>
                        )}
                      </div>
                      <div style={{ ...s.statusBadge, background: done ? 'rgba(16,185,129,0.15)' : overdue ? 'rgba(239,68,68,0.12)' : 'rgba(59,130,246,0.15)', color: done ? '#34d399' : overdue ? '#fca5a5' : '#93c5fd', border: `1px solid ${done ? 'rgba(16,185,129,0.3)' : overdue ? 'rgba(239,68,68,0.3)' : 'rgba(59,130,246,0.3)'}` }}>
                        {done ? '✓ Сдано' : overdue ? '⚠ Просрочено' : '📝 Ожидает'}
                      </div>
                    </div>

                    {done ? (
                      <div style={s.submissionInfo}>
                        {submission.answerText && (
                          <div style={s.submText}>💬 {submission.answerText}</div>
                        )}
                        {submission.fileName && (
                          <a href={`http://localhost:8080/api/assignment-submissions/${submission.id}/file`}
                            target="_blank" rel="noopener noreferrer" style={s.fileLink}>
                            📎 {submission.fileName}
                          </a>
                        )}
                        {submission.grade != null && (
                          <div style={s.gradeBox}>
                            ⭐ Оценка: <strong style={{ color: '#fbbf24' }}>{submission.grade}/100</strong>
                          </div>
                        )}
                      </div>
                    ) : (
                      <button onClick={() => handleOpenModal(assignment)} style={s.btn}>
                        Ответить на задание →
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>

      {/* Modal */}
      {showModal && (
        <div style={s.overlay} onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div style={s.modal}>
            <div style={s.modalHeader}>
              <h3 style={s.modalTitle}>📝 Ответить на задание</h3>
              <button onClick={() => setShowModal(false)} style={s.closeBtn}>✕</button>
            </div>
            <p style={s.modalSub}>{selectedAssignment?.title}</p>
            <form onSubmit={handleSubmitAnswer} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={s.label}>Текстовый ответ</label>
                <textarea value={answerText} onChange={e => setAnswerText(e.target.value)}
                  placeholder="Введите ваш ответ здесь..."
                  rows={5} style={s.textarea} />
              </div>
              <div>
                <label style={s.label}>Или загрузите файл</label>
                <input type="file" accept=".doc,.docx,.pdf,.ppt,.pptx,.txt,.jpg,.jpeg,.png"
                  onChange={e => setFile(e.target.files[0])} style={s.fileInput} />
                <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem', marginTop: '0.375rem' }}>
                  Word, PDF, PowerPoint, текст, изображения
                </p>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setShowModal(false)} style={s.cancelBtn}>Отмена</button>
                <button type="submit" style={s.submitBtn}>Отправить ответ</button>
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
  header: { background: 'rgba(15, 23, 42, 0.45)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '16px', padding: '1.5rem 2rem', marginBottom: '1.5rem' },
  title: { fontSize: '1.75rem', fontWeight: '800', color: '#60a5fa', margin: '0 0 0.25rem 0', letterSpacing: '-0.02em' },
  subtitle: { color: 'rgba(255,255,255,0.45)', fontSize: '0.9rem', margin: 0 },
  loading: { color: 'rgba(255,255,255,0.5)', textAlign: 'center', padding: '3rem' },
  empty: { textAlign: 'center', padding: '4rem', color: 'rgba(255,255,255,0.3)', fontSize: '1.125rem', background: 'rgba(255,255,255,0.03)', borderRadius: '16px', border: '1px solid rgba(15, 23, 42, 0.45)' },
  card: { background: 'rgba(15, 23, 42, 0.45)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '16px', padding: '1.5rem', transition: 'all 0.2s ease' },
  cardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', marginBottom: '1rem' },
  cardLeft: { flex: 1 },
  cardTitle: { fontSize: '1.0625rem', fontWeight: '700', color: '#fff', marginBottom: '0.5rem' },
  cardMeta: { display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.5rem' },
  tag: { fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', background: 'rgba(15, 23, 42, 0.45)', padding: '0.25rem 0.625rem', borderRadius: '100px', fontWeight: '600' },
  cardDesc: { fontSize: '0.875rem', color: 'rgba(255,255,255,0.45)', margin: 0, lineHeight: 1.6 },
  statusBadge: { padding: '0.375rem 0.875rem', borderRadius: '100px', fontSize: '0.75rem', fontWeight: '700', flexShrink: 0 },
  submissionInfo: { background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '10px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' },
  submText: { fontSize: '0.875rem', color: 'rgba(255,255,255,0.6)', fontWeight: '500' },
  fileLink: { fontSize: '0.875rem', color: '#60a5fa', textDecoration: 'none', fontWeight: '600' },
  gradeBox: { fontSize: '0.875rem', color: 'rgba(255,255,255,0.6)', fontWeight: '500' },
  btn: { padding: '0.625rem 1.25rem', background: 'linear-gradient(135deg,#3b82f6,#1d4ed8)', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '0.875rem', fontWeight: '700', cursor: 'pointer', boxShadow: '0 4px 12px rgba(59,130,246,0.35)' },
  // Modal
  overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' },
  modal: { background: '#0f1e3a', border: '1px solid rgba(15, 23, 42, 0.45)', borderRadius: '20px', padding: '2rem', width: '100%', maxWidth: '560px', maxHeight: '85vh', overflow: 'auto' },
  modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' },
  modalTitle: { fontSize: '1.125rem', fontWeight: '800', color: '#fff', margin: 0 },
  modalSub: { color: 'rgba(255,255,255,0.45)', fontSize: '0.875rem', marginBottom: '1.5rem' },
  closeBtn: { background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(15, 23, 42, 0.45)', color: 'rgba(255,255,255,0.6)', width: '32px', height: '32px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.875rem', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  label: { display: 'block', fontSize: '0.8125rem', fontWeight: '600', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' },
  textarea: { width: '100%', padding: '0.875rem', background: 'rgba(15, 23, 42, 0.45)', border: '1px solid rgba(15, 23, 42, 0.45)', borderRadius: '10px', fontSize: '0.9375rem', color: '#fff', fontFamily: 'inherit', resize: 'vertical', outline: 'none', boxSizing: 'border-box' },
  fileInput: { width: '100%', padding: '0.75rem', background: 'rgba(15, 23, 42, 0.45)', border: '1px solid rgba(15, 23, 42, 0.45)', borderRadius: '10px', color: 'rgba(255,255,255,0.7)', fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box' },
  cancelBtn: { padding: '0.625rem 1.25rem', background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '10px', fontSize: '0.875rem', fontWeight: '600', cursor: 'pointer' },
  submitBtn: { padding: '0.625rem 1.25rem', background: 'linear-gradient(135deg,#3b82f6,#1d4ed8)', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '0.875rem', fontWeight: '700', cursor: 'pointer' },
};

export default StudentAssignments;
