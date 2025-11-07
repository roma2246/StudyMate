import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import Table from '../../components/Table';
import { getStudents, createStudent, updateStudent, deleteStudent, getStudentGroups } from '../../services/api';

const TeacherStudents = () => {
  const [students, setStudents] = useState([]);
  const [availableGroups, setAvailableGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    group: ''
  });
  
  const navigate = useNavigate();

  useEffect(() => {
    loadStudents();
    loadGroups();
  }, []);

  const loadStudents = async () => {
    try {
      setLoading(true);
      // Получаем студентов из БД
      const studentsData = await getStudents();
      if (Array.isArray(studentsData)) {
        // Преобразуем данные из БД в формат для отображения
        const formattedStudents = studentsData.map(student => ({
          id: student.id,
          name: student.user?.name || `Студент #${student.id}`,
          group: student.group || 'Не указана'
        }));
        setStudents(formattedStudents);
      } else {
        setStudents([]);
      }
    } catch (error) {
      console.error('Failed to load students:', error);
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  const loadGroups = async () => {
    try {
      const groups = await getStudentGroups();
      setAvailableGroups(Array.isArray(groups) ? groups : []);
    } catch (error) {
      console.error('Failed to load groups:', error);
      setAvailableGroups([]);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectGroup = (group) => {
    setFormData(prev => ({
      ...prev,
      group: group
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!editingStudent) {
      alert('Создание студентов происходит через регистрацию. Пожалуйста, попросите студента зарегистрироваться.');
      setShowModal(false);
      return;
    }
    
    // Валидация: группа должна быть введена
    if (!formData.group || formData.group.trim() === '') {
      alert('Пожалуйста, введите группу');
      return;
    }
    
    try {
      // Update existing student - отправляем только group (name хранится в User)
      await updateStudent(editingStudent.id, { group: formData.group.trim() });
      alert('Группа студента успешно обновлена!');
      
      // Reset form and reload data
      setFormData({ name: '', group: '' });
      setEditingStudent(null);
      setShowModal(false);
      loadStudents();
      loadGroups(); // Обновляем список групп после сохранения
    } catch (error) {
      console.error('Failed to save student:', error);
      alert('Ошибка при сохранении: ' + (error.message || 'Неизвестная ошибка'));
    }
  };
  
  const handleCloseModal = () => {
    setFormData({ name: '', group: '' });
    setEditingStudent(null);
    setShowModal(false);
  };

  const handleEdit = (student) => {
    setEditingStudent(student);
    const currentGroup = student.group === 'Не указана' ? '' : (student.group || '');
    
    setFormData({
      name: student.name,
      group: currentGroup
    });
    
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Вы уверены, что хотите удалить этого студента?')) {
      try {
        await deleteStudent(id);
        loadStudents();
      } catch (error) {
        console.error('Failed to delete student:', error);
      }
    }
  };

  const handleViewProgress = (student) => {
    // In a real app, this would navigate to the student's progress page
    alert(`Просмотр успеваемости студента: ${student.name}`);
  };

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.group.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const tableColumns = [
    { key: 'id', header: 'ID', width: '10%' },
    { key: 'name', header: 'ФИО', width: '60%' },
    { key: 'group', header: 'Группа', width: '30%' }
  ];

  const tableActions = [
    { name: 'edit', label: 'Выставить группу', type: 'primary' }
  ];

  const handleAction = (action, student) => {
    if (action === 'edit') {
      handleEdit(student);
    }
  };

  return (
    <div className="app">
      <Navbar role="teacher" />
      <div className="app-body">
        <Sidebar role="teacher" />
        <main className="main-content">
          <div className="page-header">
            <h1>Студенты</h1>
            <p style={{ fontSize: '0.875rem', color: '#64748b', margin: '0.5rem 0 0 0' }}>
              Создание студентов происходит через регистрацию. Здесь можно редактировать группу существующих студентов.
            </p>
          </div>
          
          <div className="page-filters">
            <div className="form-group">
              <input
                type="text"
                placeholder="Поиск по имени или группе..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          {loading ? (
            <div className="loading">Загрузка...</div>
          ) : (
            <Table 
              columns={tableColumns}
              data={filteredStudents}
              actions={tableActions}
              onAction={handleAction}
            />
          )}
          
          {/* Modal for adding/editing student */}
          {showModal && (
            <div className="modal-overlay">
              <div className="modal">
                <div className="modal-header">
                  <h2>{editingStudent ? `Выставить группу: ${editingStudent.name}` : 'Добавить студента'}</h2>
                  <button 
                    className="modal-close"
                    onClick={handleCloseModal}
                  >
                    ×
                  </button>
                </div>
                <form onSubmit={handleSubmit} className="modal-body">
                  {editingStudent && (
                    <div className="form-group">
                      <label htmlFor="name">ФИО</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        style={{ backgroundColor: '#f9fafb', cursor: 'not-allowed' }}
                        disabled
                      />
                      <p style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '0.25rem' }}>
                        Имя нельзя изменить (хранится в профиле пользователя)
                      </p>
                    </div>
                  )}
                  
                  <div className="form-group">
                    <label htmlFor="group">Группа</label>
                    <input
                      type="text"
                      id="group"
                      name="group"
                      value={formData.group}
                      onChange={handleInputChange}
                      placeholder="Введите название группы (например: ИС-21, ФИИТ-3, Группа 1)"
                      required
                      style={{
                        width: '100%',
                        padding: '0.5rem',
                        fontSize: '1rem',
                        border: '1px solid #ddd',
                        borderRadius: '4px'
                      }}
                    />
                    {availableGroups.length > 0 && (
                      <div style={{ marginTop: '0.5rem' }}>
                        <p style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.5rem' }}>
                          Или выберите из существующих:
                        </p>
                        <div style={{ 
                          display: 'flex', 
                          flexWrap: 'wrap', 
                          gap: '0.5rem',
                          marginTop: '0.5rem'
                        }}>
                          {availableGroups.map((group) => (
                            <button
                              key={group}
                              type="button"
                              onClick={() => handleSelectGroup(group)}
                              style={{
                                padding: '0.375rem 0.75rem',
                                fontSize: '0.75rem',
                                backgroundColor: formData.group === group ? '#3b82f6' : '#f3f4f6',
                                color: formData.group === group ? 'white' : '#374151',
                                border: '1px solid #e5e7eb',
                                borderRadius: '0.375rem',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease'
                              }}
                            >
                              {group}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="modal-footer">
                    <button 
                      type="button" 
                      className="btn btn-secondary"
                      onClick={handleCloseModal}
                    >
                      Отмена
                    </button>
                    <button 
                      type="submit" 
                      className="btn btn-primary"
                    >
                      {editingStudent ? 'Сохранить' : 'Добавить'}
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

export default TeacherStudents;