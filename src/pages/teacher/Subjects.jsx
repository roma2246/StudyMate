import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import Table from '../../components/Table';
import { getSubjects, createSubject, updateSubject, deleteSubject, getGrades } from '../../services/api';

const TeacherSubjects = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  const [formData, setFormData] = useState({ name: '' });

  useEffect(() => { loadSubjects(); }, []);

  const loadSubjects = async () => {
    try {
      setLoading(true);
      const [data, grades] = await Promise.all([getSubjects(), getGrades()]);
      setSubjects(Array.isArray(data) ? data.map(s => ({
        id: s.id, name: s.name,
        gradesCount: Array.isArray(grades) ? grades.filter(g => g.subject?.id === s.id).length : 0
      })) : []);
    } catch { setSubjects([]); } finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) { alert('Введите название'); return; }
    try {
      editingSubject ? await updateSubject(editingSubject.id, { name: formData.name }) : await createSubject({ name: formData.name });
      setShowModal(false); setFormData({ name: '' }); setEditingSubject(null); loadSubjects();
    } catch (e) { alert('Ошибка: ' + (e.message || '')); }
  };

  const handleEdit = (subject) => { setEditingSubject(subject); setFormData({ name: subject.name }); setShowModal(true); };
  const handleDelete = async (id) => {
    if (window.confirm('Удалить этот предмет?'))
      try { await deleteSubject(id); loadSubjects(); } catch { }
  };

  const openCreate = () => { setEditingSubject(null); setFormData({ name: '' }); setShowModal(true); };

  return (
    <div style={s.page}>
      <Navbar role="teacher" />
      <div style={s.body}>
        <Sidebar role="teacher" />
        <main style={s.main}>
          <div style={s.header}>
            <div>
              <h1 style={s.title}>📚 Предметы</h1>
              <p style={s.subtitle}>Управление учебными дисциплинами</p>
            </div>
            <button style={s.addBtn} onClick={openCreate}>+ Добавить предмет</button>
          </div>

          {loading ? (
            <div style={s.loading}>⏳ Загрузка...</div>
          ) : (
            <div style={s.tableWrap}>
              <Table
                columns={[
                  { key: 'id', header: 'ID', width: '10%' },
                  { key: 'name', header: 'Название', width: '50%' },
                  { key: 'gradesCount', header: 'Количество оценок', width: '40%' },
                ]}
                data={subjects}
                actions={[
                  { name: 'edit', label: 'Редактировать', type: 'primary' },
                  { name: 'delete', label: 'Удалить', type: 'danger' },
                ]}
                onAction={(action, item) => action === 'edit' ? handleEdit(item) : handleDelete(item.id)}
              />
            </div>
          )}
        </main>
      </div>

      {showModal && (
        <div style={s.overlay} onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div style={s.modal}>
            <div style={s.mHead}>
              <h3 style={s.mTitle}>{editingSubject ? '✏️ Редактировать предмет' : '+ Добавить предмет'}</h3>
              <button onClick={() => setShowModal(false)} style={s.mClose}>✕</button>
            </div>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={s.label}>Название предмета</label>
                <input type="text" value={formData.name}
                  onChange={e => setFormData({ name: e.target.value })}
                  placeholder="Например: Математика, Физика..."
                  style={s.input} required />
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setShowModal(false)} style={s.cancelBtn}>Отмена</button>
                <button type="submit" style={s.submitBtn}>{editingSubject ? 'Сохранить' : 'Добавить'}</button>
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
  addBtn: { padding: '0.625rem 1.25rem', background: 'linear-gradient(135deg,#8b5cf6,#5b21b6)', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '0.875rem', fontWeight: '700', cursor: 'pointer', boxShadow: '0 4px 12px rgba(139,92,246,0.4)', alignSelf: 'center', flexShrink: 0 },
  loading: { color: 'rgba(255,255,255,0.5)', textAlign: 'center', padding: '3rem' },
  tableWrap: { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', overflow: 'hidden' },
  overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' },
  modal: { background: '#0f1e3a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', padding: '2rem', width: '100%', maxWidth: '480px' },
  mHead: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' },
  mTitle: { fontSize: '1.125rem', fontWeight: '800', color: '#fff', margin: 0 },
  mClose: { background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)', width: '32px', height: '32px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.875rem' },
  label: { display: 'block', fontSize: '0.8125rem', fontWeight: '600', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' },
  input: { width: '100%', padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', fontSize: '0.9375rem', color: '#fff', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' },
  cancelBtn: { padding: '0.625rem 1.25rem', background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '10px', fontSize: '0.875rem', fontWeight: '600', cursor: 'pointer' },
  submitBtn: { padding: '0.625rem 1.25rem', background: 'linear-gradient(135deg,#8b5cf6,#5b21b6)', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '0.875rem', fontWeight: '700', cursor: 'pointer' },
};

export default TeacherSubjects;