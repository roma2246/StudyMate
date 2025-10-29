import React from 'react';
import { useNavigate } from 'react-router-dom';

const Error = () => {
  const navigate = useNavigate();

  return (
    <div className="error-page">
      <div className="error-container">
        <div className="error-content">
          <h1 className="error-code">404</h1>
          <h2 className="error-title">Страница не найдена</h2>
          <p className="error-message">
            Извините, страница, которую вы ищете, не существует или была перемещена.
          </p>
          <button 
            className="btn btn-primary" 
            onClick={() => navigate(-1)}
          >
            Назад
          </button>
        </div>
      </div>
    </div>
  );
};

export default Error;