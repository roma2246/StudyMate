// Authentication service for handling login, registration, and token management

const AUTH_TOKEN_KEY = 'student_progress_token';
const USER_ROLE_KEY = 'user_role';
const USER_NAME_KEY = 'user_name';

// Simulate API call for login
export const login = async (username, password) => {
  // In a real app, this would be an actual API call
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (username && password) {
        // Simulate successful login
        const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9'; // Mock JWT token
        const role = username === 'teacher' ? 'teacher' : 'student';
        const name = username === 'teacher' ? 'Преподаватель' : 'Студент';
        
        localStorage.setItem(AUTH_TOKEN_KEY, token);
        localStorage.setItem(USER_ROLE_KEY, role);
        localStorage.setItem(USER_NAME_KEY, name);
        
        resolve({ token, role, name });
      } else {
        reject(new Error('Неверное имя пользователя или пароль'));
      }
    }, 500);
  });
};

// Simulate API call for registration
export const register = async (name, role, password) => {
  // In a real app, this would be an actual API call
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (name && role && password) {
        resolve({ message: 'Аккаунт успешно создан' });
      } else {
        reject(new Error('Заполните все поля'));
      }
    }, 500);
  });
};

// Logout function
export const logout = () => {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(USER_ROLE_KEY);
  localStorage.removeItem(USER_NAME_KEY);
};

// Get stored token
export const getToken = () => {
  return localStorage.getItem(AUTH_TOKEN_KEY);
};

// Get user role
export const getUserRole = () => {
  return localStorage.getItem(USER_ROLE_KEY);
};

// Get user name
export const getUserName = () => {
  return localStorage.getItem(USER_NAME_KEY);
};

// Check if user is authenticated
export const isAuthenticated = () => {
  return !!getToken();
};