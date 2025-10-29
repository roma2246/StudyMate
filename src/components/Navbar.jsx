import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserName, logout } from '../services/auth';

const Navbar = ({ role }) => {
  const navigate = useNavigate();
  const userName = getUserName();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <h2>Student Progress Dashboard</h2>
      </div>
      <div className="navbar-menu">
        <div className="navbar-user">
          <span>Привет, {userName || 'Пользователь'}!</span>
          <button className="btn btn-outline" onClick={handleLogout}>
            Выйти
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;