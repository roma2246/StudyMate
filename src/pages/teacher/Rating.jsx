import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import Chart from '../../components/Chart';

const TeacherRating = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [gpaData, setGpaData] = useState([]);

  useEffect(() => {
    loadRatingData();
  }, []);

  const loadRatingData = async () => {
    try {
      setLoading(true);
      // In a real app, this would be an actual API call
      const mockStudents = [
        { id: 1, name: 'Иван Иванов', gpa: 4.0 },
        { id: 2, name: 'Мария Петрова', gpa: 3.9 },
        { id: 3, name: 'Алексей Сидоров', gpa: 3.8 },
        { id: 4, name: 'Елена Козлова', gpa: 3.7 },
        { id: 5, name: 'Дмитрий Смирнов', gpa: 3.6 },
        { id: 6, name: 'Ольга Новикова', gpa: 3.5 },
        { id: 7, name: 'Сергей Морозов', gpa: 3.4 },
        { id: 8, name: 'Анна Волкова', gpa: 3.3 },
        { id: 9, name: 'Павел Лебедев', gpa: 3.2 },
        { id: 10, name: 'Татьяна Зайцева', gpa: 3.1 }
      ];
      
      setStudents(mockStudents);
      
      // Prepare data for chart
      const chartData = mockStudents.slice(0, 5).map(student => ({
        label: student.name.split(' ')[0], // First name only for chart
        value: student.gpa
      }));
      
      setGpaData(chartData);
    } catch (error) {
      console.error('Failed to load rating data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = (format) => {
    alert(`Экспорт в ${format} не реализован в демонстрационной версии`);
  };

  return (
    <div className="app">
      <Navbar role="teacher" />
      <div className="app-body">
        <Sidebar role="teacher" />
        <main className="main-content">
          <div className="page-header">
            <h1>Рейтинг студентов</h1>
            <div className="page-actions">
              <button 
                className="btn btn-secondary"
                onClick={() => handleExport('Excel')}
              >
                Экспорт в Excel
              </button>
              <button 
                className="btn btn-secondary"
                onClick={() => handleExport('PDF')}
              >
                Экспорт в PDF
              </button>
            </div>
          </div>
          
          {loading ? (
            <div className="loading">Загрузка...</div>
          ) : (
            <>
              <div className="chart-wrapper">
                <Chart 
                  type="bar" 
                  title="Топ-5 студентов по GPA" 
                  data={gpaData} 
                />
              </div>
              
              <div className="rating-table">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Место</th>
                      <th>Студент</th>
                      <th>GPA</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((student, index) => (
                      <tr key={student.id} className={index < 3 ? 'top-three' : ''}>
                        <td>
                          {index === 0 && '🥇'}
                          {index === 1 && '🥈'}
                          {index === 2 && '🥉'}
                          {index > 2 && index + 1}
                        </td>
                        <td>{student.name}</td>
                        <td>{student.gpa}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default TeacherRating;