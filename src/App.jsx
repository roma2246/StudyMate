// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { isAuthenticated, getUserRole } from './services/auth';
import Login from './pages/Login';
import Register from './pages/Register';
import StudentDashboard from './pages/student/Dashboard';
import StudentGrades from './pages/student/Grades';
import StudentProfile from './pages/student/Profile';
import TeacherDashboard from './pages/teacher/Dashboard';
import TeacherStudents from './pages/teacher/Students';
import TeacherSubjects from './pages/teacher/Subjects';
import TeacherGrades from './pages/teacher/Grades';
import TeacherRating from './pages/teacher/Rating';
import Debug from './pages/Debug';

// Защищенные маршруты
const ProtectedRoute = ({ children, allowedRoles }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  
  const userRole = getUserRole();
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Публичные маршруты */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Защищенные маршруты для студентов */}
        <Route 
          path="/student/dashboard" 
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <StudentDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/student/grades" 
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <StudentGrades />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/student/profile" 
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <StudentProfile />
            </ProtectedRoute>
          } 
        />
        
        {/* Защищенные маршруты для преподавателей (админка) */}
        <Route 
          path="/teacher/dashboard" 
          element={
            <ProtectedRoute allowedRoles={['teacher']}>
              <TeacherDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/teacher/students" 
          element={
            <ProtectedRoute allowedRoles={['teacher']}>
              <TeacherStudents />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/teacher/subjects" 
          element={
            <ProtectedRoute allowedRoles={['teacher']}>
              <TeacherSubjects />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/teacher/grades" 
          element={
            <ProtectedRoute allowedRoles={['teacher']}>
              <TeacherGrades />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/teacher/rating" 
          element={
            <ProtectedRoute allowedRoles={['teacher']}>
              <TeacherRating />
            </ProtectedRoute>
          } 
        />
        
        {/* Отладочный маршрут */}
        <Route path="/debug" element={<Debug />} />
        
        {/* Реддирект по умолчанию */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        {/* Fallback для несуществующих маршрутов */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;