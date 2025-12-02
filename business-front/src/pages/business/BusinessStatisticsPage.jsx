import { useState, useEffect } from "react";
import { businessStatsApi } from "../../api/businessApi";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";

const BusinessStatisticsPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      const data = await businessStatsApi.getStatistics();
      setStats(data);
    } catch (err) {
      setError(err.message || "통계 데이터를 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("ko-KR", {
      style: "currency",
      currency: "KRW",
    }).format(amount);
  };

  if (loading) return <Loader fullScreen />;
  if (error) return <ErrorMessage message={error} onRetry={fetchStatistics} />;

  return (
    <div className="business-statistics-page">
      <div className="page-header">
        <h1>통계</h1>
        <p>호텔 운영 통계를 확인하세요</p>
      </div>

      {stats && (
        <div className="statistics-grid">
          <div className="stat-card">
            <h3>총 매출</h3>
            <div className="stat-value">{formatCurrency(stats.revenue.total)}</div>
            <div className="stat-detail">
              <span>이번 달: {formatCurrency(stats.revenue.monthly)}</span>
              <span>오늘: {formatCurrency(stats.revenue.daily)}</span>
            </div>
          </div>

          <div className="stat-card">
            <h3>예약 건수</h3>
            <div className="stat-value">{stats.bookings.total}건</div>
            <div className="stat-detail">
              <span>이번 달: {stats.bookings.monthly}건</span>
              <span>오늘: {stats.bookings.daily}건</span>
            </div>
          </div>

          <div className="stat-card">
            <h3>객실 점유율</h3>
            <div className="stat-value">{stats.occupancy.rate}%</div>
            <div className="stat-detail">
              <span>전체 객실: {stats.occupancy.totalRooms}개</span>
              <span>예약 객실: {stats.occupancy.bookedRooms}개</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BusinessStatisticsPage;

