const BusinessChartArea = ({ data }) => {
  if (!data) return null;

  // 최대 막대 개수 (차트 너비 고정을 위해)
  const MAX_BARS = 6;
  const currentBars = data.labels.length;

  // 빈 막대를 추가하여 항상 최대 개수만큼의 공간 유지
  const renderBars = (values, formatValue) => {
    const bars = [];
    
    // 실제 데이터 막대
    for (let i = 0; i < currentBars; i++) {
      const maxValue = Math.max(...values);
      const height = maxValue > 0 ? (values[i] / maxValue) * 100 : 0;
      
      bars.push(
        <div key={i} className="chart-bar-container">
          <div className="chart-bar-wrapper">
            <div
              className="chart-bar"
              style={{
                height: `${height}%`,
              }}
            >
              <span className="chart-value">
                {formatValue ? formatValue(values[i]) : values[i]}
              </span>
            </div>
          </div>
          <span className="chart-label">{data.labels[i]}</span>
        </div>
      );
    }
    
    // 빈 막대 추가 (최대 개수까지)
    for (let i = currentBars; i < MAX_BARS; i++) {
      bars.push(
        <div key={`empty-${i}`} className="chart-bar-container chart-bar-empty">
          <div className="chart-bar-wrapper">
            <div className="chart-bar" style={{ height: '0%' }}></div>
          </div>
          <span className="chart-label"></span>
        </div>
      );
    }
    
    return bars;
  };

  return (
    <div className="business-chart-area">
      <div className="chart-card">
        <h3>매출 추이</h3>
        <div className="chart-container">
          <div className="simple-chart">
            {renderBars(data.revenue, (value) => `${(value / 1000000).toFixed(1)}M`)}
          </div>
        </div>
      </div>

      <div className="chart-card">
        <h3>예약 건수 추이</h3>
        <div className="chart-container">
          <div className="simple-chart">
            {renderBars(data.bookings)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessChartArea;

