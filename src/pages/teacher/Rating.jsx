import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import Chart from '../../components/Chart';
import { getStudents, getStudentGPA } from '../../services/api';

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
      
      // Получаем всех студентов из БД
      const studentsData = await getStudents();
      if (!Array.isArray(studentsData)) {
        setStudents([]);
        setGpaData([]);
        return;
      }
      
      // Для каждого студента получаем GPA
      const studentsWithGPA = await Promise.all(
        studentsData.map(async (student) => {
          try {
            const gpaResponse = await getStudentGPA(student.id);
            const gpa = gpaResponse?.gpa || 0;
            const name = student.user?.name || `Студент #${student.id}`;
            return {
              id: student.id,
              name: name,
              gpa: gpa
            };
          } catch (error) {
            console.error(`Failed to get GPA for student ${student.id}:`, error);
            return {
              id: student.id,
              name: student.user?.name || `Студент #${student.id}`,
              gpa: 0
            };
          }
        })
      );
      
      // Сортируем по GPA (от большего к меньшему)
      const sortedStudents = studentsWithGPA.sort((a, b) => b.gpa - a.gpa);
      setStudents(sortedStudents);
      
      // Prepare data for chart (топ-5)
      const chartData = sortedStudents.slice(0, 5).map(student => ({
        label: student.name.split(' ')[0], // First name only for chart
        value: student.gpa,
        color: '#667eea'
      }));
      
      setGpaData(chartData);
    } catch (error) {
      console.error('Failed to load rating data:', error);
      setStudents([]);
      setGpaData([]);
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