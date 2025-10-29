import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import Card from '../../components/Card';
import Chart from '../../components/Chart';
import { getUserName } from '../../services/auth';

const StudentDashboard = () => {
  const [gpaData, setGpaData] = useState([]);
  const [recentGrades, setRecentGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const studentName = getUserName();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Mock GPA data by subject
      const mockGpaData = [
        { label: 'Математика', value: 4.5 },
        { label: 'Физика', value: 4.0 },
        { label: 'Химия', value: 3.8 },
        { label: 'Биология', value: 4.2 },
        { label: 'Информатика', value: 5.0 }
      ];
      
      setGpaData(mockGpaData);
      
      // Mock recent grades
      const mockGrades = [
        { subject: 'Математика', grade: 5, date: '2023-10-15' },
        { subject: 'Физика', grade: 4, date: '2023-10-14' },
        { subject: 'Химия', grade: 4, date: '2023-10-13' },
        { subject: 'Биология', grade: 5, date: '2023-10-12' },
        { subject: 'Информатика', grade: 5, date: '2023-10-11' }
      ];
      
      setRecentGrades(mockGrades);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <Navbar role="student" />
      <div className="app-body">
        <Sidebar role="student" />
        <main className="main-content">
          <div className="dashboard-header">
            <h1>Привет, {studentName || 'Студент'}!</h1>
          </div>
          
          {loading ? (
            <div className="loading">Загрузка...</div>
          ) : (
            <>
              <div className="dashboard-stats">
                <Card 
                  title="Средний балл" 
                  value="4.1" 
                  icon="📊" 
                  color="purple" 
                />
              </div>
              
              <div className="dashboard-charts">
                <div className="chart-wrapper">
                  <Chart 
                    type="bar" 
                    title="GPA по предметам" 
                    data={gpaData} 
                  />
                </div>
              </div>
              
              <div className="dashboard-section">
                <div className="section-header">
                  <h2>Последние оценки</h2>
                </div>
                <div className="recent-grades">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Предмет</th>
                        <th>Оценка</th>
                        <th>Дата</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentGrades.map((grade, index) => (
                        <tr key={index}>
                          <td>{grade.subject}</td>
                          <td>{grade.grade}</td>
                          <td>{grade.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default StudentDashboard;