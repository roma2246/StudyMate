import React from 'react';

const Table = ({ columns, data, actions, onAction }) => {
  const getActionStyle = (type) => {
    switch (type) {
      case 'primary':
        return styles.primaryButton;
      case 'secondary':
        return styles.secondaryButton;
      case 'danger':
        return styles.dangerButton;
      default:
        return styles.defaultButton;
    }
  };

  return (
    <div style={styles.tableContainer}>
      <table style={styles.table}>
        <thead>
          <tr>
            {columns.map((column, index) => (
              <th key={index} style={styles.th}>
                {column.header}
              </th>
            ))}
            {actions && actions.length > 0 && (
              <th key="actions" style={styles.th}>
                Действия
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} style={styles.tr}>
              {columns.map((column, colIndex) => (
                <td key={colIndex} style={styles.td}>
                  {row[column.key]}
                </td>
              ))}
              {actions && actions.length > 0 && (
                <td key="actions" style={{ ...styles.td, ...styles.actionsCell }}>
                  <div style={styles.actionsContainer}>
                    {actions.map((action, actionIndex) => (
                      <button
                        key={actionIndex}
                        onClick={() => onAction && onAction(action.name, row)}
                        style={{
                          ...styles.actionButton,
                          ...getActionStyle(action.type)
                        }}
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
        <div style={styles.emptyState}>
          Нет данных для отображения
        </div>
      )}
    </div>
  );
};

const styles = {
  tableContainer: {
    backgroundColor: 'white',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    border: '1px solid #e5e7eb'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse'
  },
  th: {
    backgroundColor: '#f8fafc',
    padding: '1rem',
    textAlign: 'left',
    fontSize: '0.875rem',
    fontWeight: '600',
    color: '#374151',
    borderBottom: '1px solid #e5e7eb'
  },
  tr: {
    borderBottom: '1px solid #f3f4f6'
  },
  td: {
    padding: '1rem',
    fontSize: '0.875rem',
    color: '#6b7280',
    borderBottom: '1px solid #f3f4f6'
  },
  emptyState: {
    padding: '2rem',
    textAlign: 'center',
    color: '#9ca3af',
    fontSize: '0.875rem'
  },
  actionsCell: {
    whiteSpace: 'nowrap',
    width: 'auto'
  },
  actionsContainer: {
    display: 'flex',
    gap: '0.5rem',
    flexWrap: 'wrap'
  },
  actionButton: {
    padding: '0.375rem 0.75rem',
    fontSize: '0.75rem',
    fontWeight: '500',
    border: 'none',
    borderRadius: '0.375rem',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    whiteSpace: 'nowrap'
  },
  primaryButton: {
    backgroundColor: '#3b82f6',
    color: 'white'
  },
  secondaryButton: {
    backgroundColor: '#6b7280',
    color: 'white'
  },
  dangerButton: {
    backgroundColor: '#ef4444',
    color: 'white'
  },
  defaultButton: {
    backgroundColor: '#e5e7eb',
    color: '#374151'
  }
};

export default Table;