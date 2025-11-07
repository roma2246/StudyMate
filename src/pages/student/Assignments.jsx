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
    if (user) {
      loadAssignments(user.id);
    }
  }, []);

  const loadAssignments = async (userId) => {
    try {
      setLoading(true);
      const [assignmentsData, submissionsData] = await Promise.all([
        getAssignmentsByStudent(userId),
        getSubmissionsByStudent(userId)
      ]);
      setAssignments(Array.isArray(assignmentsData) ? assignmentsData : []);
      
      const submissionsMap = {};
      if (Array.isArray(submissionsData)) {
        submissionsData.forEach(sub => {
          submissionsMap[sub.assignment?.id] = sub;
        });
      }
      setSubmissions(submissionsMap);
    } catch (error) {
      console.error('Failed to load assignments:', error);
      setAssignments([]);
      setSubmissions({});
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (assignment) => {
    setSelectedAssignment(assignment);
    setAnswerText('');
    setFile(null);
    setShowModal(true);
  };

  const handleSubmitAnswer = async (e) => {
    e.preventDefault();
    if (!selectedAssignment) return;
    
    if (!answerText.trim() && !file) {
      alert('Пожалуйста, введите текст ответа или загрузите файл');
      return;
    }

    try {
      const user = getCurrentUser();
      // Найдем student.id через user
      await createSubmission(
        selectedAssignment.id,
        selectedAssignment.student.id,
        answerText.trim(),
        file
      );
      setShowModal(false);
      setAnswerText('');
      setFile(null);
      setSelectedAssignment(null);
      if (user) loadAssignments(user.id);
      alert('Ответ успешно отправлен!');
    } catch (error) {
      console.error('Failed to submit answer:', error);
      alert('Ошибка при отправке ответа: ' + (error.message || 'Неизвестная ошибка'));
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString('ru-RU', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', minHeight: '100vh' }}>
        <Sidebar />
        <div style={{ flex: 1 }}>
          <Navbar />
          <div style={{ padding: '20px', textAlign: 'center' }}>
            <p>Загрузка...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <div style={{ flex: 1 }}>
        <Navbar />
        <div style={{ padding: '20px' }}>
          <h2>Мои задания</h2>
          {assignments.length === 0 ? (
            <p>Пока нет заданий</p>
          ) : (
            <div style={{ marginTop: '20px' }}>
              {assignments.map((assignment) => {
                const submission = submissions[assignment.id];
                const hasSubmission = !!submission;
                
                return (
                  <div key={assignment.id} style={{
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    padding: '16px',
                    marginBottom: '16px',
                    backgroundColor: '#f9f9f9'
                  }}>
                    <h3 style={{ margin: '0 0 8px 0' }}>{assignment.title}</h3>
                    <p style={{ margin: '4px 0', color: '#666' }}>
                      <strong>Предмет:</strong> {assignment.subject?.name || 'Не указан'}
                    </p>
                    <p style={{ margin: '4px 0' }}>
                      <strong>Описание:</strong> {assignment.description}
                    </p>
                    <p style={{ margin: '4px 0', color: '#666' }}>
                      <strong>Дедлайн:</strong> {formatDate(assignment.deadline)}
                    </p>
                    <p style={{ margin: '4px 0', color: '#666', fontSize: '0.9em' }}>
                      Создано: {formatDate(assignment.createdAt)}
                    </p>
                    
                    {hasSubmission ? (
                      <div style={{ marginTop: '12px', padding: '12px', backgroundColor: '#e8f5e9', borderRadius: '4px' }}>
                        <p style={{ margin: 0, color: '#2e7d32', fontWeight: 'bold' }}>✓ Ответ отправлен</p>
                        {submission.answerText && (
                          <p style={{ margin: '8px 0 0 0', color: '#555' }}>
                            <strong>Текст:</strong> {submission.answerText}
                          </p>
                        )}
                        {submission.fileName && (
                          <p style={{ margin: '8px 0 0 0' }}>
                            <a href={`http://localhost:8080/api/assignment-submissions/${submission.id}/file`} 
                               target="_blank" rel="noopener noreferrer" 
                               style={{ color: '#1976d2', textDecoration: 'none' }}>
                              📎 {submission.fileName}
                            </a>
                          </p>
                        )}
                        {submission.grade != null && (
                          <div style={{ 
                            marginTop: '12px', 
                            padding: '8px 12px', 
                            backgroundColor: '#fff3cd', 
                            borderRadius: '4px',
                            border: '1px solid #ffc107'
                          }}>
                            <p style={{ margin: 0, color: '#856404', fontWeight: 'bold' }}>
                              ⭐ Оценка: {submission.grade}/100
                            </p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <button 
                        onClick={() => handleOpenModal(assignment)}
                        style={{
                          marginTop: '12px',
                          padding: '10px 20px',
                          backgroundColor: '#1976d2',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '14px'
                        }}
                      >
                        Ответить на задание
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Модальное окно для отправки ответа */}
      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            padding: '24px',
            maxWidth: '600px',
            width: '90%',
            maxHeight: '80vh',
            overflow: 'auto'
          }}>
            <h3 style={{ margin: '0 0 16px 0' }}>Ответить на задание</h3>
            <p style={{ margin: '0 0 16px 0', color: '#666' }}>
              <strong>{selectedAssignment?.title}</strong>
            </p>
            
            <form onSubmit={handleSubmitAnswer}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                  Текстовый ответ:
                </label>
                <textarea
                  value={answerText}
                  onChange={(e) => setAnswerText(e.target.value)}
                  placeholder="Введите ваш ответ здесь..."
                  rows="6"
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '14px',
                    fontFamily: 'inherit',
                    resize: 'vertical'
                  }}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                  Или загрузите файл:
                </label>
                <input
                  type="file"
                  accept=".doc,.docx,.pdf,.ppt,.pptx,.txt,.jpg,.jpeg,.png"
                  onChange={(e) => setFile(e.target.files[0])}
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #ddd',
                    borderRadius: '4px'
                  }}
                />
                <p style={{ margin: '8px 0 0 0', fontSize: '12px', color: '#666' }}>
                  Поддерживаемые форматы: Word, PDF, PowerPoint, текст, изображения
                </p>
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setSelectedAssignment(null);
                    setAnswerText('');
                    setFile(null);
                  }}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#f5f5f5',
                    color: '#333',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#1976d2',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  Отправить ответ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentAssignments;


