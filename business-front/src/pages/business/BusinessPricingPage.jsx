import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { businessRoomApi } from "../../api/businessApi";
import Loader from "../../components/common/Loader";

const BusinessPricingPage = () => {
  const { hotelId, roomId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    weekdayPrice: 0,
    weekendPrice: 0,
    dateFrom: "",
    dateTo: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "weekdayPrice" || name === "weekendPrice"
        ? parseInt(value) || 0
        : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await businessRoomApi.setPricePolicy(roomId, formData);
      alert("가격 정책이 설정되었습니다.");
    } catch (err) {
      alert(err.message || "가격 설정에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="business-pricing-page">
      <div className="page-header">
        <button
          className="btn btn-outline"
          onClick={() => navigate(`/business/hotels/${hotelId}/rooms`)}
        >
          ← 목록으로
        </button>
        <h1>가격 정책 설정</h1>
      </div>

      <form onSubmit={handleSubmit} className="pricing-form">
        <div className="form-group">
          <label>기간 시작일 *</label>
          <input
            type="date"
            name="dateFrom"
            value={formData.dateFrom}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>기간 종료일 *</label>
          <input
            type="date"
            name="dateTo"
            value={formData.dateTo}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>평일 가격 (원/박) *</label>
          <input
            type="number"
            name="weekdayPrice"
            value={formData.weekdayPrice}
            onChange={handleChange}
            min="0"
            required
          />
        </div>
        <div className="form-group">
          <label>주말 가격 (원/박) *</label>
          <input
            type="number"
            name="weekendPrice"
            value={formData.weekendPrice}
            onChange={handleChange}
            min="0"
            required
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
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "저장 중..." : "저장하기"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BusinessPricingPage;

