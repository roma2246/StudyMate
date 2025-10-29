import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import Table from '../../components/Table';
import { getGrades, createGrade, updateGrade, deleteGrade } from '../../services/api';

const TeacherGrades = () => {
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingGrade, setEditingGrade] = useState(null);
  const [filters, setFilters] = useState({
    subject: '',
    student: ''
  });
  
  const [formData, setFormData] = useState({
    studentId: '',
    subjectId: '',
    grade: '',
    date: ''
  });

  // Mock data for students and subjects
  const [students] = useState([
    { id: 1, name: 'Иван Иванов' },
    { id: 2, name: 'Мария Петрова' },
    { id: 3, name: 'Алексей Сидоров' },
    { id: 4, name: 'Елена Козлова' },
    { id: 5, name: 'Дмитрий Смирнов' }
  ]);

  const [subjects] = useState([
    { id: 1, name: 'Математика' },
    { id: 2, name: 'Физика' },
    { id: 3, name: 'Химия' },
    { id: 4, name: 'Биология' },
    { id: 5, name: 'Информатика' }
  ]);

  useEffect(() => {
    loadGrades();
  }, []);

  const loadGrades = async () => {
    try {
      setLoading(true);
      // In a real app, this would be an actual API call
      const mockGrades = [
        { id: 1, student: 'Иван Иванов', subject: 'Математика', grade: 5, date: '2023-10-15' },
        { id: 2, student: 'Мария Петрова', subject: 'Физика', grade: 4, date: '2023-10-14' },
        { id: 3, student: 'Алексей Сидоров', subject: 'Химия', grade: 3, date: '2023-10-13' },
        { id: 4, student: 'Елена Козлова', subject: 'Биология', grade: 5, date: '2023-10-12' },
        { id: 5, student: 'Дмитрий Смирнов', subject: 'Информатика', grade: 4, date: '2023-10-11' }
      ];
      setGrades(mockGrades);
    } catch (error) {
      console.error('Failed to load grades:', error);
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
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingGrade) {
        // Update existing grade
        await updateGrade(editingGrade.id, formData);
      } else {
        // Create new grade
        await createGrade(formData);
      }
      
      // Reset form and reload data
      setFormData({ studentId: '', subjectId: '', grade: '', date: '' });
      setEditingGrade(null);
      setShowModal(false);
      loadGrades();
    } catch (error) {
      console.error('Failed to save grade:', error);
    }
  };

  const handleEdit = (grade) => {
    // Find student and subject IDs
    const student = students.find(s => s.name === grade.student);
    const subject = subjects.find(s => s.name === grade.subject);
    
    setEditingGrade(grade);
    setFormData({
      studentId: student ? student.id : '',
      subjectId: subject ? subject.id : '',
      grade: grade.grade,
      date: grade.date
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Вы уверены, что хотите удалить эту оценку?')) {
      try {
        await deleteGrade(id);
        loadGrades();
      } catch (error) {
        console.error('Failed to delete grade:', error);
      }
    }
  };

  // Apply filters
  const filteredGrades = grades.filter(grade => {
    if (filters.subject && grade.subject !== filters.subject) return false;
    if (filters.student && grade.student !== filters.student) return false;
    return true;
  });

  const tableColumns = [
    { key: 'student', header: 'Студент' },
    { key: 'subject', header: 'Предмет' },
    { key: 'grade', header: 'Оценка' },
    { key: 'date', header: 'Дата' }
  ];

  const tableActions = [
    { name: 'edit', label: 'Редактировать', type: 'primary' },
    { name: 'delete', label: 'Удалить', type: 'danger' }
  ];

  const handleAction = (action, grade) => {
    switch (action) {
      case 'edit':
        handleEdit(grade);
        break;
      case 'delete':
        handleDelete(grade.id);
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
            <h1>Оценки</h1>
            <button 
              className="btn btn-primary"
              onClick={() => {
                setEditingGrade(null);
                setFormData({ studentId: '', subjectId: '', grade: '', date: '' });
                setShowModal(true);
              }}
            >
              + Добавить оценку
            </button>
          </div>
          
          <div className="page-filters">
            <div className="form-group">
              <select
                name="subject"
                value={filters.subject}
                onChange={handleFilterChange}
              >
                <option value="">Все предметы</option>
                {subjects.map(subject => (
                  <option key={subject.id} value={subject.name}>
                    {subject.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <select
                name="student"
                value={filters.student}
                onChange={handleFilterChange}
              >
                <option value="">Все студенты</option>
                {students.map(student => (
                  <option key={student.id} value={student.name}>
                    {student.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          {loading ? (
            <div className="loading">Загрузка...</div>
          ) : (
            <Table 
              columns={tableColumns}
              data={filteredGrades}
              actions={tableActions}
              onAction={handleAction}
            />
          )}
          
          {/* Modal for adding/editing grade */}
          {showModal && (
            <div className="modal-overlay">
              <div className="modal">
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
                      value={formData.studentId}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Выберите студента</option>
                      {students.map(student => (
                        <option key={student.id} value={student.id}>
                          {student.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="subjectId">Предмет</label>
                    <select
                      id="subjectId"
                      name="subjectId"
                      value={formData.subjectId}
                      onChange={handleInputChange}
                      required
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
                    <label htmlFor="grade">Оценка</label>
                    <select
                      id="grade"
                      name="grade"
                      value={formData.grade}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Выберите оценку</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                      <option value="5">5</option>
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="date">Дата</label>
                    <input
                      type="date"
                      id="date"
                      name="date"
                      value={formData.date}
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