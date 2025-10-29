import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import Card from '../../components/Card';
import Chart from '../../components/Chart';
import { getDashboardStats, getTopStudents, getGpaDistribution } from '../../services/api';

const TeacherDashboard = () => {
  const [stats, setStats] = useState({
    students: 0,
    subjects: 0,
    grades: 0,
    averageGpa: 0
  });
  
  const [topStudents, setTopStudents] = useState([]);
  const [gpaDistribution, setGpaDistribution] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Load dashboard data
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // In a real app, these would be actual API calls
      setStats({
        students: 32,
        subjects: 5,
        grades: 120,
        averageGpa: 3.4
      });
      
      setTopStudents([
        { id: 1, name: 'Иван Иванов', gpa: 4.0 },
        { id: 2, name: 'Мария Петрова', gpa: 3.9 },
        { id: 3, name: 'Алексей Сидоров', gpa: 3.8 },
        { id: 4, name: 'Елена Козлова', gpa: 3.7 },
        { id: 5, name: 'Дмитрий Смирнов', gpa: 3.6 }
      ]);
      
      setGpaDistribution([
        { label: 'Математика', value: 3.5 },
        { label: 'Физика', value: 3.2 },
        { label: 'Химия', value: 3.8 },
        { label: 'Биология', value: 3.6 },
        { label: 'Информатика', value: 4.0 }
      ]);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    }
  };

  return (
    <div className="app">
      <Navbar role="teacher" />
      <div className="app-body">
        <Sidebar role="teacher" />
        <main className="main-content">
          <div className="dashboard-header">
            <h1>Панель преподавателя</h1>
          </div>
          
          <div className="dashboard-stats">
            <Card 
              title="Студенты" 
              value={stats.students} 
              icon="👥" 
              color="blue" 
            />
            <Card 
              title="Предметы" 
              value={stats.subjects} 
              icon="📚" 
              color="green" 
            />
            <Card 
              title="Средний GPA" 
              value={stats.averageGpa} 
              icon="📊" 
              color="purple" 
            />
          </div>
          
          <div className="dashboard-charts">
            <div className="chart-wrapper">
              <Chart 
                type="bar" 
                title="Распределение GPA по предметам" 
                data={gpaDistribution} 
              />
            </div>
          </div>
          
          <div className="dashboard-section">
            <div className="section-header">
              <h2>Топ-5 лучших студентов</h2>
            </div>
            <div className="top-students">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Имя студента</th>
                    <th>GPA</th>
                    <th>Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {topStudents.map((student, index) => (
                    <tr key={student.id}>
                      <td>{index + 1}</td>
                      <td>{student.name}</td>
                      <td>{student.gpa}</td>
                      <td>
                        <button 
                          className="btn btn-secondary"
                          onClick={() => navigate(`/teacher/students/${student.id}`)}
                        >
                          Посмотреть профиль
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="dashboard-actions">
            <button 
              className="btn btn-primary"
              onClick={() => navigate('/teacher/students')}
            >
              Студенты
            </button>
            <button 
              className="btn btn-primary"
              onClick={() => navigate('/teacher/subjects')}
            >
              Предметы
            </button>
            <button 
              className="btn btn-primary"
              onClick={() => navigate('/teacher/grades')}
            >
              Оценки
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default TeacherDashboard;