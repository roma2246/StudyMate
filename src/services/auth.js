// src/services/auth.js

// Backend URL logic:
// If running inside Docker Compose frontend (Nginx), it serves from /. The proxy passes /api/ to backend:8080.
// If running from Vite directly (localhost:5173), we want to hit localhost:8080.
const CURRENT_USER_KEY = 'currentUser';
const BASE_URL = import.meta.env.VITE_API_URL || (window.location.port === '5173' ? 'http://localhost:8080' : '');

const postJSON = async (path, payload) => {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `HTTP ${res.status}`);
  }
  return res.json();
};

export const login = async (username, password) => {
  const user = await postJSON('/api/auth/login', { username, password });
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  return user;
};

export const register = async (name, username, role, password) => {
  const user = await postJSON('/api/auth/register', { name, username, role, password });
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  return user;
};

export const logout = () => {
  localStorage.removeItem(CURRENT_USER_KEY);
};

export const getCurrentUser = () => {
  try {
    const userStr = localStorage.getItem(CURRENT_USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  } catch {
    return null;
  }
};

export const getUserRole = () => getCurrentUser()?.role ?? null;
export const getUserName = () => getCurrentUser()?.name ?? null;
export const isAuthenticated = () => !!getCurrentUser();
export const getToken = () => null; // заглушка для совместимости с api.js (JWT отключён)

// Отладка — отражаем текущее состояние localStorage
export const debugUsers = () => [];
export const resetAllData = () => {
  localStorage.removeItem(CURRENT_USER_KEY);
};
export const getStorageInfo = () => ({
  users: [],
  currentUser: getCurrentUser(),
  localStorage: {
    currentUser: localStorage.getItem(CURRENT_USER_KEY)
  }
});