// API service for handling all backend requests

import { getToken } from './auth';

const BASE_URL = '/api'; // In a real app, this would be your backend URL

// Helper function to make API requests with authorization header
const apiRequest = async (endpoint, options = {}) => {
  const token = getToken();
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    },
    ...options
  };

  // In a real app, you would fetch from `${BASE_URL}${endpoint}`
  // For now, we'll simulate API responses
  
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ data: [], message: 'Success' });
    }, 300);
  });
};

// Teacher Dashboard APIs
export const getDashboardStats = async () => {
  return apiRequest('/dashboard/stats');
};

export const getTopStudents = async () => {
  return apiRequest('/dashboard/top-students');
};

export const getGpaDistribution = async () => {
  return apiRequest('/dashboard/gpa-distribution');
};

// Students APIs
export const getStudents = async () => {
  return apiRequest('/students');
};

export const createStudent = async (studentData) => {
  return apiRequest('/students', {
    method: 'POST',
    body: JSON.stringify(studentData)
  });
};

export const updateStudent = async (id, studentData) => {
  return apiRequest(`/students/${id}`, {
    method: 'PUT',
    body: JSON.stringify(studentData)
  });
};

export const deleteStudent = async (id) => {
  return apiRequest(`/students/${id}`, {
    method: 'DELETE'
  });
};

// Subjects APIs
export const getSubjects = async () => {
  return apiRequest('/subjects');
};

export const createSubject = async (subjectData) => {
  return apiRequest('/subjects', {
    method: 'POST',
    body: JSON.stringify(subjectData)
  });
};

export const updateSubject = async (id, subjectData) => {
  return apiRequest(`/subjects/${id}`, {
    method: 'PUT',
    body: JSON.stringify(subjectData)
  });
};

export const deleteSubject = async (id) => {
  return apiRequest(`/subjects/${id}`, {
    method: 'DELETE'
  });
};

// Grades APIs
export const getGrades = async () => {
  return apiRequest('/grades');
};

export const createGrade = async (gradeData) => {
  return apiRequest('/grades', {
    method: 'POST',
    body: JSON.stringify(gradeData)
  });
};

export const updateGrade = async (id, gradeData) => {
  return apiRequest(`/grades/${id}`, {
    method: 'PUT',
    body: JSON.stringify(gradeData)
  });
};

export const deleteGrade = async (id) => {
  return apiRequest(`/grades/${id}`, {
    method: 'DELETE'
  });
};

// Student Profile APIs
export const getStudentProfile = async (studentId) => {
  return apiRequest(`/students/${studentId}/profile`);
};

export const updateStudentProfile = async (studentId, profileData) => {
  return apiRequest(`/students/${studentId}/profile`, {
    method: 'PUT',
    body: JSON.stringify(profileData)
  });
};