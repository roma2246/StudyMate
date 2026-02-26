import React from 'react';

const Chart = ({ type, title, data = [] }) => {
  const safeData = Array.isArray(data) ? data : [];

  const renderBarChart = () => {
    const maxVal = Math.max(...safeData.map(d => d.value), 1);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
        {safeData.length === 0 ? (
          <div style={s.empty}>Нет данных</div>
        ) : (
          safeData.map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
              <div style={s.barLabel}>{item.label}</div>
              <div style={s.barTrack}>
                <div
                  style={{
                    ...s.barFill,
                    width: `${(item.value / maxVal) * 100}%`,
                    background: item.color || 'linear-gradient(90deg, #3b82f6, #1d4ed8)',
                  }}
                />
              </div>
              <div style={{ ...s.barVal, color: item.color || '#60a5fa' }}>{item.value}</div>
            </div>
          ))
        )}
      </div>
    );
  };

  const renderPieChart = () => {
    const total = safeData.reduce((sum, d) => sum + d.value, 0) || 1;
    let cumulative = 0;

    const gradientParts = safeData.map((item, i) => {
      const pct = (item.value / total) * 100;
      const part = `${item.color || '#3b82f6'} ${cumulative.toFixed(1)}% ${(cumulative + pct).toFixed(1)}%`;
      cumulative += pct;
      return part;
    }).join(', ');

    const conicGradient = `conic-gradient(${gradientParts})`;

    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}>
        {safeData.length === 0 ? (
          <div style={s.empty}>Нет данных</div>
        ) : (
          <>
            <div style={{
              width: '140px',
              height: '140px',
              borderRadius: '50%',
              background: conicGradient,
              flexShrink: 0,
              boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
            }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', flex: 1 }}>
              {safeData.map((item, i) => {
                const pct = Math.round((item.value / total) * 100);
                return (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{
                      width: '10px', height: '10px', borderRadius: '50%',
                      background: item.color || '#3b82f6', flexShrink: 0,
                    }} />
                    <span style={s.legendLabel}>{item.label}</span>
                    <span style={{ ...s.legendVal, color: item.color || '#60a5fa' }}>
                      {item.value} ({pct}%)
                    </span>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <div style={s.wrap}>
      <h3 style={s.title}>{title}</h3>
      {type === 'bar' ? renderBarChart() : renderPieChart()}
    </div>
  );
};

const s = {
  wrap: {
    background: 'transparent',
    borderRadius: '12px',
  },
  title: {
    fontSize: '0.9375rem',
    fontWeight: '700',
    color: 'rgba(255,255,255,0.9)',
    margin: '0 0 1.25rem 0',
  },
  barLabel: {
    width: '110px',
    fontSize: '0.8125rem',
    color: 'rgba(255,255,255,0.55)',
    textAlign: 'right',
    flexShrink: 0,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    fontWeight: '500',
  },
  barTrack: {
    flex: 1,
    height: '8px',
    background: 'rgba(255,255,255,0.08)',
    borderRadius: '100px',
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: '100px',
    transition: 'width 0.5s ease',
  },
  barVal: {
    width: '32px',
    fontSize: '0.8125rem',
    fontWeight: '700',
    textAlign: 'right',
    flexShrink: 0,
  },
  legendLabel: {
    fontSize: '0.8125rem',
    color: 'rgba(255,255,255,0.55)',
    flex: 1,
    fontWeight: '500',
  },
  legendVal: {
    fontSize: '0.8125rem',
    fontWeight: '700',
  },
  empty: {
    color: 'rgba(255,255,255,0.25)',
    fontSize: '0.9rem',
    textAlign: 'center',
    padding: '2rem 0',
    fontWeight: '500',
  },
};

export default Chart;