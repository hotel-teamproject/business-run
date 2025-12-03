import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { businessReservationApi } from "../../api/businessApi";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";
import StatusBadge from "../../components/common/StatusBadge";

const BusinessReservationListPage = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    fetchReservations();
  }, [statusFilter]);

  const fetchReservations = async () => {
    try {
      setLoading(true);
      const params = statusFilter !== "all" ? { status: statusFilter } : {};
      const data = await businessReservationApi.getReservations(params);
      setReservations(data.reservations);
    } catch (err) {
      setError(err.message || "예약 목록을 불러오는데 실패했습니다.");
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
  if (error) return <ErrorMessage message={error} onRetry={fetchReservations} />;

  return (
    <div className="business-reservation-list-page">
      <div className="page-header">
        <h1>예약 관리</h1>
      </div>

      <div className="filter-section">
        <button
          className={`filter-btn ${statusFilter === "all" ? "active" : ""}`}
          onClick={() => setStatusFilter("all")}
        >
          전체
        </button>
        <button
          className={`filter-btn ${statusFilter === "pending" ? "active" : ""}`}
          onClick={() => setStatusFilter("pending")}
        >
          대기
        </button>
        <button
          className={`filter-btn ${statusFilter === "completed" ? "active" : ""}`}
          onClick={() => setStatusFilter("completed")}
        >
          완료
        </button>
        <button
          className={`filter-btn ${statusFilter === "cancelled" ? "active" : ""}`}
          onClick={() => setStatusFilter("cancelled")}
        >
          취소
        </button>
      </div>

      {reservations.length === 0 ? (
        <div className="empty-state">
          <p>예약 내역이 없습니다.</p>
        </div>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>예약번호</th>
              <th>고객명</th>
              <th>호텔</th>
              <th>객실</th>
              <th>체크인</th>
              <th>체크아웃</th>
              <th>금액</th>
              <th>상태</th>
              <th>작업</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map((reservation) => (
              <tr key={reservation._id}>
                <td>{reservation.reservationNumber || reservation._id?.toString().slice(-8).toUpperCase() || ''}</td>
                <td>{reservation.guestName || ''}</td>
                <td>{reservation.hotelName || ''}</td>
                <td>{reservation.roomName || ''}</td>
                <td>{reservation.startDate || (reservation.checkIn ? reservation.checkIn.split('T')[0] : '')}</td>
                <td>{reservation.endDate || (reservation.checkOut ? reservation.checkOut.split('T')[0] : '')}</td>
                <td>{formatCurrency(reservation.totalPrice || 0)}</td>
                <td>
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
                </td>
                <td>
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={() =>
                      navigate(`/business/reservations/${reservation._id}`)
                    }
                  >
                    상세보기
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default BusinessReservationListPage;

