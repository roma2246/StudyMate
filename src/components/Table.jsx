import React from 'react';

const Table = ({ columns = [], data = [], actions, onAction }) => {
  const getActionStyle = (type) => {
    switch (type) {
      case 'primary': return s.btnPrimary;
      case 'secondary': return s.btnSecondary;
      case 'danger': return s.btnDanger;
      default: return s.btnDefault;
    }
  };

  return (
    <div style={s.wrap}>
      <table style={s.table}>
        <thead>
          <tr>
            {columns.map((col, i) => (
              <th key={i} style={s.th}>{col.header}</th>
            ))}
            {actions && actions.length > 0 && (
              <th style={s.th}>Действия</th>
            )}
          </tr>
        </thead>
        <tbody>
          {data.map((row, ri) => (
            <tr
              key={ri}
              style={s.tr}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              {columns.map((col, ci) => (
                <td key={ci} style={s.td}>{row[col.key]}</td>
              ))}
              {actions && actions.length > 0 && (
                <td style={{ ...s.td, whiteSpace: 'nowrap' }}>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {actions.map((action, ai) => (
                      <button
                        key={ai}
                        onClick={() => onAction && onAction(action.name, row)}
                        style={{ ...s.actionBtn, ...getActionStyle(action.type) }}
                        title={action.label}
                      >
                        {action.label}
                      </button>
                    ))}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      {data.length === 0 && (
        <div style={s.empty}>
          <span>🔍</span>
          <span>Нет данных для отображения</span>
        </div>
      )}
    </div>
  );
};

const s = {
  wrap: {
    background: 'transparent',
    borderRadius: '12px',
    overflow: 'hidden',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    background: 'rgba(15, 23, 42, 0.45)',
    padding: '0.875rem 1rem',
    textAlign: 'left',
    fontSize: '0.75rem',
    fontWeight: '700',
    color: 'rgba(255,255,255,0.5)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    borderBottom: '1px solid rgba(255,255,255,0.07)',
    whiteSpace: 'nowrap',
  },
  tr: {
    borderBottom: '1px solid rgba(255,255,255,0.05)',
    transition: 'background 0.15s ease',
    cursor: 'default',
  },
  td: {
    padding: '0.875rem 1rem',
    fontSize: '0.875rem',
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '500',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
  },
  empty: {
    padding: '2.5rem',
    textAlign: 'center',
    color: 'rgba(255,255,255,0.25)',
    fontSize: '0.9375rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.5rem',
    fontWeight: '500',
  },
  actionBtn: {
    padding: '0.35rem 0.75rem',
    fontSize: '0.75rem',
    fontWeight: '600',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    whiteSpace: 'nowrap',
  },
  btnPrimary: { background: 'rgba(59,130,246,0.25)', color: '#93c5fd', border: '1px solid rgba(59,130,246,0.3)' },
  btnSecondary: { background: 'rgba(107,114,128,0.25)', color: '#d1d5db', border: '1px solid rgba(107,114,128,0.3)' },
  btnDanger: { background: 'rgba(239,68,68,0.2)', color: '#fca5a5', border: '1px solid rgba(239,68,68,0.3)' },
  btnDefault: { background: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.12)' },
};

export default Table;