import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { businessSettlementApi } from "../../api/businessApi";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";
import StatusBadge from "../../components/common/StatusBadge";

const BusinessSettlementDetailPage = () => {
  const { settlementId } = useParams();
  const navigate = useNavigate();
  const [settlement, setSettlement] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchSettlement();
  }, [settlementId]);

  const fetchSettlement = async () => {
    try {
      setLoading(true);
      const data = await businessSettlementApi.getSettlementById(settlementId);
      setSettlement(data);
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

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) return <Loader fullScreen />;
  if (error) return <ErrorMessage message={error} onRetry={fetchSettlement} />;
  if (!settlement) return <div>정산 내역을 찾을 수 없습니다.</div>;

  return (
    <div className="business-settlement-detail-page">
      <div className="page-header">
        <button className="btn btn-outline" onClick={() => navigate("/business/settlements")}>
          ← 목록으로
        </button>
        <h1>정산 상세</h1>
      </div>

      <div className="settlement-detail">
        <div className="settlement-card">
          <div className="settlement-header">
            <h2>{settlement.month} 정산 내역</h2>
            <StatusBadge
              status={settlement.status}
              label={settlement.status === "completed" ? "완료" : "대기"}
            />
          </div>

          <div className="settlement-details">
            <div className="detail-section">
              <h3>정산 정보</h3>
              <div className="detail-grid">
                <div className="detail-item">
                  <label>정산 월</label>
                  <span>{settlement.month}</span>
                </div>
                <div className="detail-item">
                  <label>상태</label>
                  <StatusBadge
                    status={settlement.status}
                    label={settlement.status === "completed" ? "완료" : "대기"}
                  />
                </div>
                <div className="detail-item">
                  <label>지급 예정일</label>
                  <span>{formatDate(settlement.paymentDate)}</span>
                </div>
                {settlement.createdAt && (
                  <div className="detail-item">
                    <label>생성일</label>
                    <span>{formatDate(settlement.createdAt)}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="detail-section">
              <h3>금액 정보</h3>
              <div className="detail-grid">
                <div className="detail-item">
                  <label>총 예약 금액</label>
                  <span className="amount">{formatCurrency(settlement.totalRevenue)}</span>
                </div>
                <div className="detail-item">
                  <label>플랫폼 수수료 (5%)</label>
                  <span className="amount negative">
                    -{formatCurrency(settlement.platformFee)}
                  </span>
                </div>
                <div className="detail-item">
                  <label>세금 (10%)</label>
                  <span className="amount negative">-{formatCurrency(settlement.tax)}</span>
                </div>
                <div className="detail-item total">
                  <label>실 정산 금액</label>
                  <span className="amount total">{formatCurrency(settlement.finalAmount)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessSettlementDetailPage;

