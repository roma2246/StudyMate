import React, { useState } from 'react';

const GRADIENTS = {
  blue: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
  green: 'linear-gradient(135deg, #10b981, #059669)',
  yellow: 'linear-gradient(135deg, #f59e0b, #d97706)',
  purple: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
  red: 'linear-gradient(135deg, #ef4444, #dc2626)',
};

const ACCENT_COLORS = {
  blue: '#3b82f6',
  green: '#10b981',
  yellow: '#f59e0b',
  purple: '#8b5cf6',
  red: '#ef4444',
};

const Card = ({ title, value, subtitle, icon, color = 'blue' }) => {
  const [hovered, setHovered] = useState(false);
  const accent = ACCENT_COLORS[color] || ACCENT_COLORS.blue;

  return (
    <div
      style={{
        background: 'rgba(15, 23, 42, 0.45)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderRadius: '16px',
        padding: '1.375rem 1.5rem',
        border: `1px solid rgba(255,255,255,0.12)`,
        borderTop: `2px solid ${accent}`,
        transition: 'all 0.22s ease',
        cursor: 'default',
        transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
        boxShadow: hovered
          ? `0 16px 40px rgba(0,0,0,0.35), 0 0 0 1px ${accent}33`
          : '0 4px 16px rgba(0,0,0,0.2)',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          <div style={{
            fontSize: '0.7rem',
            fontWeight: '700',
            color: 'rgba(255,255,255,0.4)',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            marginBottom: '0.5rem',
          }}>
            {title}
          </div>
          <div style={{
            fontSize: '2.25rem',
            fontWeight: '800',
            color: '#fff',
            lineHeight: 1.1,
            marginBottom: '0.25rem',
            letterSpacing: '-0.02em',
          }}>
            {value}
          </div>
          {subtitle && (
            <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)', fontWeight: '500' }}>
              {subtitle}
            </div>
          )}
        </div>
        <div style={{
          width: '48px',
          height: '48px',
          borderRadius: '12px',
          background: GRADIENTS[color] || GRADIENTS.blue,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.375rem',
          color: 'white',
          flexShrink: 0,
          marginLeft: '1rem',
          boxShadow: `0 8px 20px ${accent}50`,
        }}>
          {icon}
        </div>
      </div>
    </div>
  );
};

export default Card;