// src/pages/student/Grades.jsx
import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import { getGradesByStudent, getStudentGPA, getStudentByUserId, getSubjects } from '../../services/api';
import { getCurrentUser } from '../../services/auth';

const StudentGrades = () => {
  const [grades, setGrades] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [gpa, setGpa] = useState(null);
  const [studentId, setStudentId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStudentId();
  }, []);

  useEffect(() => {
    if (studentId) {
      loadData();
    }
  }, [studentId]);

  const loadStudentId = async () => {
    try {
      const user = getCurrentUser();
      if (user?.id) {
        const student = await getStudentByUserId(user.id);
        if (student?.id) {
          setStudentId(student.id);
        }
      }
    } catch (error) {
      console.error('Failed to load student ID:', error);
    }
  };

  const loadData = async () => {
    try {
      setLoading(true);
      const [gradesData, gpaData, subjectsData] = await Promise.all([
        getGradesByStudent(studentId),
        getStudentGPA(studentId),
        getSubjects()
      ]);
      setGrades(gradesData);
      setGpa(gpaData);
      setSubjects(subjectsData);
    } catch (error) {
      console.error('Failed to load grades data:', error);
      setGrades([]);
      setGpa(null);
    } finally {
      setLoading(false);
    }
  };

  const getSubjectName = (subjectId) => {
    const subject = subjects.find(s => s.id === subjectId);
    return subject?.name || 'Неизвестно';
  };

  const convertTo5Point = (value) => {
    if (value >= 90) return { grade: 5, color: '#16a34a' };
    if (value >= 75) return { grade: 4, color: '#16a34a' };
    if (value >= 60) return { grade: 3, color: '#f59e0b' };
    if (value >= 40) return { grade: 2, color: '#dc2626' };
    return { grade: 1, color: '#dc2626' };
  };

  const getGpaColor = (gpaValue) => {
    if (gpaValue >= 90) return '#16a34a';
    if (gpaValue >= 75) return '#16a34a';
    if (gpaValue >= 60) return '#f59e0b';
    if (gpaValue >= 40) return '#dc2626';
    return '#dc2626';
  };

  const groupedBySubject = grades.reduce((acc, grade) => {
    const subjectId = grade.subject?.id;
    if (!subjectId) return acc;
    
    if (!acc[subjectId]) {
      acc[subjectId] = {
        subjectId,
        subjectName: getSubjectName(subjectId),
        grades: []
      };
    }
    acc[subjectId].grades.push(grade);
    return acc;
  }, {});

  const subjectStats = Object.values(groupedBySubject).map(subjectGroup => {
    const avg = subjectGroup.grades.reduce((sum, g) => sum + g.value, 0) / subjectGroup.grades.length;
    return {
      ...subjectGroup,
      average: Math.round(avg * 100) / 100,
      grade5: convertTo5Point(avg)
    };
  });

  return (
    <div className="app">
      <Navbar role="student" />
      <div className="app-body">
        <Sidebar role="student" />
        <main className="main-content">
          <div className="page-header">
            <h1>Мои оценки</h1>
          </div>
          
          {loading ? (
            <div className="loading">Загрузка оценок...</div>
          ) : (
            <>
              {/* GPA Card */}
              {gpa && (
                <div style={{
                  background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                  color: 'white',
                  padding: '32px',
                  borderRadius: '16px',
                  marginBottom: '32px',
                  boxShadow: '0 4px 15px rgba(59, 130, 246, 0.4)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h2 style={{ margin: '0 0 8px 0', fontSize: '24px', fontWeight: '600' }}>Средний балл (GPA)</h2>
                      <p style={{ margin: 0, opacity: 0.9, fontSize: '16px' }}>
                        Всего оценок: {gpa.totalGrades}
                      </p>
                    </div>
                    <div style={{
                      fontSize: '64px',
                      fontWeight: '800',
                      color: '#ffffff',
                      textShadow: '0 2px 10px rgba(0,0,0,0.2)'
                    }}>
                      {gpa.gpa.toFixed(2)}
                    </div>
                  </div>
                  <div style={{
                    marginTop: '24px',
                    padding: '16px',
                    background: 'rgba(255, 255, 255, 0.15)',
                    borderRadius: '12px',
                    backdropFilter: 'blur(10px)'
                  }}>
                    <div style={{ display: 'flex', gap: '24px', fontSize: '14px' }}>
                      <div>
                        <strong>90-100:</strong> Отлично (5)
                      </div>
                      <div>
                        <strong>75-89:</strong> Хорошо (4)
                      </div>
                      <div>
                        <strong>60-74:</strong> Удовлетворительно (3)
                      </div>
                      <div>
                        <strong>40-59:</strong> Неудовлетворительно (2)
                      </div>
                      <div>
                        <strong>0-39:</strong> Очень плохо (1)
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {grades.length === 0 ? (
                <div style={{ 
                  padding: '48px', 
                  textAlign: 'center', 
                  color: '#6b7280',
                  background: '#f9fafb',
                  borderRadius: '12px'
                }}>
                  <p style={{ fontSize: '18px' }}>У вас пока нет оценок</p>
                </div>
              ) : (
                <div style={{ display: 'grid', gap: '24px' }}>
                  {subjectStats.map((subject) => (
                    <div key={subject.subjectId} style={{
                      border: '1px solid #e5e7eb',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                    }}>
                      <div style={{
                        background: '#f3f4f6',
                        padding: '20px',
                        borderBottom: '1px solid #e5e7eb',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}>
                        <div>
                          <h3 style={{ margin: '0 0 8px 0', fontSize: '20px', fontWeight: '600', color: '#1f2937' }}>
                            {subject.subjectName}
                          </h3>
                          <p style={{ margin: 0, color: '#6b7280', fontSize: '14px' }}>
                            Оценок: {subject.grades.length}
                          </p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}>Средний балл</div>
                          <div style={{
                            fontSize: '32px',
                            fontWeight: '700',
                            color: subject.grade5.color
                          }}>
                            {subject.average.toFixed(2)}
                          </div>
                          <div style={{
                            fontSize: '18px',
                            fontWeight: '600',
                            color: subject.grade5.color,
                            marginTop: '4px'
                          }}>
                            ({subject.grade5.grade})
                          </div>
                        </div>
                      </div>
                      <div style={{ padding: '20px', background: 'white' }}>
                        <div style={{ display: 'grid', gap: '12px' }}>
                          {subject.grades.map((grade, idx) => {
                            const grade5 = convertTo5Point(grade.value);
                            return (
                              <div key={grade.id || idx} style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '16px',
                                background: '#f9fafb',
                                borderRadius: '8px',
                                borderLeft: `4px solid ${grade5.color}`
                              }}>
                                <div style={{ flex: 1 }}>
                                  <div style={{ fontWeight: '600', marginBottom: '4px', color: '#1f2937' }}>
                                    Оценка #{idx + 1}
                                  </div>
                                  <div style={{ color: '#6b7280', fontSize: '14px' }}>
                                    Балл: {grade.value}
                                  </div>
                                </div>
                                <div style={{
                                  fontSize: '24px',
                                  fontWeight: '700',
                                  color: grade5.color,
                                  padding: '8px 16px',
                                  background: 'white',
                                  borderRadius: '8px',
                                  border: `2px solid ${grade5.color}`,
                                  minWidth: '60px',
                                  textAlign: 'center'
                                }}>
                                  {grade5.grade}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default StudentGrades;