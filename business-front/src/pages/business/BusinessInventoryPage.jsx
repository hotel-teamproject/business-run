import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { businessRoomApi } from "../../api/businessApi";
import Loader from "../../components/common/Loader";

const BusinessInventoryPage = () => {
  const { hotelId, roomId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [inventory, setInventory] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [inventoryData, setInventoryData] = useState({
    totalRooms: 5,
    availableRooms: 5,
  });

  useEffect(() => {
    fetchInventory();
  }, [roomId]);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const data = await businessRoomApi.getInventory(roomId);
      setInventory(data.inventory);
    } catch (err) {
      console.error("재고 정보를 불러오는데 실패했습니다.", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateInventory = async () => {
    if (!selectedDate) {
      alert("날짜를 선택해주세요.");
      return;
    }

    try {
      await businessRoomApi.updateInventory(roomId, selectedDate, inventoryData);
      alert("재고가 업데이트되었습니다.");
      fetchInventory();
    } catch (err) {
      alert(err.message || "재고 업데이트에 실패했습니다.");
    }
  };

  if (loading) return <Loader fullScreen />;

  return (
    <div className="business-inventory-page">
      <div className="page-header">
        <button
          className="btn btn-outline"
          onClick={() => navigate(`/business/hotels/${hotelId}/rooms`)}
        >
          ← 목록으로
        </button>
        <h1>재고 관리</h1>
      </div>

      <div className="inventory-section">
        <div className="inventory-control">
          <h3>재고 조정</h3>
          <div className="form-group">
            <label>날짜 선택</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>전체 객실 수</label>
            <input
              type="number"
              value={inventoryData.totalRooms}
              onChange={(e) =>
                setInventoryData((prev) => ({
                  ...prev,
                  totalRooms: parseInt(e.target.value) || 0,
                }))
              }
              min="0"
            />
          </div>
          <div className="form-group">
            <label>예약 가능 객실 수</label>
            <input
              type="number"
              value={inventoryData.availableRooms}
              onChange={(e) =>
                setInventoryData((prev) => ({
                  ...prev,
                  availableRooms: parseInt(e.target.value) || 0,
                }))
              }
              min="0"
            />
          </div>
          <button className="btn btn-primary" onClick={handleUpdateInventory}>
            재고 업데이트
          </button>
        </div>

        <div className="inventory-list">
          <h3>재고 현황</h3>
          {inventory.length === 0 ? (
            <p>재고 정보가 없습니다.</p>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>날짜</th>
                  <th>전체</th>
                  <th>예약됨</th>
                  <th>남은 객실</th>
                  <th>상태</th>
                </tr>
              </thead>
              <tbody>
                {inventory.map((item, index) => (
                  <tr key={index}>
                    <td>{item.date}</td>
                    <td>{item.totalRooms}</td>
                    <td>{item.bookedRooms}</td>
                    <td>{item.availableRooms}</td>
                    <td>
                      <span
                        className={`status-badge ${
                          item.status === "available"
                            ? "success"
                            : item.status === "limited"
                            ? "warning"
                            : "danger"
                        }`}
                      >
                        {item.status === "available"
                          ? "예약 가능"
                          : item.status === "limited"
                          ? "마감 임박"
                          : "매진"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default BusinessInventoryPage;

