import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { businessRoomApi } from "../../api/businessApi";
import Loader from "../../components/common/Loader";

const BusinessRoomCreatePage = () => {
  const { hotelId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    nameEn: "",
    roomSize: "",
    capacityMin: 2,
    capacityMax: 4,
    basePrice: 0,
    totalRooms: 1,
    description: "",
    amenities: [],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "capacityMin" || name === "capacityMax" || name === "basePrice" || name === "totalRooms"
        ? parseInt(value) || 0
        : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await businessRoomApi.createRoom(hotelId, formData);
      alert("객실이 등록되었습니다.");
      navigate(`/business/hotels/${hotelId}/rooms`);
    } catch (err) {
      alert(err.message || "객실 등록에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader fullScreen />;

  return (
    <div className="business-room-create-page">
      <div className="page-header">
        <button
          className="btn btn-outline"
          onClick={() => navigate(`/business/hotels/${hotelId}/rooms`)}
        >
          ← 목록으로
        </button>
        <h1>객실 등록</h1>
      </div>

      <form onSubmit={handleSubmit} className="room-form">
        <div className="form-group">
          <label>객실 종류 (한글) *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="스위트룸"
            required
          />
        </div>
        <div className="form-group">
          <label>객실 종류 (영문) *</label>
          <input
            type="text"
            name="nameEn"
            value={formData.nameEn}
            onChange={handleChange}
            placeholder="Suite Room"
            required
          />
        </div>
        <div className="form-group">
          <label>객실 크기 *</label>
          <input
            type="text"
            name="roomSize"
            value={formData.roomSize}
            onChange={handleChange}
            placeholder="45m²"
            required
          />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>기준 인원 *</label>
            <input
              type="number"
              name="capacityMin"
              value={formData.capacityMin}
              onChange={handleChange}
              min="1"
              required
            />
          </div>
          <div className="form-group">
            <label>최대 인원 *</label>
            <input
              type="number"
              name="capacityMax"
              value={formData.capacityMax}
              onChange={handleChange}
              min="1"
              required
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>기본 가격 (원/박) *</label>
            <input
              type="number"
              name="basePrice"
              value={formData.basePrice}
              onChange={handleChange}
              min="0"
              required
            />
          </div>
          <div className="form-group">
            <label>전체 객실 수 *</label>
            <input
              type="number"
              name="totalRooms"
              value={formData.totalRooms}
              onChange={handleChange}
              min="1"
              required
            />
          </div>
        </div>
        <div className="form-group">
          <label>설명</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
          />
        </div>
        <div className="form-actions">
          <button
            type="button"
            className="btn btn-outline"
            onClick={() => navigate(`/business/hotels/${hotelId}/rooms`)}
          >
            취소
          </button>
          <button type="submit" className="btn btn-primary">
            등록하기
          </button>
        </div>
      </form>
    </div>
  );
};

export default BusinessRoomCreatePage;

