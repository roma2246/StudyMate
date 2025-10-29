import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import Table from '../../components/Table';
import { getSubjects, createSubject, updateSubject, deleteSubject } from '../../services/api';

const TeacherSubjects = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    teacher: ''
  });

  useEffect(() => {
    loadSubjects();
  }, []);

  const loadSubjects = async () => {
    try {
      setLoading(true);
      // In a real app, this would be an actual API call
      const mockSubjects = [
        { id: 1, name: 'Математика', teacher: 'Иванов И.И.', gradesCount: 25 },
        { id: 2, name: 'Физика', teacher: 'Петрова М.А.', gradesCount: 20 },
        { id: 3, name: 'Химия', teacher: 'Сидоров А.С.', gradesCount: 18 },
        { id: 4, name: 'Биология', teacher: 'Козлова Е.В.', gradesCount: 22 },
        { id: 5, name: 'Информатика', teacher: 'Смирнов Д.А.', gradesCount: 30 }
      ];
      setSubjects(mockSubjects);
    } catch (error) {
      console.error('Failed to load subjects:', error);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingSubject) {
        // Update existing subject
        await updateSubject(editingSubject.id, formData);
      } else {
        // Create new subject
        await createSubject(formData);
      }
      
      // Reset form and reload data
      setFormData({ name: '', teacher: '' });
      setEditingSubject(null);
      setShowModal(false);
      loadSubjects();
    } catch (error) {
      console.error('Failed to save subject:', error);
    }
  };

  const handleEdit = (subject) => {
    setEditingSubject(subject);
    setFormData({
      name: subject.name,
      teacher: subject.teacher
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Вы уверены, что хотите удалить этот предмет?')) {
      try {
        await deleteSubject(id);
        loadSubjects();
      } catch (error) {
        console.error('Failed to delete subject:', error);
      }
    }
  };

  const tableColumns = [
    { key: 'name', header: 'Название' },
    { key: 'teacher', header: 'Преподаватель' },
    { key: 'gradesCount', header: 'Количество оценок' }
  ];

  const tableActions = [
    { name: 'edit', label: 'Редактировать', type: 'primary' },
    { name: 'delete', label: 'Удалить', type: 'danger' }
  ];

  const handleAction = (action, subject) => {
    switch (action) {
      case 'edit':
        handleEdit(subject);
        break;
      case 'delete':
        handleDelete(subject.id);
        break;
      default:
        break;
    }
  };

  return (
    <div className="app">
      <Navbar role="teacher" />
      <div className="app-body">
        <Sidebar role="teacher" />
        <main className="main-content">
          <div className="page-header">
            <h1>Предметы</h1>
            <button 
              className="btn btn-primary"
              onClick={() => {
                setEditingSubject(null);
                setFormData({ name: '', teacher: '' });
                setShowModal(true);
              }}
            >
              + Добавить предмет
            </button>
          </div>
          
          {loading ? (
            <div className="loading">Загрузка...</div>
          ) : (
            <Table 
              columns={tableColumns}
              data={subjects}
              actions={tableActions}
              onAction={handleAction}
            />
          )}
          
          {/* Modal for adding/editing subject */}
          {showModal && (
            <div className="modal-overlay">
              <div className="modal">
                <div className="modal-header">
                  <h2>{editingSubject ? 'Редактировать предмет' : 'Добавить предмет'}</h2>
                  <button 
                    className="modal-close"
                    onClick={() => setShowModal(false)}
                  >
                    ×
                  </button>
                </div>
                <form onSubmit={handleSubmit} className="modal-body">
                  <div className="form-group">
                    <label htmlFor="name">Название</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="teacher">Преподаватель</label>
                    <input
                      type="text"
                      id="teacher"
                      name="teacher"
                      value={formData.teacher}
                      onChange={handleInputChange}
                      required
                    />
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
                      {editingSubject ? 'Сохранить' : 'Добавить'}
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

export default TeacherSubjects;