import { useNavigate } from "react-router-dom";

const BusinessRecentTable = ({ bookings, reviews }) => {
  const navigate = useNavigate();

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("ko-KR", {
      style: "currency",
      currency: "KRW",
    }).format(amount);
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      completed: { label: "완료", class: "success" },
      pending: { label: "대기", class: "warning" },
      cancelled: { label: "취소", class: "danger" },
    };
    const statusInfo = statusMap[status] || { label: status, class: "default" };
    return <span className={`badge badge-${statusInfo.class}`}>{statusInfo.label}</span>;
  };

  return (
    <div className="business-recent-table">
      <div className="recent-section">
        <h3>최근 예약</h3>
        {bookings.length === 0 ? (
          <p className="empty-message">최근 예약이 없습니다.</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
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
              {bookings.map((booking) => (
                <tr key={booking.id}>
                  <td>{booking.guestName}</td>
                  <td>{booking.hotelName}</td>
                  <td>{booking.roomName}</td>
                  <td>{booking.checkIn}</td>
                  <td>{booking.checkOut}</td>
                  <td>{formatCurrency(booking.totalPrice)}</td>
                  <td>{getStatusBadge(booking.status)}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-primary"
                      onClick={() => navigate(`/business/reservations/${booking.id}`)}
                    >
                      상세보기
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <div className="section-footer">
          <button
            className="btn btn-outline"
            onClick={() => navigate("/business/reservations")}
          >
            전체 예약 보기
          </button>
        </div>
      </div>

      <div className="recent-section">
        <h3>최근 리뷰</h3>
        {reviews.length === 0 ? (
          <p className="empty-message">최근 리뷰가 없습니다.</p>
        ) : (
          <div className="review-list">
            {reviews.map((review) => (
              <div key={review.id} className="review-item">
                <div className="review-header">
                  <span className="review-user">{review.userName}</span>
                  <span className="review-rating">{"⭐".repeat(review.rating)}</span>
                  <span className="review-date">{review.createdAt}</span>
                </div>
                <div className="review-content">{review.content}</div>
                <div className="review-hotel">{review.hotelName}</div>
              </div>
            ))}
          </div>
        )}
        <div className="section-footer">
          <button
            className="btn btn-outline"
            onClick={() => navigate("/business/reviews")}
          >
            전체 리뷰 보기
          </button>
        </div>
      </div>
    </div>
  );
};

export default BusinessRecentTable;

