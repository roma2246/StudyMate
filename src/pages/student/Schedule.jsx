// src/pages/student/Schedule.jsx
import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import { getScheduleByStudent, getStudentByUserId } from '../../services/api';
import { getCurrentUser } from '../../services/auth';

const DAY_COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#06b6d4', '#ec4899'];

const StudentSchedule = () => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [studentId, setStudentId] = useState(null);

  const daysOfWeek = [
    { value: 1, label: 'Понедельник', short: 'ПН' },
    { value: 2, label: 'Вторник', short: 'ВТ' },
    { value: 3, label: 'Среда', short: 'СР' },
    { value: 4, label: 'Четверг', short: 'ЧТ' },
    { value: 5, label: 'Пятница', short: 'ПТ' },
    { value: 6, label: 'Суббота', short: 'СБ' },
    { value: 7, label: 'Воскресенье', short: 'ВС' },
  ];

  useEffect(() => { loadStudentId(); }, []);
  useEffect(() => { if (studentId) loadSchedule(); }, [studentId]);

  const loadStudentId = async () => {
    try {
      const user = getCurrentUser();
      if (user?.id) {
        const student = await getStudentByUserId(user.id);
        if (student?.id) setStudentId(student.id);
      }
    } catch (e) { console.error(e); }
  };

  const loadSchedule = async () => {
    try {
      setLoading(true);
      const data = await getScheduleByStudent(studentId);
      setSchedules(data);
    } catch (e) {
      setSchedules([]);
    } finally { setLoading(false); }
  };

  const grouped = schedules.reduce((acc, item) => {
    const day = item.dayOfWeek || 1;
    if (!acc[day]) acc[day] = [];
    acc[day].push(item);
    return acc;
  }, {});

  return (
    <div style={s.page}>
      <Navbar role="student" />
      <div style={s.body}>
        <Sidebar role="student" />
        <main style={s.main}>
          <div style={s.header}>
            <div>
              <h1 style={s.title}>📅 Моё расписание</h1>
              <p style={s.subtitle}>Расписание занятий на неделю</p>
            </div>
          </div>

          {loading ? (
            <div style={s.loading}>⏳ Загрузка расписания...</div>
          ) : Object.keys(grouped).length === 0 ? (
            <div style={s.empty}>📅 Расписание пока не назначено</div>
          ) : (
            <div style={{ display: 'grid', gap: '1.25rem' }}>
              {daysOfWeek.map((day, dayIdx) => {
                const items = grouped[day.value] || [];
                if (!items.length) return null;
                const dayColor = DAY_COLORS[dayIdx % DAY_COLORS.length];
                items.sort((a, b) => (a.startTime || '').localeCompare(b.startTime || ''));

                return (
                  <div key={day.value} style={s.dayCard}>
                    <div style={{ ...s.dayHeader, borderLeft: `4px solid ${dayColor}` }}>
                      <div style={{ ...s.dayBadge, background: `${dayColor}20`, color: dayColor, border: `1px solid ${dayColor}40` }}>
                        {day.short}
                      </div>
                      <div>
                        <div style={s.dayName}>{day.label}</div>
                        <div style={s.dayCount}>{items.length} занятий</div>
                      </div>
                    </div>
                    <div style={s.dayItems}>
                      {items.map((item, idx) => (
                        <div key={item.id || idx} style={{ ...s.lessonRow, borderLeft: `3px solid ${dayColor}` }}>
                          <div style={{ ...s.timeBox, color: dayColor }}>
                            <div style={s.timeStart}>{item.startTime || '--:--'}</div>
                            <div style={s.timeSep}>│</div>
                            <div style={s.timeEnd}>{item.endTime || '--:--'}</div>
                          </div>
                          <div style={s.lessonInfo}>
                            <div style={s.lessonName}>{item.subject?.name || 'Предмет'}</div>
                            {item.classroom && (
                              <div style={s.lessonRoom}>🏫 Аудитория {item.classroom}</div>
                            )}
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

const s = {
  page: { minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#0a1628', fontFamily: "'Inter',-apple-system,sans-serif" },
  body: { display: 'flex', flex: 1 },
  main: { flex: 1, padding: '2rem', overflowY: 'auto', background: 'linear-gradient(160deg,#0a1628 0%,#0f1e3a 100%)' },
  header: { background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '1.5rem 2rem', marginBottom: '1.5rem' },
  title: { fontSize: '1.75rem', fontWeight: '800', color: '#60a5fa', margin: '0 0 0.25rem 0', letterSpacing: '-0.02em' },
  subtitle: { color: 'rgba(255,255,255,0.45)', fontSize: '0.9rem', margin: 0 },
  loading: { color: 'rgba(255,255,255,0.5)', textAlign: 'center', padding: '3rem', fontSize: '1rem' },
  empty: { textAlign: 'center', padding: '4rem', color: 'rgba(255,255,255,0.3)', fontSize: '1.125rem', background: 'rgba(255,255,255,0.03)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.06)' },
  dayCard: { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', overflow: 'hidden' },
  dayHeader: { display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 1.5rem', background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.06)' },
  dayBadge: { width: '40px', height: '40px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '0.8rem', flexShrink: 0 },
  dayName: { fontSize: '1rem', fontWeight: '700', color: '#fff', marginBottom: '0.125rem' },
  dayCount: { fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', fontWeight: '500' },
  dayItems: { padding: '1rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' },
  lessonRow: { display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.875rem 1rem', background: 'rgba(255,255,255,0.025)', borderRadius: '10px' },
  timeBox: { display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0, width: '50px' },
  timeStart: { fontSize: '0.8125rem', fontWeight: '700' },
  timeSep: { fontSize: '0.625rem', color: 'rgba(255,255,255,0.2)', lineHeight: 1 },
  timeEnd: { fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', fontWeight: '500' },
  lessonInfo: { flex: 1 },
  lessonName: { fontSize: '0.9375rem', fontWeight: '700', color: '#fff', marginBottom: '0.25rem' },
  lessonRoom: { fontSize: '0.8125rem', color: 'rgba(255,255,255,0.4)', fontWeight: '500' },
};

export default StudentSchedule;
