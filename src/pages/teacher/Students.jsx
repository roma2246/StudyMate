import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import Table from '../../components/Table';
import { getStudents, createStudent, updateStudent, deleteStudent } from '../../services/api';

const TeacherStudents = () => {
  const [students, setStudents] = useState([]);
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
  }, []);

  const loadStudents = async () => {
    try {
      setLoading(true);
      // In a real app, this would be an actual API call
      const mockStudents = [
        { id: 1, name: 'Иван Иванов', group: 'Группа 1' },
        { id: 2, name: 'Мария Петрова', group: 'Группа 2' },
        { id: 3, name: 'Алексей Сидоров', group: 'Группа 1' },
        { id: 4, name: 'Елена Козлова', group: 'Группа 3' },
        { id: 5, name: 'Дмитрий Смирнов', group: 'Группа 2' }
      ];
      setStudents(mockStudents);
    } catch (error) {
      console.error('Failed to load students:', error);
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
      if (editingStudent) {
        // Update existing student
        await updateStudent(editingStudent.id, formData);
      } else {
        // Create new student
        await createStudent(formData);
      }
      
      // Reset form and reload data
      setFormData({ name: '', group: '' });
      setEditingStudent(null);
      setShowModal(false);
      loadStudents();
    } catch (error) {
      console.error('Failed to save student:', error);
    }
  };

  const handleEdit = (student) => {
    setEditingStudent(student);
    setFormData({
      name: student.name,
      group: student.group
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
    { key: 'id', header: 'ID' },
    { key: 'name', header: 'ФИО' },
    { key: 'group', header: 'Группа' }
  ];

  const tableActions = [
    { name: 'view', label: 'Успеваемость', type: 'secondary' },
    { name: 'edit', label: 'Редактировать', type: 'primary' },
    { name: 'delete', label: 'Удалить', type: 'danger' }
  ];

  const handleAction = (action, student) => {
    switch (action) {
      case 'view':
        handleViewProgress(student);
        break;
      case 'edit':
        handleEdit(student);
        break;
      case 'delete':
        handleDelete(student.id);
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
            <h1>Студенты</h1>
            <button 
              className="btn btn-primary"
              onClick={() => {
                setEditingStudent(null);
                setFormData({ name: '', group: '' });
                setShowModal(true);
              }}
            >
              + Добавить студента
            </button>
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
                  <h2>{editingStudent ? 'Редактировать студента' : 'Добавить студента'}</h2>
                  <button 
                    className="modal-close"
                    onClick={() => setShowModal(false)}
                  >
                    ×
                  </button>
                </div>
                <form onSubmit={handleSubmit} className="modal-body">
                  <div className="form-group">
                    <label htmlFor="name">ФИО</label>
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
                    <label htmlFor="group">Группа</label>
                    <input
                      type="text"
                      id="group"
                      name="group"
                      value={formData.group}
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