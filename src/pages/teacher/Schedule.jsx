// src/pages/teacher/Schedule.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import { getStudents, getSubjects, getAllSchedules, createSchedule, updateSchedule, deleteSchedule, getScheduleByStudent } from '../../services/api';

const TeacherSchedule = () => {
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [formData, setFormData] = useState({
    studentId: '',
    subjectId: '',
    dayOfWeek: 1,
    startTime: '09:00',
    endTime: '10:30'
  });

  const navigate = useNavigate();

  const daysOfWeek = [
    { value: 1, label: 'Понедельник' },
    { value: 2, label: 'Вторник' },
    { value: 3, label: 'Среда' },
    { value: 4, label: 'Четверг' },
    { value: 5, label: 'Пятница' },
    { value: 6, label: 'Суббота' },
    { value: 7, label: 'Воскресенье' }
  ];

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (selectedStudent) {
      loadScheduleForStudent(selectedStudent);
    }
  }, [selectedStudent]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [studentsData, subjectsData] = await Promise.all([
        getStudents(),
        getSubjects()
      ]);
      setStudents(studentsData);
      setSubjects(subjectsData);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadScheduleForStudent = async (studentId) => {
    try {
      const scheduleData = await getScheduleByStudent(studentId);
      setSchedules(scheduleData);
    } catch (error) {
      console.error('Failed to load schedule:', error);
      setSchedules([]);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'studentId' || name === 'subjectId' || name === 'dayOfWeek' ? Number(value) : value
    }));
  };

  const handleStudentSelect = (e) => {
    const studentId = Number(e.target.value);
    setSelectedStudent(studentId || null);
    if (studentId) {
      setFormData(prev => ({ ...prev, studentId }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingSchedule) {
        await updateSchedule(editingSchedule.id, formData);
      } else {
        await createSchedule(formData);
      }
      
      setFormData({
        studentId: selectedStudent || '',
        subjectId: '',
        dayOfWeek: 1,
        startTime: '09:00',
        endTime: '10:30'
      });
      setEditingSchedule(null);
      setShowModal(false);
      if (selectedStudent) {
        loadScheduleForStudent(selectedStudent);
      }
    } catch (error) {
      console.error('Failed to save schedule:', error);
      alert('Ошибка при сохранении расписания: ' + (error.message || 'Неизвестная ошибка'));
    }
  };

  const handleEdit = (schedule) => {
    setEditingSchedule(schedule);
    setFormData({
      studentId: schedule.student?.id || selectedStudent || '',
      subjectId: schedule.subject?.id || '',
      dayOfWeek: schedule.dayOfWeek || 1,
      startTime: schedule.startTime || '09:00',
      endTime: schedule.endTime || '10:30'
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Вы уверены, что хотите удалить это занятие из расписания?')) {
      try {
        await deleteSchedule(id);
        if (selectedStudent) {
          loadScheduleForStudent(selectedStudent);
        }
      } catch (error) {
        console.error('Failed to delete schedule:', error);
        alert('Ошибка при удалении расписания');
      }
    }
  };

  const getSubjectName = (subjectId) => {
    const subject = subjects.find(s => s.id === subjectId);
    return subject ? subject.name : 'Неизвестно';
  };

  const getStudentName = (studentId) => {
    const student = students.find(s => s.id === studentId);
    return student?.user?.name || 'Неизвестно';
  };

  const groupedSchedule = schedules.reduce((acc, item) => {
    const day = item.dayOfWeek || 1;
    if (!acc[day]) acc[day] = [];
    acc[day].push(item);
    return acc;
  }, {});

  return (
    <div className="app">
      <Navbar role="teacher" />
      <div className="app-body">
        <Sidebar role="teacher" />
        <main className="main-content">
          <div className="page-header">
            <h1>Расписание</h1>
            <button 
              className="btn btn-primary"
              onClick={() => {
                if (!selectedStudent) {
                  alert('Сначала выберите студента');
                  return;
                }
                setEditingSchedule(null);
                setFormData({
                  studentId: selectedStudent,
                  subjectId: '',
                  dayOfWeek: 1,
                  startTime: '09:00',
                  endTime: '10:30'
                });
                setShowModal(true);
              }}
            >
              + Добавить занятие
            </button>
          </div>
          
          <div className="page-filters" style={{ marginBottom: '24px' }}>
            <div className="form-group">
              <label style={{ marginBottom: '8px', display: 'block', fontWeight: '600' }}>
                Выберите студента:
              </label>
              <select
                value={selectedStudent || ''}
                onChange={handleStudentSelect}
                style={{
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid #e5e7eb',
                  fontSize: '16px',
                  minWidth: '300px'
                }}
              >
                <option value="">-- Выберите студента --</option>
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
          ) : !selectedStudent ? (
            <div style={{ 
              padding: '48px', 
              textAlign: 'center', 
              color: '#6b7280',
              background: '#f9fafb',
              borderRadius: '12px'
            }}>
              <p style={{ fontSize: '18px' }}>Выберите студента для просмотра и редактирования расписания</p>
            </div>
          ) : (
            <div>
              <h2 style={{ marginBottom: '24px' }}>
                Расписание для: {getStudentName(selectedStudent)}
              </h2>
              
              {Object.keys(groupedSchedule).length === 0 ? (
                <div style={{ 
                  padding: '48px', 
                  textAlign: 'center', 
                  color: '#6b7280',
                  background: '#f9fafb',
                  borderRadius: '12px'
                }}>
                  <p>Расписание пусто. Добавьте первое занятие.</p>
                </div>
              ) : (
                <div style={{ display: 'grid', gap: '16px' }}>
                  {daysOfWeek.map(day => {
                    const daySchedule = groupedSchedule[day.value] || [];
                    if (daySchedule.length === 0) return null;
                    
                    return (
                      <div key={day.value} style={{
                        border: '1px solid #e5e7eb',
                        borderRadius: '12px',
                        overflow: 'hidden'
                      }}>
                        <div style={{
                          background: '#f3f4f6',
                          padding: '16px',
                          fontWeight: '600',
                          fontSize: '18px',
                          borderBottom: '1px solid #e5e7eb'
                        }}>
                          {day.label}
                        </div>
                        <div style={{ padding: '16px' }}>
                          {daySchedule.map(item => (
                            <div key={item.id} style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              padding: '12px',
                              marginBottom: '8px',
                              background: '#f9fafb',
                              borderRadius: '8px'
                            }}>
                              <div>
                                <div style={{ fontWeight: '600', marginBottom: '4px' }}>
                                  {getSubjectName(item.subject?.id)}
                                </div>
                                <div style={{ color: '#6b7280', fontSize: '14px' }}>
                                  {item.startTime} - {item.endTime}
                                </div>
                              </div>
                              <div style={{ display: 'flex', gap: '8px' }}>
                                <button
                                  onClick={() => handleEdit(item)}
                                  style={{
                                    padding: '8px 16px',
                                    background: '#3b82f6',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '6px',
                                    cursor: 'pointer'
                                  }}
                                >
                                  Редактировать
                                </button>
                                <button
                                  onClick={() => handleDelete(item.id)}
                                  style={{
                                    padding: '8px 16px',
                                    background: '#ef4444',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '6px',
                                    cursor: 'pointer'
                                  }}
                                >
                                  Удалить
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
          
          {/* Modal for adding/editing schedule */}
          {showModal && (
            <div className="modal-overlay" onClick={() => setShowModal(false)}>
              <div className="modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                  <h2>{editingSchedule ? 'Редактировать занятие' : 'Добавить занятие'}</h2>
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
                      disabled={!!editingSchedule}
                      style={{ padding: '12px', borderRadius: '8px', border: '1px solid #e5e7eb', width: '100%' }}
                    >
                      <option value="">-- Выберите студента --</option>
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
                      value={formData.subjectId}
                      onChange={handleInputChange}
                      required
                      style={{ padding: '12px', borderRadius: '8px', border: '1px solid #e5e7eb', width: '100%' }}
                    >
                      <option value="">-- Выберите предмет --</option>
                      {subjects.map(subject => (
                        <option key={subject.id} value={subject.id}>
                          {subject.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="dayOfWeek">День недели</label>
                    <select
                      id="dayOfWeek"
                      name="dayOfWeek"
                      value={formData.dayOfWeek}
                      onChange={handleInputChange}
                      required
                      style={{ padding: '12px', borderRadius: '8px', border: '1px solid #e5e7eb', width: '100%' }}
                    >
                      {daysOfWeek.map(day => (
                        <option key={day.value} value={day.value}>
                          {day.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="startTime">Время начала</label>
                    <input
                      type="time"
                      id="startTime"
                      name="startTime"
                      value={formData.startTime}
                      onChange={handleInputChange}
                      required
                      style={{ padding: '12px', borderRadius: '8px', border: '1px solid #e5e7eb', width: '100%' }}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="endTime">Время окончания</label>
                    <input
                      type="time"
                      id="endTime"
                      name="endTime"
                      value={formData.endTime}
                      onChange={handleInputChange}
                      required
                      style={{ padding: '12px', borderRadius: '8px', border: '1px solid #e5e7eb', width: '100%' }}
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
                      {editingSchedule ? 'Сохранить' : 'Добавить'}
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

export default TeacherSchedule;
