import { useNavigate } from "react-router-dom";
import Button from "../../components/common/Button";

const LoginSelectPage = () => {
  const navigate = useNavigate();

  return (
    <div className="login-select-page">
      <div className="login-select-container">
        <div className="login-select-header">
          <h1>호텔 예약 플랫폼</h1>
          <p>로그인 유형을 선택해주세요</p>
        </div>

        <div className="login-options">
          <div className="login-card" onClick={() => navigate("/admin/login")}>
            <div className="login-icon">🛠️</div>
            <h2>관리자</h2>
            <p>플랫폼 관리 및 운영</p>
            <Button variant="primary" fullWidth onClick={() => navigate("/admin/login")}>
              관리자 로그인
            </Button>
          </div>

          <div className="login-card" onClick={() => navigate("/business/login")}>
            <div className="login-icon">🏢</div>
            <h2>사업자</h2>
            <p>호텔 관리 및 예약 관리</p>
            <Button variant="primary" fullWidth onClick={() => navigate("/business/login")}>
              사업자 로그인
            </Button>
          </div>
        </div>

        <div className="login-footer">
          <p>일반 사용자 페이지는 준비 중입니다.</p>
        </div>
      </div>
    </div>
  );
};

export default LoginSelectPage;

