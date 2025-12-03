import { useState, useEffect } from "react";
import { businessDashboardApi } from "../../api/businessApi";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";
import BusinessStatsCards from "../../components/business/dashboard/BusinessStatsCards";
import BusinessChartArea from "../../components/business/dashboard/BusinessChartArea";
import BusinessRecentTable from "../../components/business/dashboard/BusinessRecentTable";

const BusinessDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const data = await businessDashboardApi.getDashboardStats();
      setStats(data);
    } catch (err) {
      setError(err.message || "데이터를 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader fullScreen />;
  if (error)
    return <ErrorMessage message={error} onRetry={fetchDashboardStats} />;

  return (
    <div className="business-dashboard-page">
      <div className="page-header">
        <h1>대시보드</h1>
        <p>호텔 운영 현황을 한눈에 확인하세요</p>
      </div>

      <BusinessStatsCards stats={stats} />
      <BusinessChartArea data={stats?.chartData} />
      <BusinessRecentTable
        bookings={stats?.recentBookings || []}
        reviews={stats?.recentReviews || []}
      />
    </div>
  );
};

export default BusinessDashboardPage;

