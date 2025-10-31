import React from 'react';

const Chart = ({ type, title, data }) => {
  const renderBarChart = () => {
    const maxValue = Math.max(...data.map(item => item.value));
    
    return (
      <div style={styles.chartContainer}>
        {data.map((item, index) => (
          <div key={index} style={styles.barItem}>
            <div style={styles.barLabel}>{item.label}</div>
            <div style={styles.barTrack}>
              <div 
                style={{
                  ...styles.barFill,
                  width: `${(item.value / maxValue) * 100}%`,
                  backgroundColor: '#3b82f6'
                }}
              />
            </div>
            <div style={styles.barValue}>{item.value}</div>
          </div>
        ))}
      </div>
    );
  };

  const renderPieChart = () => {
    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
    
    return (
      <div style={styles.pieContainer}>
        <div style={styles.pieChart}>
          {data.map((item, index) => {
            const percentage = (item.value / data.reduce((sum, d) => sum + d.value, 0)) * 100;
            return (
              <div
                key={index}
                style={{
                  ...styles.pieSegment,
                  backgroundColor: colors[index % colors.length],
                  transform: `rotate(${data.slice(0, index).reduce((sum, d) => sum + (d.value / data.reduce((total, item) => total + item.value, 0)) * 360, 0)}deg)`,
                  clipPath: `conic-gradient(from 0deg at 50% 50%, ${colors[index % colors.length]} 0% ${percentage}%, transparent ${percentage}% 100%)`
                }}
              />
            );
          })}
        </div>
        <div style={styles.pieLegend}>
          {data.map((item, index) => (
            <div key={index} style={styles.legendItem}>
              <div 
                style={{
                  ...styles.legendColor,
                  backgroundColor: colors[index % colors.length]
                }} 
              />
              <span style={styles.legendLabel}>{item.label}</span>
              <span style={styles.legendValue}>({item.value})</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div style={styles.chart}>
      <h3 style={styles.chartTitle}>{title}</h3>
      {type === 'bar' ? renderBarChart() : renderPieChart()}
    </div>
  );
};

const styles = {
  chart: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '1.5rem',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    border: '1px solid #e5e7eb'
  },
  chartTitle: {
    fontSize: '1.125rem',
    fontWeight: '600',
    color: '#1f2937',
    margin: '0 0 1rem 0'
  },
  chartContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem'
  },
  barItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem'
  },
  barLabel: {
    width: '100px',
    fontSize: '0.875rem',
    color: '#6b7280',
    textAlign: 'right'
  },
  barTrack: {
    flex: 1,
    height: '20px',
    backgroundColor: '#f3f4f6',
    borderRadius: '10px',
    overflow: 'hidden'
  },
  barFill: {
    height: '100%',
    borderRadius: '10px',
    transition: 'width 0.3s ease'
  },
  barValue: {
    width: '30px',
    fontSize: '0.875rem',
    fontWeight: '600',
    color: '#1f2937',
    textAlign: 'center'
  },
  pieContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '2rem'
  },
  pieChart: {
    width: '150px',
    height: '150px',
    borderRadius: '50%',
    backgroundColor: '#f3f4f6',
    position: 'relative',
    overflow: 'hidden'
  },
  pieSegment: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: '50%'
  },
  pieLegend: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  },
  legendColor: {
    width: '12px',
    height: '12px',
    borderRadius: '2px'
  },
  legendLabel: {
    fontSize: '0.875rem',
    color: '#6b7280'
  },
  legendValue: {
    fontSize: '0.875rem',
    fontWeight: '600',
    color: '#1f2937'
  }
};

export default Chart;