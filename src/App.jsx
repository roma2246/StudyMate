import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Error from './pages/Error';
import TeacherDashboard from './pages/teacher/Dashboard';
import TeacherStudents from './pages/teacher/Students';
import TeacherSubjects from './pages/teacher/Subjects';
import TeacherGrades from './pages/teacher/Grades';
import TeacherRating from './pages/teacher/Rating';
import StudentDashboard from './pages/student/Dashboard';
import StudentGrades from './pages/student/Grades';
import StudentProfile from './pages/student/Profile';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
        <Route path="/teacher/students" element={<TeacherStudents />} />
        <Route path="/teacher/subjects" element={<TeacherSubjects />} />
        <Route path="/teacher/grades" element={<TeacherGrades />} />
        <Route path="/teacher/rating" element={<TeacherRating />} />
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/student/grades" element={<StudentGrades />} />
        <Route path="/student/profile" element={<StudentProfile />} />
        <Route path="*" element={<Error />} />
      </Routes>
    </Router>
  );
}

export default App;