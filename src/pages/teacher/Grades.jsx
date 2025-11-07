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
  const [filters, setFilters] = useState({
    subjectId: '',
    studentId: ''
  });
  
  const [formData, setFormData] = useState({
    studentId: '',
    subjectId: '',
    value: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [gradesData, studentsData, subjectsData] = await Promise.all([
        getGrades(),
        getStudents(),
        getSubjects()
      ]);
      setGrades(gradesData);
      setStudents(studentsData);
      setSubjects(subjectsData);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value === '' ? '' : Number(value)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Валидация
    if (!formData.studentId || formData.studentId === '') {
      alert('Пожалуйста, выберите студента');
      return;
    }
    if (!formData.subjectId || formData.subjectId === '') {
      alert('Пожалуйста, выберите предмет');
      return;
    }
    if (!formData.value || formData.value === '' || Number(formData.value) < 0 || Number(formData.value) > 100) {
      alert('Пожалуйста, введите оценку от 0 до 100');
      return;
    }
    
    try {
      const payload = {
        studentId: Number(formData.studentId),
        subjectId: Number(formData.subjectId),
        value: Number(formData.value)
      };

      console.log('Отправка оценки:', payload); // Для отладки

      if (editingGrade) {
        await updateGrade(editingGrade.id, payload);
      } else {
        await createGrade(payload);
      }
      
      setFormData({ studentId: '', subjectId: '', value: '' });
      setEditingGrade(null);
      setShowModal(false);
      loadData();
    } catch (error) {
      console.error('Failed to save grade:', error);
      const errorMessage = error.message || (error.error ? JSON.stringify(error) : 'Неизвестная ошибка');
      alert('Ошибка при сохранении оценки: ' + errorMessage);
    }
  };

  const handleEdit = (grade) => {
    setEditingGrade(grade);
    setFormData({
      studentId: grade.student?.id || '',
      subjectId: grade.subject?.id || '',
      value: grade.value || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Вы уверены, что хотите удалить эту оценку?')) {
      try {
        await deleteGrade(id);
        loadData();
      } catch (error) {
        console.error('Failed to delete grade:', error);
        alert('Ошибка при удалении оценки');
      }
    }
  };

  const getStudentName = (studentId) => {
    const student = students.find(s => s.id === studentId);
    return student?.user?.name || 'Неизвестно';
  };

  const getSubjectName = (subjectId) => {
    const subject = subjects.find(s => s.id === subjectId);
    return subject?.name || 'Неизвестно';
  };

  const convertTo5Point = (value) => {
    if (value >= 90) return 5;
    if (value >= 75) return 4;
    if (value >= 60) return 3;
    if (value >= 40) return 2;
    return 1;
  };

  const filteredGrades = grades.filter(grade => {
    if (filters.subjectId && grade.subject?.id !== filters.subjectId) return false;
    if (filters.studentId && grade.student?.id !== filters.studentId) return false;
    return true;
  });

  const displayGrades = filteredGrades.map(grade => ({
    id: grade.id,
    studentName: getStudentName(grade.student?.id),
    subjectName: getSubjectName(grade.subject?.id),
    value: grade.value,
    grade5: convertTo5Point(grade.value),
    original: grade
  }));

  return (
    <div className="app">
      <Navbar role="teacher" />
      <div className="app-body">
        <Sidebar role="teacher" />
        <main className="main-content">
          <div className="page-header">
            <h1>Оценки студентов</h1>
            <button 
              className="btn btn-primary"
              onClick={() => {
                setEditingGrade(null);
                setFormData({ studentId: '', subjectId: '', value: '' });
                setShowModal(true);
              }}
            >
              + Добавить оценку
            </button>
          </div>
          
          <div className="page-filters" style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label style={{ marginBottom: '8px', display: 'block', fontWeight: '600' }}>Фильтр по предмету:</label>
              <select
                name="subjectId"
                value={filters.subjectId || ''}
                onChange={handleFilterChange}
                style={{ padding: '12px', borderRadius: '8px', border: '1px solid #e5e7eb', width: '100%' }}
              >
                <option value="">Все предметы</option>
                {subjects.map(subject => (
                  <option key={subject.id} value={subject.id}>
                    {subject.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="form-group" style={{ flex: 1 }}>
              <label style={{ marginBottom: '8px', display: 'block', fontWeight: '600' }}>Фильтр по студенту:</label>
              <select
                name="studentId"
                value={filters.studentId || ''}
                onChange={handleFilterChange}
                style={{ padding: '12px', borderRadius: '8px', border: '1px solid #e5e7eb', width: '100%' }}
              >
                <option value="">Все студенты</option>
                {students.map(student => (
                  <option key={student.id} value={student.id}>
                    {student.user?.name || `Студент #${student.id}`}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          {loading ? (
            <div className="loading">Загрузка...</div>
          ) : displayGrades.length === 0 ? (
            <div style={{ 
              padding: '48px', 
              textAlign: 'center', 
              color: '#6b7280',
              background: '#f9fafb',
              borderRadius: '12px'
            }}>
              <p style={{ fontSize: '18px' }}>Оценки не найдены. Добавьте первую оценку.</p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <thead>
                  <tr style={{ background: '#f3f4f6' }}>
                    <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', borderBottom: '2px solid #e5e7eb' }}>Студент</th>
                    <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', borderBottom: '2px solid #e5e7eb' }}>Предмет</th>
                    <th style={{ padding: '16px', textAlign: 'center', fontWeight: '600', borderBottom: '2px solid #e5e7eb' }}>Оценка (0-100)</th>
                    <th style={{ padding: '16px', textAlign: 'center', fontWeight: '600', borderBottom: '2px solid #e5e7eb' }}>Оценка (5-балл)</th>
                    <th style={{ padding: '16px', textAlign: 'center', fontWeight: '600', borderBottom: '2px solid #e5e7eb' }}>Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {displayGrades.map((grade) => (
                    <tr key={grade.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                      <td style={{ padding: '16px' }}>{grade.studentName}</td>
                      <td style={{ padding: '16px' }}>{grade.subjectName}</td>
                      <td style={{ padding: '16px', textAlign: 'center', fontWeight: '600' }}>{grade.value}</td>
                      <td style={{ padding: '16px', textAlign: 'center', fontWeight: '600', color: grade.grade5 >= 4 ? '#16a34a' : grade.grade5 >= 3 ? '#f59e0b' : '#dc2626' }}>
                        {grade.grade5}
                      </td>
                      <td style={{ padding: '16px', textAlign: 'center' }}>
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                          <button
                            onClick={() => handleEdit(grade.original)}
                            style={{
                              padding: '8px 16px',
                              background: '#3b82f6',
                              color: 'white',
                              border: 'none',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              fontSize: '14px'
                            }}
                          >
                            Редактировать
                          </button>
                          <button
                            onClick={() => handleDelete(grade.id)}
                            style={{
                              padding: '8px 16px',
                              background: '#ef4444',
                              color: 'white',
                              border: 'none',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              fontSize: '14px'
                            }}
                          >
                            Удалить
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
          {/* Modal for adding/editing grade */}
          {showModal && (
            <div className="modal-overlay" onClick={() => setShowModal(false)}>
              <div className="modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                  <h2>{editingGrade ? 'Редактировать оценку' : 'Добавить оценку'}</h2>
                  <button 
                    className="modal-close"
                    onClick={() => setShowModal(false)}
                  >
                    ×
                  </button>
                </div>
                <form onSubmit={handleSubmit} className="modal-body">
                  <div className="form-group">
                    <label htmlFor="studentId">Студент</label>
                    <select
                      id="studentId"
                      name="studentId"
                      value={formData.studentId || ''}
                      onChange={handleInputChange}
                      required
                      style={{ padding: '12px', borderRadius: '8px', border: '1px solid #e5e7eb', width: '100%' }}
                    >
                      <option value="">Выберите студента</option>
                      {students.map(student => (
                        <option key={student.id} value={student.id}>
                          {student.user?.name || `Студент #${student.id}`}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="subjectId">Предмет</label>
                    <select
                      id="subjectId"
                      name="subjectId"
                      value={formData.subjectId || ''}
                      onChange={handleInputChange}
                      required
                      style={{ padding: '12px', borderRadius: '8px', border: '1px solid #e5e7eb', width: '100%' }}
                    >
                      <option value="">Выберите предмет</option>
                      {subjects.map(subject => (
                        <option key={subject.id} value={subject.id}>
                          {subject.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="value">Оценка (0-100 баллов)</label>
                    <input
                      type="number"
                      id="value"
                      name="value"
                      min="0"
                      max="100"
                      step="1"
                      value={formData.value || ''}
                      onChange={handleInputChange}
                      placeholder="Введите оценку от 0 до 100"
                      required
                      style={{ padding: '12px', borderRadius: '8px', border: '1px solid #e5e7eb', width: '100%' }}
                    />
                    <small style={{ color: '#6b7280', fontSize: '12px', marginTop: '4px', display: 'block' }}>
                      Система автоматически конвертирует в 5-балльную шкалу (90-100 = 5, 75-89 = 4, 60-74 = 3, 40-59 = 2, 0-39 = 1)
                    </small>
                  </div>
                  
                  <div className="modal-footer">
                    <button 
                      type="button" 
                      className="btn btn-secondary"
                      onClick={() => setShowModal(false)}
                    >
                      Отмена
                    </button>
                    <button 
                      type="submit" 
                      className="btn btn-primary"
                    >
                      {editingGrade ? 'Сохранить' : 'Добавить'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default TeacherGrades;