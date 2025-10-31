import React from 'react';

const Card = ({ title, value, icon, color = 'blue' }) => {
  const colorStyles = {
    blue: { background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)' },
    green: { background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' },
    yellow: { background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' },
    purple: { background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)' },
    red: { background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' }
  };

  return (
    <div style={styles.card}>
      <div style={styles.cardContent}>
        <div style={styles.cardInfo}>
          <h3 style={styles.cardTitle}>{title}</h3>
          <div style={styles.cardValue}>{value}</div>
        </div>
        <div style={{...styles.cardIcon, ...colorStyles[color]}}>
          {icon}
        </div>
      </div>
    </div>
  );
};

const styles = {
  card: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '1.5rem',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    border: '1px solid #e5e7eb'
  },
  cardContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  cardInfo: {
    flex: 1
  },
  cardTitle: {
    fontSize: '0.875rem',
    fontWeight: '500',
    color: '#6b7280',
    margin: '0 0 0.5rem 0'
  },
  cardValue: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#1f2937',
    margin: 0
  },
  cardIcon: {
    width: '60px',
    height: '60px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.5rem',
    color: 'white'
  }
};

export default Card;