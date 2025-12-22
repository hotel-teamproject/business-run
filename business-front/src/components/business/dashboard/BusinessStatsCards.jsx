import useBusiness from "./hooks/useBuisnesCharArea";

const BusinessStatsCards = ({ stats }) => {
  const {
    formatCurrency,
    cards
  } = useBusiness(stats);

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

