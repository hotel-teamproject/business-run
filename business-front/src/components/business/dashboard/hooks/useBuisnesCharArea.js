export default function useBusiness(stats) {
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
        value: formatCurrency(stats.totalRevenue),
        change: `+${((stats.monthlyRevenue / stats.totalRevenue) * 100).toFixed(1)}%`,
        trend: "up",
        icon: "💰",
      },
      {
        title: "이번 달 매출",
        value: formatCurrency(stats.monthlyRevenue),
        change: `전월 대비`,
        trend: "up",
        icon: "📈",
      },
      {
        title: "예약 건수",
        value: `${stats.bookingCount}건`,
        change: `이번 달 ${stats.monthlyBookingCount}건`,
        trend: "up",
        icon: "📅",
      },
      {
        title: "평균 평점",
        value: `${stats.averageRating.toFixed(1)}점`,
        change: `리뷰 ${stats.reviewCount}개`,
        trend: "neutral",
        icon: "⭐",
      },
      {
        title: "객실 점유율",
        value: `${stats.occupancyRate}%`,
        change: "현재",
        trend: "neutral",
        icon: "🏨",
      },
    ];

    return {
        cards,
        formatCurrency
    }
}