import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useBusinessAuth } from "../../hooks/useBusinessAuth";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";

const BusinessLoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useBusinessAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login({ email, password });
      navigate("/business/dashboard");
    } catch (err) {
      setError(err.message || "로그인에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page business-login-page">
      <div className="auth-container">
        <div className="auth-header">
          <h1>사업자 로그인</h1>
          <p>호텔 관리 시스템에 로그인하세요</p>
        </div>

        {/* 개발용 샘플 계정 안내 */}
        <div className="sample-account-info">
          <p>📌 테스트 계정</p>
          <p>이메일: business@hotel.com</p>
          <p>비밀번호: business1234</p>
        </div>

        {error && <ErrorMessage message={error} />}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">이메일</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="business@hotel.com"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">비밀번호</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호를 입력하세요"
              required
              disabled={loading}
            />
          </div>

          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? "로그인 중..." : "로그인"}
          </button>
        </form>

        {/* <div className="back-to-home">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="back-link"
          >
            ← 첫화면으로 돌아가기
          </button>
        </div> */}
      </div>
    </div>
  );
};

export default BusinessLoginPage;

