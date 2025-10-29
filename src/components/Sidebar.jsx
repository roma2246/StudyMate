import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = ({ role }) => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  const teacherMenuItems = [
    { name: 'Главная', path: '/teacher/dashboard' },
    { name: 'Студенты', path: '/teacher/students' },
    { name: 'Предметы', path: '/teacher/subjects' },
    { name: 'Оценки', path: '/teacher/grades' },
    { name: 'Рейтинг', path: '/teacher/rating' },
  ];

  const studentMenuItems = [
    { name: 'Главная', path: '/student/dashboard' },
    { name: 'Мои оценки', path: '/student/grades' },
    { name: 'Профиль', path: '/student/profile' },
  ];

  const menuItems = role === 'teacher' ? teacherMenuItems : studentMenuItems;

  return (
    <div className="sidebar">
      <ul className="sidebar-menu">
        {menuItems.map((item, index) => (
          <li key={index} className={isActive(item.path) ? 'active' : ''}>
            <Link to={item.path}>{item.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;