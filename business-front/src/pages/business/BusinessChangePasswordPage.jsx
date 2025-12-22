import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { businessAuthApi } from "../../api/businessApi";
import Input from "../../components/common/Input";
import ErrorMessage from "../../components/common/ErrorMessage";
import Loader from "../../components/common/Loader";

const BusinessChangePasswordPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // 필수 필드 검증
    if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
      setError("모든 필드를 입력해주세요.");
      return;
    }

    // 새 비밀번호 길이 검증
    if (formData.newPassword.length < 6) {
      setError("새 비밀번호는 최소 6자 이상이어야 합니다.");
      return;
    }

    // 비밀번호 확인 검증
    if (formData.newPassword !== formData.confirmPassword) {
      setError("새 비밀번호가 일치하지 않습니다.");
      return;
    }

    // 현재 비밀번호와 새 비밀번호가 같은지 확인
    if (formData.currentPassword === formData.newPassword) {
      setError("새 비밀번호는 현재 비밀번호와 달라야 합니다.");
      return;
    }

    setLoading(true);
    try {
      await businessAuthApi.changePassword(formData.currentPassword, formData.newPassword);
      alert("비밀번호가 변경되었습니다.");
      navigate("/business/profile");
    } catch (err) {
      setError(err.message || "비밀번호 변경에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="business-change-password-page">
      <div className="page-header">
        <button className="btn btn-outline" onClick={() => navigate("/business/profile")}>
          ← 프로필로
        </button>
        <h1>비밀번호 변경</h1>
      </div>

      <div className="form-container">
        <form onSubmit={handleSubmit} className="change-password-form">
          {error && <ErrorMessage message={error} />}

          <Input
            label="현재 비밀번호"
            type="password"
            name="currentPassword"
            value={formData.currentPassword}
            onChange={handleInputChange}
            placeholder="현재 비밀번호를 입력하세요"
            required
            disabled={loading}
            showPasswordToggle={true}
          />

          <Input
            label="새 비밀번호"
            type="password"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleInputChange}
            placeholder="새 비밀번호를 입력하세요 (최소 6자)"
            required
            disabled={loading}
            showPasswordToggle={true}
          />

          <Input
            label="새 비밀번호 확인"
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            placeholder="새 비밀번호를 다시 입력하세요"
            required
            disabled={loading}
            showPasswordToggle={true}
          />

          <div className="form-actions">
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => navigate("/business/profile")}
              disabled={loading}
            >
              취소
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? "변경 중..." : "비밀번호 변경"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BusinessChangePasswordPage;

