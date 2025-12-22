import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { businessAuthApi } from "../../api/businessApi";
import AuthFormHeader from "./AuthFormHeader";
import AuthFormOptions from "./AuthFormOptions";
import Input from "../common/Input";
import ErrorMessage from "../common/ErrorMessage";
import Loader from "../common/Loader";

const BusinessSignupForm = () => {
  const [formData, setFormData] = useState({
    businessNumber: "",
    businessName: "",
    ownerName: "",
    businessEmail: "",
    businessPhone: "",
    businessAddress: "",
    password: "",
    passwordConfirm: "",
    agreeToTerms: false,
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // 필수 필드 체크
    const requiredFields = [
      "businessNumber",
      "businessName",
      "ownerName",
      "businessEmail",
      "businessPhone",
      "businessAddress",
      "password",
      "passwordConfirm",
    ];

    for (let key of requiredFields) {
      if (!formData[key]) {
        setError("모든 필수 정보를 입력해주세요.");
        return;
      }
    }

    // 비밀번호 확인 검증
    if (formData.password !== formData.passwordConfirm) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    // 비밀번호 길이 검증
    if (formData.password.length < 6) {
      setError("비밀번호는 최소 6자 이상이어야 합니다.");
      return;
    }

    if (!formData.agreeToTerms) {
      setError("약관에 동의해주세요.");
      return;
    }

    setLoading(true);
    try {
      const response = await businessAuthApi.applyBusiness({
        email: formData.businessEmail,
        password: formData.password,
        name: formData.ownerName,
        businessNumber: formData.businessNumber,
        phone: formData.businessPhone,
      });

      // 회원가입 성공 시 토큰 저장 (자동 로그인)
      if (response.token) {
        localStorage.setItem("business_token", response.token);
      }

      alert("회원가입이 완료되었습니다!");
      navigate("/business/dashboard");
    } catch (err) {
      setError(err.message || "회원가입에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="common-form signup-form">
      <AuthFormHeader
        title="Business Sign Up"
        subtitle="호텔 / 숙박업소 사업자 회원가입"
        showBackButton={true}
        onBack={() => navigate("/")}
      />

      <form className="form-content" onSubmit={handleSubmit}>
        {error && <ErrorMessage message={error} />}

        {/* 1행: 사업자 등록번호 / 사업체명 */}
        <div className="form-row">
          <Input
            label="사업자 등록번호"
            type="text"
            name="businessNumber"
            placeholder="123-45-67890"
            value={formData.businessNumber}
            onChange={handleInputChange}
            required
          />

          <Input
            label="사업체명"
            type="text"
            name="businessName"
            placeholder="서울 그랜드 호텔"
            value={formData.businessName}
            onChange={handleInputChange}
            required
          />
        </div>

        {/* 2행: 대표자 이름 / 사업자 이메일 */}
        <div className="form-row">
          <Input
            label="대표자 이름"
            type="text"
            name="ownerName"
            placeholder="홍길동"
            value={formData.ownerName}
            onChange={handleInputChange}
            required
          />

          <Input
            label="사업자 이메일"
            type="email"
            name="businessEmail"
            placeholder="hotel@example.com"
            value={formData.businessEmail}
            onChange={handleInputChange}
            required
          />
        </div>

        {/* 3행: 사업자 연락처 / 사업장 주소 */}
        <div className="form-row">
          <Input
            label="사업자 연락처"
            type="tel"
            name="businessPhone"
            placeholder="02-1234-5678"
            value={formData.businessPhone}
            onChange={handleInputChange}
            required
            disabled={loading}
          />

          <Input
            label="사업장 주소"
            type="text"
            name="businessAddress"
            placeholder="서울특별시 강남구 테헤란로 123"
            value={formData.businessAddress}
            onChange={handleInputChange}
            required
            disabled={loading}
          />
        </div>

        {/* 4행: 비밀번호 / 비밀번호 확인 */}
        <div className="form-row">
          <Input
            label="비밀번호"
            type="password"
            name="password"
            placeholder="비밀번호를 입력하세요 (최소 6자)"
            value={formData.password}
            onChange={handleInputChange}
            required
            disabled={loading}
            showPasswordToggle={true}
          />

          <Input
            label="비밀번호 확인"
            type="password"
            name="passwordConfirm"
            placeholder="비밀번호를 다시 입력하세요"
            value={formData.passwordConfirm}
            onChange={handleInputChange}
            required
            disabled={loading}
            showPasswordToggle={true}
          />
        </div>

        {/* 약관 */}
        <AuthFormOptions
          showCheckbox={true}
          checkboxLabel="약관에 동의"
          checkboxName="agreeToTerms"
          checkboxChecked={formData.agreeToTerms}
          onCheckboxChange={handleInputChange}
        />

        {/* 제출 */}
        <button 
          type="submit" 
          className="btn btn--primary btn--block"
          disabled={loading}
        >
          {loading ? "처리 중..." : "사업자 회원가입"}
        </button>
      </form>
    </div>
  );
};

export default BusinessSignupForm;