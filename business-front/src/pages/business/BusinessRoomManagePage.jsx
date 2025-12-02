import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { businessRoomApi } from "../../api/businessApi";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";

const BusinessRoomManagePage = () => {
  const { hotelId } = useParams();
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchRooms();
  }, [hotelId]);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const data = await businessRoomApi.getRooms(hotelId);
      setRooms(data.rooms);
    } catch (err) {
      setError(err.message || "객실 목록을 불러오는데 실패했습니다.");
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
  if (error) return <ErrorMessage message={error} onRetry={fetchRooms} />;

  return (
    <div className="business-room-manage-page">
      <div className="page-header">
        <button
          className="btn btn-outline"
          onClick={() => navigate("/business/hotels")}
        >
          ← 호텔 목록으로
        </button>
        <h1>객실 관리</h1>
        <button
          className="btn btn-primary"
          onClick={() => navigate(`/business/hotels/${hotelId}/rooms/new`)}
        >
          + 객실 추가
        </button>
      </div>

      {rooms.length === 0 ? (
        <div className="empty-state">
          <p>등록된 객실이 없습니다.</p>
          <button
            className="btn btn-primary"
            onClick={() => navigate(`/business/hotels/${hotelId}/rooms/new`)}
          >
            첫 객실 등록하기
          </button>
        </div>
      ) : (
        <div className="room-list">
          {rooms.map((room) => (
            <div key={room._id} className="room-card">
              <div className="room-image">
                <img src={room.mainImage || "/placeholder-room.jpg"} alt={room.name} />
              </div>
              <div className="room-info">
                <h3>{room.name}</h3>
                <p className="room-size">{room.roomSize}</p>
                <div className="room-details">
                  <span>기준 인원: {room.capacityMin}명</span>
                  <span>최대 인원: {room.capacityMax}명</span>
                  <span>기본 가격: {formatCurrency(room.basePrice)}/박</span>
                  <span>전체 객실: {room.totalRooms}개</span>
                </div>
                <div className="room-actions">
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={() =>
                      navigate(`/business/hotels/${hotelId}/rooms/${room._id}/edit`)
                    }
                  >
                    수정
                  </button>
                  <button
                    className="btn btn-sm btn-outline"
                    onClick={() =>
                      navigate(`/business/hotels/${hotelId}/rooms/${room._id}/pricing`)
                    }
                  >
                    가격 설정
                  </button>
                  <button
                    className="btn btn-sm btn-outline"
                    onClick={() =>
                      navigate(`/business/hotels/${hotelId}/rooms/${room._id}/inventory`)
                    }
                  >
                    재고 관리
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

export default BusinessRoomManagePage;

