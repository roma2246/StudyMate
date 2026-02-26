import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import Table from '../../components/Table';
import { getStudents, updateStudent, getStudentGroups } from '../../services/api';

const TeacherStudents = () => {
  const [students, setStudents] = useState([]);
  const [availableGroups, setAvailableGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({ name: '', group: '' });

  useEffect(() => { loadStudents(); loadGroups(); }, []);

  const loadStudents = async () => {
    try {
      setLoading(true);
      const data = await getStudents();
      setStudents(Array.isArray(data) ? data.map(s => ({ id: s.id, name: s.user?.name || `Студент #${s.id}`, group: s.group || '—' })) : []);
    } catch { setStudents([]); } finally { setLoading(false); }
  };

  const loadGroups = async () => {
    try { const g = await getStudentGroups(); setAvailableGroups(Array.isArray(g) ? g : []); } catch { setAvailableGroups([]); }
  };

  const handleEdit = (student) => {
    setEditingStudent(student);
    setFormData({ name: student.name, group: student.group === '—' ? '' : student.group });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!editingStudent) { alert('Создание студентов происходит через регистрацию.'); setShowModal(false); return; }
    if (!formData.group.trim()) { alert('Введите группу'); return; }
    try {
      await updateStudent(editingStudent.id, { group: formData.group.trim() });
      setShowModal(false); setFormData({ name: '', group: '' }); setEditingStudent(null);
      loadStudents(); loadGroups();
    } catch (e) { alert('Ошибка: ' + (e.message || 'Неизвестная ошибка')); }
  };

  const filtered = students.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.group.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={s.page}>
      <Navbar role="teacher" />
      <div style={s.body}>
        <Sidebar role="teacher" />
        <main style={s.main}>
          <div style={s.header}>
            <div>
              <h1 style={s.title}>👥 Студенты</h1>
              <p style={s.subtitle}>Управление группами студентов</p>
            </div>
          </div>

          <div style={s.searchWrap}>
            <input
              type="text"
              placeholder="🔍 Поиск по имени или группе..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={s.search}
              onFocus={e => { e.target.style.borderColor = '#8b5cf6'; e.target.style.boxShadow = '0 0 0 3px rgba(139,92,246,0.15)'; }}
              onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.boxShadow = 'none'; }}
            />
          </div>

          {loading ? (
            <div style={s.loading}>⏳ Загрузка...</div>
          ) : (
            <div style={s.tableWrap}>
              <Table
                columns={[
                  { key: 'id', header: 'ID', width: '10%' },
                  { key: 'name', header: 'ФИО', width: '60%' },
                  { key: 'group', header: 'Группа', width: '30%' },
                ]}
                data={filtered}
                actions={[{ name: 'edit', label: 'Изм. группу', type: 'primary' }]}
                onAction={(action, item) => action === 'edit' && handleEdit(item)}
              />
            </div>
          )}
        </main>
      </div>

      {showModal && (
        <div style={s.overlay} onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div style={s.modal}>
            <div style={s.mHead}>
              <h3 style={s.mTitle}>✏️ Выставить группу</h3>
              <button onClick={() => setShowModal(false)} style={s.mClose}>✕</button>
            </div>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={s.label}>Студент</label>
                <input type="text" value={formData.name} disabled style={{ ...s.input, opacity: 0.5, cursor: 'not-allowed' }} />
              </div>
              <div>
                <label style={s.label}>Группа</label>
                <input type="text" value={formData.group}
                  onChange={e => setFormData(p => ({ ...p, group: e.target.value }))}
                  placeholder="Например: ИС-21, ФИИТ-3..."
                  style={s.input} required />
                {availableGroups.length > 0 && (
                  <div style={{ marginTop: '0.75rem' }}>
                    <div style={s.groupsHint}>Существующие группы:</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.375rem' }}>
                      {availableGroups.map(g => (
                        <button key={g} type="button" onClick={() => setFormData(p => ({ ...p, group: g }))}
                          style={{ ...s.groupPill, background: formData.group === g ? 'rgba(139,92,246,0.3)' : 'rgba(255,255,255,0.06)', color: formData.group === g ? '#c4b5fd' : 'rgba(255,255,255,0.55)', borderColor: formData.group === g ? 'rgba(139,92,246,0.5)' : 'rgba(255,255,255,0.1)' }}>
                          {g}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setShowModal(false)} style={s.cancelBtn}>Отмена</button>
                <button type="submit" style={s.submitBtn}>Сохранить</button>
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
  header: { background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '1.5rem 2rem', marginBottom: '1.25rem' },
  title: { fontSize: '1.75rem', fontWeight: '800', color: '#a78bfa', margin: '0 0 0.25rem 0', letterSpacing: '-0.02em' },
  subtitle: { color: 'rgba(255,255,255,0.45)', fontSize: '0.9rem', margin: 0 },
  searchWrap: { marginBottom: '1.25rem' },
  search: { width: '100%', padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '0.9375rem', color: '#fff', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box', transition: 'all 0.2s ease' },
  loading: { color: 'rgba(255,255,255,0.5)', textAlign: 'center', padding: '3rem' },
  tableWrap: { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', overflow: 'hidden' },
  overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' },
  modal: { background: '#0f1e3a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', padding: '2rem', width: '100%', maxWidth: '480px' },
  mHead: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' },
  mTitle: { fontSize: '1.125rem', fontWeight: '800', color: '#fff', margin: 0 },
  mClose: { background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)', width: '32px', height: '32px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.875rem' },
  label: { display: 'block', fontSize: '0.8125rem', fontWeight: '600', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' },
  input: { width: '100%', padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', fontSize: '0.9375rem', color: '#fff', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' },
  groupsHint: { fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)', fontWeight: '600' },
  groupPill: { padding: '0.25rem 0.75rem', borderRadius: '100px', fontSize: '0.75rem', fontWeight: '600', cursor: 'pointer', border: '1px solid', transition: 'all 0.15s ease' },
  cancelBtn: { padding: '0.625rem 1.25rem', background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '10px', fontSize: '0.875rem', fontWeight: '600', cursor: 'pointer' },
  submitBtn: { padding: '0.625rem 1.25rem', background: 'linear-gradient(135deg,#8b5cf6,#5b21b6)', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '0.875rem', fontWeight: '700', cursor: 'pointer' },
};

export default TeacherStudents;