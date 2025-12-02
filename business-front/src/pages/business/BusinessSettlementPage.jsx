import { useState, useEffect } from "react";
import { businessSettlementApi } from "../../api/businessApi";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";
import StatusBadge from "../../components/common/StatusBadge";

const BusinessSettlementPage = () => {
  const [settlements, setSettlements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchSettlements();
  }, []);

  const fetchSettlements = async () => {
    try {
      setLoading(true);
      const data = await businessSettlementApi.getSettlements();
      setSettlements(data.settlements);
    } catch (err) {
      setError(err.message || "정산 내역을 불러오는데 실패했습니다.");
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
  if (error) return <ErrorMessage message={error} onRetry={fetchSettlements} />;

  return (
    <div className="business-settlement-page">
      <div className="page-header">
        <h1>정산 관리</h1>
        <p>월별 정산 내역을 확인하세요</p>
      </div>

      {settlements.length === 0 ? (
        <div className="empty-state">
          <p>정산 내역이 없습니다.</p>
        </div>
      ) : (
        <div className="settlement-list">
          {settlements.map((settlement) => (
            <div key={settlement._id} className="settlement-card">
              <div className="settlement-header">
                <h3>{settlement.month} 정산</h3>
                <StatusBadge
                  status={settlement.status}
                  label={settlement.status === "completed" ? "완료" : "대기"}
                />
              </div>
              <div className="settlement-details">
                <div className="settlement-item">
                  <label>총 예약 금액</label>
                  <span>{formatCurrency(settlement.totalRevenue)}</span>
                </div>
                <div className="settlement-item">
                  <label>플랫폼 수수료 (5%)</label>
                  <span>-{formatCurrency(settlement.platformFee)}</span>
                </div>
                <div className="settlement-item">
                  <label>세금 (10%)</label>
                  <span>-{formatCurrency(settlement.tax)}</span>
                </div>
                <div className="settlement-item total">
                  <label>실 정산 금액</label>
                  <span>{formatCurrency(settlement.finalAmount)}</span>
                </div>
                <div className="settlement-item">
                  <label>지급 예정일</label>
                  <span>{settlement.paymentDate}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BusinessSettlementPage;

