import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { businessHotelApi } from "../../api/businessApi";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";
import StatusBadge from "../../components/common/StatusBadge";

const BusinessHotelListPage = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchHotels();
  }, []);

  const fetchHotels = async () => {
    try {
      setLoading(true);
      const data = await businessHotelApi.getHotels();
      setHotels(data.hotels);
    } catch (err) {
      setError(err.message || "호텔 목록을 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (hotelId) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;

    try {
      await businessHotelApi.deleteHotel(hotelId);
      fetchHotels();
    } catch (err) {
      alert(err.message || "삭제에 실패했습니다.");
    }
  };

  if (loading) return <Loader fullScreen />;
  if (error) return <ErrorMessage message={error} onRetry={fetchHotels} />;

  return (
    <div className="business-hotel-list-page">
      <div className="page-header">
        <h1>호텔 관리</h1>
        <button
          className="btn btn-primary"
          onClick={() => navigate("/business/hotels/new")}
        >
          + 호텔 등록
        </button>
      </div>

      {hotels.length === 0 ? (
        <div className="empty-state">
          <p>등록된 호텔이 없습니다.</p>
          <button
            className="btn btn-primary"
            onClick={() => navigate("/business/hotels/new")}
          >
            첫 호텔 등록하기
          </button>
        </div>
      ) : (
        <div className="hotel-grid">
          {hotels.map((hotel) => (
            <div key={hotel._id} className="hotel-card">
              <div className="hotel-image">
                <img 
                  src={hotel.mainImage || "/placeholder-hotel.jpg"} 
                  alt={hotel.name}
                  onError={(e) => {
                    e.target.src = "/placeholder-hotel.jpg";
                  }}
                />
                <StatusBadge
                  status={hotel.isApproved ? "approved" : "pending"}
                  label={hotel.isApproved ? "승인됨" : "승인 대기"}
                />
              </div>
              <div className="hotel-info">
                <h3>{hotel.name}</h3>
                <p className="hotel-address">{hotel.address}</p>
                <div className="hotel-stats">
                  <span>⭐ {hotel.averageRating.toFixed(1)}</span>
                  <span>📝 리뷰 {hotel.reviewCount}개</span>
                  <span>🛏 객실 {hotel.roomCount}개</span>
                </div>
                <div className="hotel-actions">
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={() => navigate(`/business/hotels/${hotel._id}/edit`)}
                  >
                    수정
                  </button>
                  <button
                    className="btn btn-sm btn-outline"
                    onClick={() => navigate(`/business/hotels/${hotel._id}/rooms`)}
                  >
                    객실 관리
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(hotel._id)}
                  >
                    삭제
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BusinessHotelListPage;

