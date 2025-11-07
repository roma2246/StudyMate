import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import { getAssignmentsByTeacher, getStudents, getSubjects, createAssignment, deleteAssignment, getSubmissionsByAssignment, setSubmissionGrade } from '../../services/api';
import { getCurrentUser } from '../../services/auth';

const TeacherAssignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [submissions, setSubmissions] = useState({});
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showGradeModal, setShowGradeModal] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [gradeValue, setGradeValue] = useState('');
  const [formData, setFormData] = useState({
    studentId: '',
    subjectId: '',
    title: '',
    description: '',
    deadline: ''
  });

  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      loadData(user.id);
    }
  }, []);

  const loadData = async (userId) => {
    try {
      setLoading(true);
      const [assignmentsData, studentsData, subjectsData] = await Promise.all([
        getAssignmentsByTeacher(userId),
        getStudents(),
        getSubjects()
      ]);
      setAssignments(Array.isArray(assignmentsData) ? assignmentsData : []);
      setStudents(Array.isArray(studentsData) ? studentsData : []);
      setSubjects(Array.isArray(subjectsData) ? subjectsData : []);
      
      const submissionsMap = {};
      if (Array.isArray(assignmentsData)) {
        for (const assignment of assignmentsData) {
          try {
            const subs = await getSubmissionsByAssignment(assignment.id);
            submissionsMap[assignment.id] = Array.isArray(subs) ? subs : [];
          } catch (error) {
            submissionsMap[assignment.id] = [];
          }
        }
      }
      setSubmissions(submissionsMap);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = getCurrentUser();
      await createAssignment({
        teacherId: user.id,
        studentId: Number(formData.studentId),
        subjectId: Number(formData.subjectId),
        title: formData.title,
        description: formData.description,
        deadline: formData.deadline
      });
      setShowModal(false);
      setFormData({ studentId: '', subjectId: '', title: '', description: '', deadline: '' });
      if (user) loadData(user.id);
    } catch (error) {
      alert('Ошибка: ' + error.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Удалить задание?')) return;
    try {
      await deleteAssignment(id);
      const user = getCurrentUser();
      if (user) loadData(user.id);
    } catch (error) {
      alert('Ошибка удаления');
    }
  };

  const handleOpenGradeModal = (submission, assignment) => {
    setSelectedSubmission({ ...submission, assignment });
    setGradeValue('');
    setShowGradeModal(true);
  };

  const handleSaveGrade = async (e) => {
    e.preventDefault();
    if (!selectedSubmission || !gradeValue) {
      alert('Пожалуйста, введите оценку');
      return;
    }

    const value = Number(gradeValue);
    if (isNaN(value) || value < 0 || value > 100) {
      alert('Оценка должна быть числом от 0 до 100');
      return;
    }

    try {
      await setSubmissionGrade(selectedSubmission.id, value);
      setShowGradeModal(false);
      setSelectedSubmission(null);
      setGradeValue('');
      const user = getCurrentUser();
      if (user) loadData(user.id);
      alert('Оценка успешно сохранена!');
    } catch (error) {
      console.error('Failed to save grade:', error);
      alert('Ошибка при сохранении оценки: ' + (error.message || 'Неизвестная ошибка'));
    }
  };

  if (loading) {
    return (
      <div style={styles.app}>
        <Sidebar role="teacher" />
        <div style={styles.contentArea}>
          <Navbar role="teacher" />
          <div style={styles.loadingContainer}>
            <div style={styles.spinner}></div>
            <p style={styles.loadingText}>Загрузка...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.app}>
      <Sidebar role="teacher" />
      <div style={styles.contentArea}>
        <Navbar role="teacher" />
        <div style={styles.mainContent}>
          <div style={styles.pageHeader}>
            <h1 style={styles.pageTitle}>Задания</h1>
            <button
              onClick={() => setShowModal(true)}
              style={styles.createButton}
            >
              + Создать задание
            </button>
          </div>

          <div style={styles.assignmentsCard}>
            {assignments.length === 0 ? (
              <div style={styles.emptyState}>
                <p style={styles.emptyText}>Нет заданий</p>
              </div>
            ) : (
              assignments.map(assignment => (
                <div key={assignment.id} style={styles.assignmentItem}>
                  <div style={styles.assignmentContent}>
                    <div style={styles.assignmentHeader}>
                      <h3 style={styles.assignmentTitle}>{assignment.title}</h3>
                      <button
                        onClick={() => handleDelete(assignment.id)}
                        style={styles.deleteButton}
                      >
                        Удалить задание
                      </button>
                    </div>
                    <p style={styles.assignmentInfo}>Студент: {assignment.student?.user?.name || 'Неизвестно'}</p>
                    <p style={styles.assignmentInfo}>Предмет: {assignment.subject?.name || 'Неизвестно'}</p>
                    <p style={styles.assignmentInfo}>Дедлайн: {new Date(assignment.deadline).toLocaleString('ru-RU')}</p>
                    <p style={styles.assignmentDescription}>Описание: {assignment.description}</p>
                    
                    {/* Список ответов студентов */}
                    <div style={styles.submissionsSection}>
                      <h4 style={styles.submissionsTitle}>
                        Ответы студентов ({(submissions[assignment.id] || []).length})
                      </h4>
                      {(!submissions[assignment.id] || submissions[assignment.id].length === 0) ? (
                        <p style={styles.noSubmissionsText}>Пока нет ответов</p>
                      ) : (
                        <div style={styles.submissionsList}>
                          {submissions[assignment.id].map(submission => (
                            <div key={submission.id} style={styles.submissionItem}>
                              <div style={styles.submissionHeader}>
                                <div>
                                  <p style={styles.submissionStudent}>
                                    <strong>{submission.student?.user?.name || 'Неизвестный студент'}</strong>
                                  </p>
                                  <p style={styles.submissionDate}>
                                    Отправлено: {new Date(submission.submittedAt).toLocaleString('ru-RU')}
                                  </p>
                                  {submission.grade != null && (
                                    <div style={{ 
                                      marginTop: '8px', 
                                      padding: '6px 12px', 
                                      backgroundColor: '#e8f5e9', 
                                      borderRadius: '6px',
                                      display: 'inline-block'
                                    }}>
                                      <span style={{ color: '#2e7d32', fontWeight: 'bold' }}>
                                        ✓ Оценка: {submission.grade}/100
                                      </span>
                                    </div>
                                  )}
                                </div>
                                {submission.grade == null ? (
                                  <button
                                    onClick={() => handleOpenGradeModal(submission, assignment)}
                                    style={styles.gradeButton}
                                  >
                                    ⭐ Выставить оценку
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => {
                                      setSelectedSubmission(submission);
                                      setGradeValue(submission.grade.toString());
                                      setShowGradeModal(true);
                                    }}
                                    style={{ ...styles.gradeButton, backgroundColor: '#4caf50' }}
                                  >
                                    📝 Изменить оценку
                                  </button>
                                )}
                              </div>
                              
                              {submission.answerText && (
                                <div style={styles.submissionAnswer}>
                                  <p style={styles.answerLabel}>Текст ответа:</p>
                                  <p style={styles.answerText}>{submission.answerText}</p>
                                </div>
                              )}
                              
                              {submission.fileName && (
                                <div style={styles.submissionFile}>
                                  <p style={styles.fileLabel}>Файл:</p>
                                  <a
                                    href={`http://localhost:8080/api/assignment-submissions/${submission.id}/file`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={styles.fileLink}
                                  >
                                    📎 {submission.fileName}
                                  </a>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {showModal && (
        <div style={styles.modalOverlay} onClick={() => setShowModal(false)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h2 style={styles.modalTitle}>Создать задание</h2>
            <form onSubmit={handleSubmit}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Студент</label>
                <select
                  value={formData.studentId}
                  onChange={(e) => setFormData({...formData, studentId: e.target.value})}
                  style={styles.select}
                  required
                >
                  <option value="">Выберите студента</option>
                  {students.map(s => (
                    <option key={s.id} value={s.id}>{s.user?.name || `Студент #${s.id}`}</option>
                  ))}
                </select>
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Предмет</label>
                <select
                  value={formData.subjectId}
                  onChange={(e) => setFormData({...formData, subjectId: e.target.value})}
                  style={styles.select}
                  required
                >
                  <option value="">Выберите предмет</option>
                  {subjects.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Название</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  style={styles.input}
                  required
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Описание</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  style={styles.textarea}
                  rows="4"
                  required
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Дедлайн</label>
                <input
                  type="datetime-local"
                  value={formData.deadline}
                  onChange={(e) => setFormData({...formData, deadline: e.target.value})}
                  style={styles.input}
                  required
                />
              </div>
              <div style={styles.modalActions}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={styles.cancelButton}
                >
                  Отмена
                </button>
                <button type="submit" style={styles.submitModalButton}>
                  Создать
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showGradeModal && selectedSubmission && (
        <div style={styles.modalOverlay} onClick={() => {
          setShowGradeModal(false);
          setSelectedSubmission(null);
          setGradeValue('');
        }}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h2 style={styles.modalTitle}>Выставить оценку</h2>
            <div style={styles.gradeModalInfo}>
              <p style={styles.gradeInfoText}>
                <strong>Студент:</strong> {selectedSubmission.student?.user?.name || 'Неизвестно'}
              </p>
              <p style={styles.gradeInfoText}>
                <strong>Задание:</strong> {selectedSubmission.assignment?.title || 'Неизвестно'}
              </p>
              <p style={styles.gradeInfoText}>
                <strong>Предмет:</strong> {selectedSubmission.assignment?.subject?.name || 'Неизвестно'}
              </p>
              
              {selectedSubmission.answerText && (
                <div style={styles.submissionPreview}>
                  <p style={styles.answerLabel}>Ответ студента:</p>
                  <div style={styles.answerPreviewBox}>
                    <p style={styles.answerPreviewText}>{selectedSubmission.answerText}</p>
                  </div>
                </div>
              )}
              
              {selectedSubmission.fileName && (
                <div style={styles.submissionPreview}>
                  <p style={styles.fileLabel}>Файл:</p>
                  <a
                    href={`http://localhost:8080/api/assignment-submissions/${selectedSubmission.id}/file`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={styles.fileLink}
                  >
                    📎 {selectedSubmission.fileName}
                  </a>
                </div>
              )}
            </div>
            
            <form onSubmit={handleSaveGrade}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Оценка (0-100)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={gradeValue}
                  onChange={(e) => setGradeValue(e.target.value)}
                  style={styles.input}
                  placeholder="Введите оценку от 0 до 100"
                  required
                />
                <p style={styles.helpText}>Оценка будет сохранена в систему оценок студента по этому предмету</p>
              </div>
              <div style={styles.modalActions}>
                <button
                  type="button"
                  onClick={() => {
                    setShowGradeModal(false);
                    setSelectedSubmission(null);
                    setGradeValue('');
                  }}
                  style={styles.cancelButton}
                >
                  Отмена
                </button>
                <button type="submit" style={styles.submitModalButton}>
                  Сохранить оценку
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  app: {
    minHeight: '100vh',
    display: 'flex',
    backgroundColor: '#f8fafc'
  },
  contentArea: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden'
  },
  mainContent: {
    flex: 1,
    overflowY: 'auto',
    padding: '2rem',
    background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)'
  },
  pageHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem'
  },
  pageTitle: {
    fontSize: '2rem',
    fontWeight: '700',
    color: '#1e293b',
    margin: 0
  },
  createButton: {
    padding: '0.75rem 1.5rem',
    background: 'linear-gradient(135deg, #9333ea 0%, #7e22ce 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontSize: '0.875rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 4px 12px rgba(147, 51, 234, 0.3)'
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '4rem 2rem',
    gap: '1rem'
  },
  spinner: {
    width: '48px',
    height: '48px',
    border: '4px solid #e2e8f0',
    borderTop: '4px solid #9333ea',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  },
  loadingText: {
    color: '#64748b',
    fontSize: '1.125rem',
    fontWeight: '500'
  },
  assignmentsCard: {
    background: 'white',
    borderRadius: '16px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    border: '1px solid #e2e8f0',
    overflow: 'hidden'
  },
  emptyState: {
    padding: '3rem',
    textAlign: 'center',
    color: '#6b7280'
  },
  emptyText: {
    fontSize: '1rem',
    margin: 0
  },
  assignmentItem: {
    padding: '1.5rem',
    borderBottom: '1px solid #e5e7eb',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '1rem'
  },
  assignmentContent: {
    flex: 1
  },
  assignmentTitle: {
    fontSize: '1.125rem',
    fontWeight: '600',
    color: '#1e293b',
    margin: '0 0 0.5rem 0'
  },
  assignmentInfo: {
    fontSize: '0.875rem',
    color: '#64748b',
    margin: '0.25rem 0'
  },
  assignmentDescription: {
    fontSize: '0.875rem',
    color: '#64748b',
    marginTop: '0.5rem'
  },
  submissionsCount: {
    fontSize: '0.875rem',
    color: '#64748b',
    marginTop: '0.5rem',
    fontWeight: '500'
  },
  deleteButton: {
    padding: '0.5rem 1rem',
    background: 'transparent',
    color: '#dc2626',
    border: '1px solid #fee2e2',
    borderRadius: '8px',
    fontSize: '0.875rem',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '1rem'
  },
  modalContent: {
    background: 'white',
    borderRadius: '16px',
    padding: '2rem',
    width: '100%',
    maxWidth: '600px',
    maxHeight: '90vh',
    overflowY: 'auto'
  },
  modalTitle: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: '1.5rem'
  },
  formGroup: {
    marginBottom: '1rem'
  },
  label: {
    display: 'block',
    marginBottom: '0.5rem',
    fontSize: '0.875rem',
    fontWeight: '500',
    color: '#374151'
  },
  select: {
    width: '100%',
    padding: '0.75rem',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '0.875rem',
    fontFamily: 'inherit'
  },
  input: {
    width: '100%',
    padding: '0.75rem',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '0.875rem',
    fontFamily: 'inherit'
  },
  textarea: {
    width: '100%',
    padding: '0.75rem',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '0.875rem',
    fontFamily: 'inherit',
    resize: 'vertical'
  },
  modalActions: {
    display: 'flex',
    gap: '0.75rem',
    justifyContent: 'flex-end',
    marginTop: '1.5rem'
  },
  cancelButton: {
    padding: '0.75rem 1.5rem',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    background: 'white',
    color: '#374151',
    fontSize: '0.875rem',
    fontWeight: '500',
    cursor: 'pointer'
  },
  submitModalButton: {
    padding: '0.75rem 1.5rem',
    borderRadius: '8px',
    background: 'linear-gradient(135deg, #9333ea 0%, #7e22ce 100%)',
    color: 'white',
    border: 'none',
    fontSize: '0.875rem',
    fontWeight: '500',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(147, 51, 234, 0.3)'
  },
  assignmentHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '1rem',
    flexWrap: 'wrap',
    gap: '1rem'
  },
  submissionsSection: {
    marginTop: '1.5rem',
    paddingTop: '1.5rem',
    borderTop: '2px solid #e5e7eb'
  },
  submissionsTitle: {
    fontSize: '1rem',
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: '1rem'
  },
  noSubmissionsText: {
    fontSize: '0.875rem',
    color: '#9ca3af',
    fontStyle: 'italic',
    textAlign: 'center',
    padding: '1rem'
  },
  submissionsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  submissionItem: {
    padding: '1rem',
    background: '#f9fafb',
    borderRadius: '8px',
    border: '1px solid #e5e7eb'
  },
  submissionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '0.75rem',
    gap: '1rem',
    flexWrap: 'wrap'
  },
  submissionStudent: {
    fontSize: '0.875rem',
    fontWeight: '600',
    color: '#1e293b',
    margin: '0 0 0.25rem 0'
  },
  submissionDate: {
    fontSize: '0.75rem',
    color: '#64748b',
    margin: 0
  },
  gradeButton: {
    padding: '0.5rem 1rem',
    background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '0.75rem',
    fontWeight: '600',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    boxShadow: '0 2px 8px rgba(245, 158, 11, 0.3)'
  },
  submissionAnswer: {
    marginTop: '0.75rem',
    padding: '0.75rem',
    background: 'white',
    borderRadius: '6px',
    border: '1px solid #e5e7eb'
  },
  answerLabel: {
    fontSize: '0.75rem',
    fontWeight: '600',
    color: '#64748b',
    margin: '0 0 0.5rem 0',
    textTransform: 'uppercase'
  },
  answerText: {
    fontSize: '0.875rem',
    color: '#374151',
    margin: 0,
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word'
  },
  submissionFile: {
    marginTop: '0.75rem'
  },
  fileLabel: {
    fontSize: '0.75rem',
    fontWeight: '600',
    color: '#64748b',
    margin: '0 0 0.5rem 0',
    textTransform: 'uppercase'
  },
  fileLink: {
    color: '#3b82f6',
    textDecoration: 'none',
    fontSize: '0.875rem',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.25rem'
  },
  gradeModalInfo: {
    marginBottom: '1.5rem',
    padding: '1rem',
    background: '#f9fafb',
    borderRadius: '8px',
    border: '1px solid #e5e7eb'
  },
  gradeInfoText: {
    fontSize: '0.875rem',
    color: '#374151',
    margin: '0.5rem 0'
  },
  submissionPreview: {
    marginTop: '1rem',
    paddingTop: '1rem',
    borderTop: '1px solid #e5e7eb'
  },
  answerPreviewBox: {
    padding: '0.75rem',
    background: 'white',
    borderRadius: '6px',
    border: '1px solid #e5e7eb',
    maxHeight: '200px',
    overflowY: 'auto'
  },
  answerPreviewText: {
    fontSize: '0.875rem',
    color: '#374151',
    margin: 0,
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word'
  },
  helpText: {
    fontSize: '0.75rem',
    color: '#64748b',
    marginTop: '0.5rem',
    marginBottom: 0
  }
};

// Добавляем анимацию спиннера
const spinnerStyles = `
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
`;
const styleSheet = document.createElement('style');
styleSheet.textContent = spinnerStyles;
document.head.appendChild(styleSheet);

export default TeacherAssignments;

