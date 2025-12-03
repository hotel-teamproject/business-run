const BusinessStatsCards = ({ stats }) => {
  if (!stats) return null;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("ko-KR", {
      style: "currency",
      currency: "KRW",
    }).format(amount);
  };

  // 안전하게 값 추출 (undefined 방지)
  const totalRevenue = stats.totalRevenue || 0;
  const monthlyRevenue = stats.monthlyRevenue || 0;
  const bookingCount = stats.bookingCount || 0;
  const monthlyBookingCount = stats.monthlyBookingCount || 0;
  const averageRating = stats.averageRating || 0;
  const reviewCount = stats.reviewCount || 0;
  const occupancyRate = stats.occupancyRate || 0;

  const cards = [
    {
      title: "총 매출",
      value: formatCurrency(totalRevenue),
      change: totalRevenue > 0 ? `+${((monthlyRevenue / totalRevenue) * 100).toFixed(1)}%` : "0%",
      trend: "up",
      icon: "💰",
    },
    {
      title: "이번 달 매출",
      value: formatCurrency(monthlyRevenue),
      change: `전월 대비`,
      trend: "up",
      icon: "📈",
    },
    {
      title: "예약 건수",
      value: `${bookingCount}건`,
      change: `이번 달 ${monthlyBookingCount}건`,
      trend: "up",
      icon: "📅",
    },
    {
      title: "평균 평점",
      value: `${averageRating.toFixed(1)}점`,
      change: `리뷰 ${reviewCount}개`,
      trend: "neutral",
      icon: "⭐",
    },
    {
      title: "객실 점유율",
      value: `${occupancyRate}%`,
      change: "현재",
      trend: "neutral",
      icon: "🏨",
    },
  ];

  return (
    <div className="business-stats-cards">
      {cards.map((card, index) => (
        <div key={index} className="stat-card">
          <div className="stat-card-header">
            <span className="stat-icon">{card.icon}</span>
            <span className="stat-title">{card.title}</span>
          </div>
          <div className="stat-card-body">
            <div className="stat-value">{card.value}</div>
            <div className={`stat-change ${card.trend}`}>{card.change}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BusinessStatsCards;

