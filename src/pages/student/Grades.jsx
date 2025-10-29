import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import Chart from '../../components/Chart';

const StudentGrades = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadGradesData();
  }, []);

  const loadGradesData = async () => {
    try {
      setLoading(true);
      
      // Mock subjects with grades
      const mockSubjects = [
        { 
          id: 1, 
          name: 'Математика', 
          grades: [5, 4, 5, 5, 4], 
          average: 4.5,
          chartData: [
            { label: 'Экзамен 1', value: 5 },
            { label: 'Экзамен 2', value: 4 },
            { label: 'Экзамен 3', value: 5 },
            { label: 'Экзамен 4', value: 5 },
            { label: 'Экзамен 5', value: 4 }
          ]
        },
        { 
          id: 2, 
          name: 'Физика', 
          grades: [4, 4, 3, 4, 5], 
          average: 4.0,
          chartData: [
            { label: 'Экзамен 1', value: 4 },
            { label: 'Экзамен 2', value: 4 },
            { label: 'Экзамен 3', value: 3 },
            { label: 'Экзамен 4', value: 4 },
            { label: 'Экзамен 5', value: 5 }
          ]
        },
        { 
          id: 3, 
          name: 'Химия', 
          grades: [4, 3, 4, 3, 5], 
          average: 3.8,
          chartData: [
            { label: 'Экзамен 1', value: 4 },
            { label: 'Экзамен 2', value: 3 },
            { label: 'Экзамен 3', value: 4 },
            { label: 'Экзамен 4', value: 3 },
            { label: 'Экзамен 5', value: 5 }
          ]
        },
        { 
          id: 4, 
          name: 'Биология', 
          grades: [5, 4, 4, 5, 3], 
          average: 4.2,
          chartData: [
            { label: 'Экзамен 1', value: 5 },
            { label: 'Экзамен 2', value: 4 },
            { label: 'Экзамен 3', value: 4 },
            { label: 'Экзамен 4', value: 5 },
            { label: 'Экзамен 5', value: 3 }
          ]
        },
        { 
          id: 5, 
          name: 'Информатика', 
          grades: [5, 5, 5, 5, 5], 
          average: 5.0,
          chartData: [
            { label: 'Экзамен 1', value: 5 },
            { label: 'Экзамен 2', value: 5 },
            { label: 'Экзамен 3', value: 5 },
            { label: 'Экзамен 4', value: 5 },
            { label: 'Экзамен 5', value: 5 }
          ]
        }
      ];
      
      setSubjects(mockSubjects);
    } catch (error) {
      console.error('Failed to load grades data:', error);
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
          <div className="page-header">
            <h1>Мои оценки</h1>
          </div>
          
          {loading ? (
            <div className="loading">Загрузка...</div>
          ) : (
            <div className="grades-container">
              <div className="subjects-grid">
                {subjects.map(subject => (
                  <div key={subject.id} className="subject-card">
                    <div className="subject-header">
                      <h3>{subject.name}</h3>
                      <div className="subject-average">
                        Средний балл: <span>{subject.average}</span>
                      </div>
                    </div>
                    
                    <div className="subject-grades">
                      <div className="grades-list">
                        <h4>Оценки:</h4>
                        <div className="grades-tags">
                          {subject.grades.map((grade, index) => (
                            <span key={index} className={`grade-tag grade-${grade}`}>
                              {grade}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="subject-chart">
                      <Chart 
                        type="bar" 
                        title={`Оценки по ${subject.name}`}
                        data={subject.chartData} 
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default StudentGrades;