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
  
  const [formData, setFormData] = useState({
    name: ''
  });

  useEffect(() => {
    loadSubjects();
  }, []);

  const loadSubjects = async () => {
    try {
      setLoading(true);
      // Получаем предметы из БД
      const subjectsData = await getSubjects();
      if (Array.isArray(subjectsData)) {
        // Получаем оценки для подсчета количества оценок по каждому предмету
        const grades = await getGrades();
        
        // Форматируем данные для отображения
        const formattedSubjects = subjectsData.map(subject => {
          // Подсчитываем количество оценок по этому предмету
          const gradesCount = Array.isArray(grades) 
            ? grades.filter(grade => grade.subject?.id === subject.id).length 
            : 0;
          
          return {
            id: subject.id,
            name: subject.name,
            gradesCount: gradesCount
          };
        });
        
        setSubjects(formattedSubjects);
      } else {
        setSubjects([]);
      }
    } catch (error) {
      console.error('Failed to load subjects:', error);
      setSubjects([]);
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
        await updateSubject(editingSubject.id, { name: formData.name });
      } else {
        // Create new subject - send only name, no ID
        await createSubject({ name: formData.name });
      }
      
      // Reset form and reload data
      setFormData({ name: '' });
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
      name: subject.name
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
    { key: 'id', header: 'ID', width: '10%' },
    { key: 'name', header: 'Название', width: '50%' },
    { key: 'gradesCount', header: 'Количество оценок', width: '40%' }
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
                setFormData({ name: '' });
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