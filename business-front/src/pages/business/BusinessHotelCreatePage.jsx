import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { businessHotelApi } from "../../api/businessApi";
import Loader from "../../components/common/Loader";

const BusinessHotelCreatePage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    nameEn: "",
    type: "hotel",
    starRating: 5,
    country: "대한민국",
    city: "",
    address: "",
    phone: "",
    email: "",
    description: "",
    descriptionEn: "",
    amenities: [],
    checkInTime: "15:00",
    checkOutTime: "11:00",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAmenityToggle = (amenity) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await businessHotelApi.createHotel(formData);
      alert("호텔이 등록되었습니다. 관리자 승인을 기다려주세요.");
      navigate("/business/hotels");
    } catch (err) {
      alert(err.message || "호텔 등록에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const amenitiesList = [
    "WIFI",
    "수영장",
    "피트니스",
    "주차",
    "조식",
    "공항셔틀",
    "스파",
    "레스토랑",
    "24시 프론트",
    "에어컨",
  ];

  if (loading) return <Loader fullScreen />;

  return (
    <div className="business-hotel-create-page">
      <div className="page-header">
        <h1>호텔 등록</h1>
        <p>단계 {step} / 3</p>
      </div>

      <form onSubmit={handleSubmit} className="hotel-form">
        {step === 1 && (
          <div className="form-step">
            <h2>기본 정보</h2>
            <div className="form-group">
              <label>호텔명 (한글) *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>호텔명 (영문) *</label>
              <input
                type="text"
                name="nameEn"
                value={formData.nameEn}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>호텔 타입 *</label>
                <select name="type" value={formData.type} onChange={handleChange} required>
                  <option value="hotel">호텔</option>
                  <option value="motel">모텔</option>
                  <option value="resort">리조트</option>
                </select>
              </div>
              <div className="form-group">
                <label>성급 *</label>
                <select
                  name="starRating"
                  value={formData.starRating}
                  onChange={handleChange}
                  required
                >
                  <option value={1}>1성급</option>
                  <option value={2}>2성급</option>
                  <option value={3}>3성급</option>
                  <option value={4}>4성급</option>
                  <option value={5}>5성급</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label>연락처</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>이메일</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div className="form-actions">
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => navigate("/business/hotels")}
              >
                취소
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setStep(2)}
              >
                다음
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="form-step">
            <h2>위치 정보</h2>
            <div className="form-group">
              <label>국가 *</label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>도시 *</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>상세 주소 *</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-actions">
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => setStep(1)}
              >
                이전
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setStep(3)}
              >
                다음
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="form-step">
            <h2>상세 정보</h2>
            <div className="form-group">
              <label>호텔 소개 (한글) *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={5}
                required
              />
            </div>
            <div className="form-group">
              <label>편의시설 *</label>
              <div className="amenities-grid">
                {amenitiesList.map((amenity) => (
                  <label key={amenity} className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={formData.amenities.includes(amenity)}
                      onChange={() => handleAmenityToggle(amenity)}
                    />
                    <span>{amenity}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>체크인 시간</label>
                <input
                  type="time"
                  name="checkInTime"
                  value={formData.checkInTime}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>체크아웃 시간</label>
                <input
                  type="time"
                  name="checkOutTime"
                  value={formData.checkOutTime}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="form-actions">
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => setStep(2)}
              >
                이전
              </button>
              <button type="submit" className="btn btn-primary">
                등록하기
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default BusinessHotelCreatePage;

