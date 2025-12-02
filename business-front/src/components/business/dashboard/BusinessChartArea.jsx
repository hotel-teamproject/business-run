const BusinessChartArea = ({ data }) => {
  if (!data) return null;

  return (
    <div className="business-chart-area">
      <div className="chart-card">
        <h3>매출 추이</h3>
        <div className="chart-container">
          <div className="simple-chart">
            {data.labels.map((label, index) => (
              <div key={index} className="chart-bar-container">
                <div className="chart-bar-wrapper">
                  <div
                    className="chart-bar"
                    style={{
                      height: data.revenue && data.revenue.length > 0 && Math.max(...data.revenue) > 0
                        ? `${(data.revenue[index] / Math.max(...data.revenue)) * 100}%`
                        : '0%',
                    }}
                  >
                    <span className="chart-value">
                      {data.revenue && data.revenue[index] 
                        ? ((data.revenue[index] / 1000000).toFixed(1)) + 'M'
                        : '0M'}
                    </span>
                  </div>
                </div>
                <span className="chart-label">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="chart-card">
        <h3>예약 건수 추이</h3>
        <div className="chart-container">
          <div className="simple-chart">
            {data.labels.map((label, index) => (
              <div key={index} className="chart-bar-container">
                <div className="chart-bar-wrapper">
                  <div
                    className="chart-bar"
                    style={{
                      height: data.bookings && data.bookings.length > 0 && Math.max(...data.bookings) > 0
                        ? `${(data.bookings[index] / Math.max(...data.bookings)) * 100}%`
                        : '0%',
                    }}
                  >
                    <span className="chart-value">{data.bookings && data.bookings[index] ? data.bookings[index] : 0}</span>
                  </div>
                </div>
                <span className="chart-label">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessChartArea;

