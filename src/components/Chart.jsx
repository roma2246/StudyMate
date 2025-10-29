import React from 'react';

const Chart = ({ type, data, title }) => {
  // This is a simplified chart component
  // In a real application, you would use a library like Chart.js or Recharts
  
  const renderBarChart = () => {
    const maxValue = Math.max(...data.map(item => item.value));
    
    return (
      <div className="chart-container">
        <h3>{title}</h3>
        <div className="bar-chart">
          {data.map((item, index) => (
            <div key={index} className="bar-container">
              <div 
                className="bar" 
                style={{ height: `${(item.value / maxValue) * 100}%` }}
              >
                <span className="bar-value">{item.value}</span>
              </div>
              <span className="bar-label">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderPieChart = () => {
    return (
      <div className="chart-container">
        <h3>{title}</h3>
        <div className="pie-chart-placeholder">
          <p>Диаграмма ({data.length} элементов)</p>
          <ul>
            {data.map((item, index) => (
              <li key={index}>{item.label}: {item.value}</li>
            ))}
          </ul>
        </div>
      </div>
    );
  };

  if (type === 'bar') {
    return renderBarChart();
  } else if (type === 'pie') {
    return renderPieChart();
  }

  return <div>Неизвестный тип диаграммы</div>;
};

export default Chart;