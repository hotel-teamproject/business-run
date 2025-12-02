const BusinessStatsCards = ({ stats }) => {
  if (!stats) return null;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("ko-KR", {
      style: "currency",
      currency: "KRW",
    }).format(amount);
  };

  const cards = [
    {
      title: "총 매출",
      value: formatCurrency(stats.totalRevenue || 0),
      change: stats.totalRevenue && stats.totalRevenue > 0 
        ? `+${((stats.monthlyRevenue || 0) / stats.totalRevenue * 100).toFixed(1)}%`
        : "0%",
      trend: "up",
      icon: "💰",
    },
    {
      title: "이번 달 매출",
      value: formatCurrency(stats.monthlyRevenue || 0),
      change: `전월 대비`,
      trend: "up",
      icon: "📈",
    },
    {
      title: "예약 건수",
      value: `${stats.bookingCount || 0}건`,
      change: `이번 달 ${stats.monthlyBookingCount || 0}건`,
      trend: "up",
      icon: "📅",
    },
    {
      title: "평균 평점",
      value: `${(stats.averageRating || 0).toFixed(1)}점`,
      change: `리뷰 ${stats.reviewCount || 0}개`,
      trend: "neutral",
      icon: "⭐",
    },
    {
      title: "객실 점유율",
      value: `${stats.occupancyRate || 0}%`,
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

