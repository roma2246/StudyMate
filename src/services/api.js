// src/services/api.js
// Реальные вызовы к Spring Boot бэкенду
// Backend URL logic:
// If running inside Docker Compose frontend (Nginx), it serves from /. The proxy passes /api/ to backend:8080.
// If running from Vite directly (localhost:5173), we want to hit localhost:8080.
const BASE_URL = import.meta.env.VITE_API_URL || (window.location.port === '5173' ? 'http://localhost:8080' : '');
import { getToken } from './auth';

const fetchJSON = async (path, options = {}) => {
  const token = getToken();
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}), ...(options.headers || {}) },
    ...options,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `HTTP ${res.status}`);
  }
  const ct = res.headers.get('content-type') || '';
  return ct.includes('application/json') ? res.json() : {};
};

// Subjects APIs
export const getSubjects = () => fetchJSON('/api/subjects');
export const createSubject = (payload) => fetchJSON('/api/subjects', { method: 'POST', body: JSON.stringify(payload) });
export const updateSubject = (id, payload) => fetchJSON(`/api/subjects/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
export const deleteSubject = (id) => fetchJSON(`/api/subjects/${id}`, { method: 'DELETE' });

// Students APIs
export const getStudents = () => fetchJSON('/api/students');
export const getStudentByUserId = (userId) => fetchJSON(`/api/students/by-user/${userId}`);
export const getStudentGroups = () => fetchJSON('/api/students/groups');
export const updateStudent = (id, payload) => fetchJSON(`/api/students/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
// Создание студентов происходит через регистрацию (/api/auth/register)
export const createStudent = async (payload) => {
  console.warn('Создание студентов происходит через регистрацию (/api/auth/register)');
  return { id: Date.now(), ...payload };
};
export const deleteStudent = async (id) => {
  console.warn('Удаление студентов не реализовано');
  return { success: true };
};

// Grades APIs
export const getGrades = () => fetchJSON('/api/grades');
export const getGradesByStudent = (studentId) => fetchJSON(`/api/grades/student/${studentId}`);
export const getStudentGPA = (studentId) => fetchJSON(`/api/grades/student/${studentId}/gpa`);
export const createGrade = (payload) => fetchJSON('/api/grades', { method: 'POST', body: JSON.stringify(payload) });
export const updateGrade = (id, payload) => fetchJSON(`/api/grades/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
export const deleteGrade = (id) => fetchJSON(`/api/grades/${id}`, { method: 'DELETE' });

// Teacher Dashboard demo endpoints можно собрать из основных (оставим заглушки, но реальные данные доступны выше)
export const getDashboardStats = async () => {
  const [subjects, students, grades] = await Promise.all([getSubjects(), getStudents(), getGrades()]);
  return { subjectsCount: subjects.length, studentsCount: students.length, gradesCount: grades.length };
};
export const getTopStudents = async () => getStudents();
export const getGpaDistribution = async () => getGrades();

// Student Profile APIs — зависит от вашей модели; пока можно получить по текущему пользователю на фронте
export const getStudentProfile = async () => ({ message: 'Use /api/students and /api/grades endpoints' });
export const updateStudentProfile = async () => ({ message: 'Not implemented on backend yet' });

// Schedule APIs
export const getScheduleByStudent = (studentId) => fetchJSON(`/api/schedule/student/${studentId}`);
export const getAllSchedules = () => fetchJSON('/api/schedule');
export const createSchedule = (payload) => fetchJSON('/api/schedule', { method: 'POST', body: JSON.stringify(payload) });
export const updateSchedule = (id, payload) => fetchJSON(`/api/schedule/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
export const deleteSchedule = (id) => fetchJSON(`/api/schedule/${id}`, { method: 'DELETE' });

// Assignment APIs
export const getAssignmentsByTeacher = (userId) => fetchJSON(`/api/assignments/teacher/${userId}`);
export const getAssignmentsByStudent = (userId) => fetchJSON(`/api/assignments/student/${userId}`);
export const createAssignment = (payload) => fetchJSON('/api/assignments', { method: 'POST', body: JSON.stringify(payload) });
export const deleteAssignment = (id) => fetchJSON(`/api/assignments/${id}`, { method: 'DELETE' });
export const getSubmissionsByAssignment = (assignmentId) => fetchJSON(`/api/assignment-submissions/assignment/${assignmentId}`);
export const getSubmissionsByStudent = (userId) => fetchJSON(`/api/assignment-submissions/student/${userId}`);
export const setSubmissionGrade = (submissionId, grade) => fetchJSON(`/api/assignment-submissions/${submissionId}/grade`, {
  method: 'PATCH',
  body: JSON.stringify({ grade })
});
export const createSubmission = async (assignmentId, studentId, answerText, file) => {
  const formData = new FormData();
  formData.append('assignmentId', assignmentId);
  formData.append('studentId', studentId);
  if (answerText) formData.append('answerText', answerText);
  if (file) formData.append('file', file);

  const token = getToken();
  const res = await fetch(`${BASE_URL}/api/assignment-submissions`, {
    method: 'POST',
    body: formData,
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `HTTP ${res.status}`);
  }
  return res.json();
};
export const updateSubmission = async (id, answerText, file) => {
  const formData = new FormData();
  if (answerText !== undefined) formData.append('answerText', answerText);
  if (file) formData.append('file', file);

  const token = getToken();
  const res = await fetch(`${BASE_URL}/api/assignment-submissions/${id}`, {
    method: 'PUT',
    body: formData,
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `HTTP ${res.status}`);
  }
  return res.json();
};