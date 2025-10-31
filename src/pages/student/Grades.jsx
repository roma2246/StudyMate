// src/pages/student/Grades.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import Chart from '../../components/Chart';
import { isAuthenticated } from '../../services/auth';

const StudentGrades = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }
    loadGradesData();
  }, [navigate]);

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
    <div style={styles.app}>
      <Navbar role="student" />
      <div style={styles.appBody}>
        <Sidebar role="student" />
        <main style={styles.mainContent}>
          <div style={styles.pageHeader}>
            <h1 style={styles.pageTitle}>Мои оценки</h1>
          </div>
          
          {loading ? (
            <div style={styles.loading}>Загрузка...</div>
          ) : (
            <div style={styles.gradesContainer}>
              <div style={styles.subjectsGrid}>
                {subjects.map(subject => (
                  <div key={subject.id} style={styles.subjectCard}>
                    <div style={styles.subjectHeader}>
                      <h3 style={styles.subjectName}>{subject.name}</h3>
                      <div style={styles.subjectAverage}>
                        Средний балл: <span style={styles.averageValue}>{subject.average}</span>
                      </div>
                    </div>
                    
                    <div style={styles.subjectGrades}>
                      <div style={styles.gradesList}>
                        <h4 style={styles.gradesTitle}>Оценки:</h4>
                        <div style={styles.gradesTags}>
                          {subject.grades.map((grade, index) => (
                            <span 
                              key={index} 
                              style={{
                                ...styles.gradeTag,
                                ...styles[`grade${grade}`]
                              }}
                            >
                              {grade}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div style={styles.subjectChart}>
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

const styles = {
  app: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column'
  },
  appBody: {
    display: 'flex',
    flex: 1
  },
  mainContent: {
    flex: 1,
    padding: '2rem',
    overflowY: 'auto'
  },
  pageHeader: {
    marginBottom: '2rem'
  },
  pageTitle: {
    fontSize: '2rem',
    fontWeight: '700',
    color: '#1f2937',
    margin: 0
  },
  gradesContainer: {
    marginTop: '1rem'
  },
  subjectsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
    gap: '1.5rem'
  },
  subjectCard: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '1.5rem',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    border: '1px solid #e5e7eb'
  },
  subjectHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem'
  },
  subjectName: {
    fontSize: '1.25rem',
    fontWeight: '600',
    color: '#1f2937',
    margin: 0
  },
  subjectAverage: {
    fontSize: '0.875rem',
    color: '#6b7280'
  },
  averageValue: {
    fontWeight: '600',
    color: '#1f2937'
  },
  subjectGrades: {
    marginBottom: '1rem'
  },
  gradesList: {
    marginBottom: '1rem'
  },
  gradesTitle: {
    fontSize: '1rem',
    fontWeight: '600',
    color: '#374151',
    margin: '0 0 0.5rem 0'
  },
  gradesTags: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.5rem'
  },
  gradeTag: {
    padding: '0.25rem 0.75rem',
    borderRadius: '1rem',
    fontSize: '0.875rem',
    fontWeight: '600',
    color: 'white'
  },
  grade5: { backgroundColor: '#10b981' },
  grade4: { backgroundColor: '#3b82f6' },
  grade3: { backgroundColor: '#f59e0b' },
  grade2: { backgroundColor: '#ef4444' },
  subjectChart: {
    width: '100%'
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '3rem',
    color: '#6b7280',
    fontSize: '1.125rem'
  }
};

export default StudentGrades;