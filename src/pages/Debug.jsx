// src/pages/Debug.jsx
import React from 'react';
import { getStorageInfo, resetAllData, debugUsers } from '../services/auth';

const Debug = () => {
  const storageInfo = getStorageInfo();
  
  const testRegistration = async () => {
    console.log('=== ТЕСТОВАЯ РЕГИСТРАЦИЯ ===');
    const testData = {
      name: 'Тестовый Студент',
      username: 'testuser',
      role: 'student',
      password: '123456'
    };
    console.log('Тестовые данные:', testData);
  };

  const debugAuthFlow = () => {
    console.log('=== ОТЛАДКА АУТЕНТИФИКАЦИИ ===');
    
    const users = debugUsers();
    const currentUser = getStorageInfo().currentUser;
    
    console.log('Все пользователи в системе:', users);
    console.log('Текущий пользователь:', currentUser);
    
    users.forEach((user, index) => {
      console.log(`Пользователь ${index}:`, {
        id: user.id,
        username: user.username,
        password: user.password,
        name: user.name,
        role: user.role
      });
    });
  };

  return (
    <div style={{ 
      padding: '2rem', 
      fontFamily: 'Arial, sans-serif',
      maxWidth: '1200px',
      margin: '0 auto'
    }}>
      <h1 style={{ marginBottom: '2rem', color: '#1f2937' }}>Отладка системы аутентификации</h1>
      
      {/* Информация о хранилище */}
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ color: '#374151', marginBottom: '1rem' }}>Информация о хранилище</h2>
        
        <div style={{ display: 'grid', gap: '1rem' }}>
          <div style={{ padding: '1rem', background: '#dbeafe', borderRadius: '8px' }}>
            <h3 style={{ margin: '0 0 0.5rem 0', color: '#1e40af' }}>Текущий пользователь:</h3>
            <pre style={{ 
              margin: 0, 
              background: 'white', 
              padding: '1rem', 
              borderRadius: '4px',
              overflow: 'auto'
            }}>
              {storageInfo.currentUser 
                ? JSON.stringify(storageInfo.currentUser, null, 2) 
                : 'Не авторизован'}
            </pre>
          </div>
          
          <div style={{ padding: '1rem', background: '#f0fdf4', borderRadius: '8px' }}>
            <h3 style={{ margin: '0 0 0.5rem 0', color: '#166534' }}>Все пользователи ({storageInfo.users.length}):</h3>
            <pre style={{ 
              margin: 0, 
              background: 'white', 
              padding: '1rem', 
              borderRadius: '4px',
              overflow: 'auto'
            }}>
              {JSON.stringify(storageInfo.users, null, 2)}
            </pre>
          </div>
        </div>
      </div>

      {/* Raw localStorage данные */}
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ color: '#374151', marginBottom: '1rem' }}>Raw данные из localStorage</h2>
        <div style={{ display: 'grid', gap: '1rem' }}>
          <div>
            <h4 style={{ margin: '0 0 0.5rem 0', color: '#6b7280' }}>studyMateUsers:</h4>
            <pre style={{ 
              margin: 0, 
              background: '#f8fafc', 
              padding: '1rem', 
              borderRadius: '4px',
              border: '1px solid #e2e8f0',
              overflow: 'auto'
            }}>
              {storageInfo.localStorage.studyMateUsers || 'Пусто'}
            </pre>
          </div>
          
          <div>
            <h4 style={{ margin: '0 0 0.5rem 0', color: '#6b7280' }}>currentUser:</h4>
            <pre style={{ 
              margin: 0, 
              background: '#f8fafc', 
              padding: '1rem', 
              borderRadius: '4px',
              border: '1px solid #e2e8f0',
              overflow: 'auto'
            }}>
              {storageInfo.localStorage.currentUser || 'Пусто'}
            </pre>
          </div>
        </div>
      </div>

      {/* Действия */}
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ color: '#374151', marginBottom: '1rem' }}>Действия</h2>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <button 
            onClick={() => {
              resetAllData();
              setTimeout(() => window.location.reload(), 500);
            }}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#ef4444',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            Сбросить все данные
          </button>

          <button 
            onClick={() => window.location.href = '/login'}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            Страница входа
          </button>

          <button 
            onClick={() => window.location.href = '/register'}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#8b5cf6',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            Страница регистрации
          </button>

          <button 
            onClick={testRegistration}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            Тест регистрации (в консоль)
          </button>

          <button 
            onClick={debugAuthFlow}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#f59e0b',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            Отладка аутентификации
          </button>
        </div>
      </div>

      {/* Инструкция */}
      <div style={{ 
        padding: '1.5rem', 
        background: '#fffbeb', 
        borderRadius: '8px', 
        border: '1px solid #fcd34d' 
      }}>
        <h3 style={{ color: '#d97706', margin: '0 0 1rem 0' }}>Инструкция по отладке:</h3>
        <ol style={{ margin: 0, paddingLeft: '1.5rem', color: '#92400e' }}>
          <li><strong>Откройте консоль браузера (F12)</strong> для просмотра логов</li>
          <li>При регистрации проверьте, что пользователь добавляется в список</li>
          <li>При входе убедитесь, что username и password совпадают</li>
          <li>Если проблемы - используйте кнопку "Сбросить все данные"</li>
          <li>Для теста используйте готовых пользователей: student/123456 или teacher/123456</li>
          <li><strong>ВАЖНО:</strong> При регистрации теперь нужно вводить отдельно имя и username!</li>
        </ol>
      </div>
    </div>
  );
};

export default Debug;