import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { businessReservationApi } from "../../api/businessApi";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";
import StatusBadge from "../../components/common/StatusBadge";

const BusinessReservationDetailPage = () => {
  const { reservationId } = useParams();
  const navigate = useNavigate();
  const [reservation, setReservation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchReservation();
  }, [reservationId]);

  const fetchReservation = async () => {
    try {
      setLoading(true);
      const data = await businessReservationApi.getReservationById(reservationId);
      setReservation(data);
    } catch (err) {
      setError(err.message || "예약 정보를 불러오는데 실패했습니다.");
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
  if (error) return <ErrorMessage message={error} />;
  if (!reservation) return <div>예약을 찾을 수 없습니다.</div>;

  return (
    <div className="business-reservation-detail-page">
      <div className="page-header">
        <button className="btn btn-outline" onClick={() => navigate("/business/reservations")}>
          ← 목록으로
        </button>
        <h1>예약 상세</h1>
      </div>

      <div className="reservation-detail">
        <div className="detail-section">
          <h2>예약 정보</h2>
          <div className="detail-grid">
            <div className="detail-item">
              <label>예약번호</label>
              <span>{reservation.reservationNumber}</span>
            </div>
            <div className="detail-item">
              <label>상태</label>
              <StatusBadge
                status={reservation.status}
                label={
                  reservation.status === "completed"
                    ? "완료"
                    : reservation.status === "pending"
                    ? "대기"
                    : "취소"
                }
              />
            </div>
            <div className="detail-item">
              <label>호텔</label>
              <span>{reservation.hotelName}</span>
            </div>
            <div className="detail-item">
              <label>객실</label>
              <span>{reservation.roomName}</span>
            </div>
            <div className="detail-item">
              <label>체크인</label>
              <span>{reservation.startDate}</span>
            </div>
            <div className="detail-item">
              <label>체크아웃</label>
              <span>{reservation.endDate}</span>
            </div>
          </div>
        </div>

        <div className="detail-section">
          <h2>고객 정보</h2>
          <div className="detail-grid">
            <div className="detail-item">
              <label>이름</label>
              <span>{reservation.guestName}</span>
            </div>
            <div className="detail-item">
              <label>이메일</label>
              <span>{reservation.guestEmail}</span>
            </div>
            <div className="detail-item">
              <label>전화번호</label>
              <span>{reservation.guestPhone}</span>
            </div>
            <div className="detail-item">
              <label>인원</label>
              <span>성인 {reservation.numAdult}명, 아동 {reservation.numKid}명</span>
            </div>
          </div>
        </div>

        <div className="detail-section">
          <h2>결제 정보</h2>
          <div className="detail-grid">
            <div className="detail-item">
              <label>기본 요금</label>
              <span>{formatCurrency(reservation.basePrice)}</span>
            </div>
            <div className="detail-item">
              <label>세금</label>
              <span>{formatCurrency(reservation.taxes)}</span>
            </div>
            <div className="detail-item">
              <label>서비스 수수료</label>
              <span>{formatCurrency(reservation.serviceFee)}</span>
            </div>
            <div className="detail-item">
              <label>할인</label>
              <span>-{formatCurrency(reservation.discount)}</span>
            </div>
            <div className="detail-item total">
              <label>총 결제 금액</label>
              <span>{formatCurrency(reservation.totalPrice)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessReservationDetailPage;

