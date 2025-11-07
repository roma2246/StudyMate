// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { isAuthenticated, getUserRole } from './services/auth';
import StudentLogin from './pages/student/Login';
import StudentRegister from './pages/student/Register';
import TeacherLogin from './pages/teacher/Login';
import TeacherRegister from './pages/teacher/Register';
import StudentDashboard from './pages/student/Dashboard';
import StudentGrades from './pages/student/Grades';
import StudentProfile from './pages/student/Profile';
import TeacherDashboard from './pages/teacher/Dashboard';
import TeacherStudents from './pages/teacher/Students';
import TeacherSubjects from './pages/teacher/Subjects';
import TeacherGrades from './pages/teacher/Grades';
import TeacherRating from './pages/teacher/Rating';
import TeacherSchedule from './pages/teacher/Schedule';
import TeacherAssignments from './pages/teacher/Assignments';
import TeacherProfile from './pages/teacher/Profile';
import StudentSchedule from './pages/student/Schedule';
import StudentAssignments from './pages/student/Assignments';
import Debug from './pages/Debug';

// Защищенные маршруты
const ProtectedRoute = ({ children, allowedRoles }) => {
  if (!isAuthenticated()) {
    const role = allowedRoles?.[0] || 'student';
    return <Navigate to={`/${role}/login`} replace />;
  }
  
  const userRole = getUserRole();
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to={`/${userRole}/dashboard`} replace />;
  }
  
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Публичные маршруты - студенты */}
        <Route path="/student/login" element={<StudentLogin />} />
        <Route path="/student/register" element={<StudentRegister />} />
        
        {/* Публичные маршруты - преподаватели */}
        <Route path="/teacher/login" element={<TeacherLogin />} />
        <Route path="/teacher/register" element={<TeacherRegister />} />
        
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
        <Route 
          path="/student/schedule" 
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <StudentSchedule />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/student/assignments" 
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <StudentAssignments />
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
        <Route 
          path="/teacher/schedule" 
          element={
            <ProtectedRoute allowedRoles={['teacher']}>
              <TeacherSchedule />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/teacher/assignments" 
          element={
            <ProtectedRoute allowedRoles={['teacher']}>
              <TeacherAssignments />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/teacher/profile" 
          element={
            <ProtectedRoute allowedRoles={['teacher']}>
              <TeacherProfile />
            </ProtectedRoute>
          } 
        />
        
        {/* Отладочный маршрут */}
        <Route path="/debug" element={<Debug />} />
        
        {/* Реддирект по умолчанию */}
        <Route path="/" element={<Navigate to="/student/login" replace />} />
        
        {/* Fallback для несуществующих маршрутов */}
        <Route path="*" element={<Navigate to="/student/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;