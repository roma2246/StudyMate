// src/pages/student/Schedule.jsx
import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import { getScheduleByStudent, getStudentByUserId } from '../../services/api';
import { getCurrentUser } from '../../services/auth';

const StudentSchedule = () => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [studentId, setStudentId] = useState(null);

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
    loadStudentId();
  }, []);

  useEffect(() => {
    if (studentId) {
      loadSchedule();
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

  const loadSchedule = async () => {
    try {
      setLoading(true);
      const scheduleData = await getScheduleByStudent(studentId);
      setSchedules(scheduleData);
    } catch (error) {
      console.error('Failed to load schedule:', error);
      setSchedules([]);
    } finally {
      setLoading(false);
    }
  };

  const getSubjectName = (subject) => {
    return subject?.name || 'Неизвестно';
  };

  const groupedSchedule = schedules.reduce((acc, item) => {
    const day = item.dayOfWeek || 1;
    if (!acc[day]) acc[day] = [];
    acc[day].push(item);
    return acc;
  }, {});

  return (
    <div className="app">
      <Navbar role="student" />
      <div className="app-body">
        <Sidebar role="student" />
        <main className="main-content">
          <div className="page-header">
            <h1>Моё расписание</h1>
          </div>
          
          {loading ? (
            <div className="loading">Загрузка расписания...</div>
          ) : Object.keys(groupedSchedule).length === 0 ? (
            <div style={{ 
              padding: '48px', 
              textAlign: 'center', 
              color: '#6b7280',
              background: '#f9fafb',
              borderRadius: '12px'
            }}>
              <p style={{ fontSize: '18px' }}>Расписание пока не назначено</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '16px' }}>
              {daysOfWeek.map(day => {
                const daySchedule = groupedSchedule[day.value] || [];
                if (daySchedule.length === 0) return null;
                
                // Сортируем занятия по времени начала
                daySchedule.sort((a, b) => {
                  const timeA = a.startTime || '00:00';
                  const timeB = b.startTime || '00:00';
                  return timeA.localeCompare(timeB);
                });
                
                return (
                  <div key={day.value} style={{
                    border: '1px solid #e5e7eb',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                  }}>
                    <div style={{
                      background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                      color: 'white',
                      padding: '16px',
                      fontWeight: '600',
                      fontSize: '18px'
                    }}>
                      {day.label}
                    </div>
                    <div style={{ padding: '16px', background: '#ffffff' }}>
                      {daySchedule.map((item, idx) => (
                        <div key={item.id || idx} style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '16px',
                          marginBottom: idx < daySchedule.length - 1 ? '12px' : '0',
                          background: '#f9fafb',
                          borderRadius: '8px',
                          borderLeft: '4px solid #3b82f6'
                        }}>
                          <div style={{ flex: 1 }}>
                            <div style={{ 
                              fontWeight: '600', 
                              fontSize: '18px',
                              marginBottom: '6px',
                              color: '#1f2937'
                            }}>
                              {getSubjectName(item.subject)}
                            </div>
                            <div style={{ 
                              color: '#6b7280', 
                              fontSize: '14px',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px'
                            }}>
                              <span>🕐</span>
                              <span>{item.startTime} - {item.endTime}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default StudentSchedule;
