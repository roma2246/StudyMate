// src/services/auth.js

// Ключи для localStorage
const USERS_KEY = 'studyMateUsers';
const CURRENT_USER_KEY = 'currentUser';

// Получить всех пользователей
const getUsers = () => {
  try {
    const usersStr = localStorage.getItem(USERS_KEY);
    return usersStr ? JSON.parse(usersStr) : [];
  } catch (error) {
    console.error('Ошибка при получении пользователей:', error);
    return [];
  }
};

// Сохранить пользователей
const saveUsers = (users) => {
  try {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    console.log('Пользователи сохранены:', users);
  } catch (error) {
    console.error('Ошибка при сохранении пользователей:', error);
  }
};

// Инициализация начальных пользователей
const initializeUsers = () => {
  const existingUsers = getUsers();
  if (existingUsers.length === 0) {
    const initialUsers = [
      { 
        id: 1, 
        username: 'student', 
        password: '123456', 
        role: 'student', 
        name: 'Иван Студентов' 
      },
      { 
        id: 2, 
        username: 'teacher', 
        password: '123456', 
        role: 'teacher', 
        name: 'Мария Преподавателева' 
      }
    ];
    saveUsers(initialUsers);
    console.log('Инициализированы начальные пользователи:', initialUsers);
  }
};

// Инициализируем при загрузке
initializeUsers();

export const login = async (username, password) => {
  console.log('=== ПОПЫТКА ВХОДА ===');
  console.log('Введенные данные:', { username, password });
  
  // Имитация задержки
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Получаем пользователей
  const users = getUsers();
  console.log('Все пользователи в системе:', users);
  
  // Ищем пользователя
  const user = users.find(u => 
    u.username.toLowerCase() === username.toLowerCase() && 
    u.password === password
  );
  
  console.log('Найденный пользователь:', user);
  
  if (user) {
    // Сохраняем текущего пользователя
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    console.log('Пользователь успешно залогинен:', user);
    return user;
  } else {
    console.log('Пользователь не найден');
    throw new Error('Неверное имя пользователя или пароль');
  }
};

export const register = async (name, username, role, password) => {
  console.log('=== РЕГИСТРАЦИЯ ===');
  console.log('Данные для регистрации:', { name, username, role, password });
  
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Получаем текущих пользователей
  const users = getUsers();
  console.log('Текущие пользователи:', users);
  
  // Проверяем, нет ли пользователя с таким username
  const existingUser = users.find(u => u.username.toLowerCase() === username.toLowerCase());
  if (existingUser) {
    console.log('Пользователь уже существует:', existingUser);
    throw new Error('Пользователь с таким именем уже существует');
  }
  
  // Создаем нового пользователя
  const newUser = {
    id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
    username: username,
    password: password,
    role: role,
    name: name
  };
  
  console.log('Новый пользователь создан:', newUser);
  
  // Добавляем пользователя и сохраняем
  const updatedUsers = [...users, newUser];
  saveUsers(updatedUsers);
  
  // Автоматически логиним
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser));
  console.log('Пользователь автоматически залогинен');
  
  return newUser;
};

export const logout = () => {
  localStorage.removeItem(CURRENT_USER_KEY);
  console.log('Пользователь вышел из системы');
};

export const getCurrentUser = () => {
  try {
    const userStr = localStorage.getItem(CURRENT_USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  } catch (error) {
    console.error('Ошибка при получении текущего пользователя:', error);
    return null;
  }
};

export const getUserRole = () => {
  const user = getCurrentUser();
  return user ? user.role : null;
};

export const getUserName = () => {
  const user = getCurrentUser();
  return user ? user.name : null;
};

export const isAuthenticated = () => {
  return !!getCurrentUser();
};

// Функции для отладки
export const debugUsers = () => {
  return getUsers();
};

export const resetAllData = () => {
  localStorage.removeItem(USERS_KEY);
  localStorage.removeItem(CURRENT_USER_KEY);
  initializeUsers();
  console.log('Все данные сброшены');
};

export const getStorageInfo = () => {
  return {
    users: getUsers(),
    currentUser: getCurrentUser(),
    localStorage: {
      studyMateUsers: localStorage.getItem(USERS_KEY),
      currentUser: localStorage.getItem(CURRENT_USER_KEY)
    }
  };
};