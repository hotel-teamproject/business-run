import { useNavigate } from "react-router-dom";
import { useBusinessAuth } from "../../hooks/useBusinessAuth";

const BusinessHeader = () => {
  const navigate = useNavigate();
  const { businessInfo, logout } = useBusinessAuth();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/business/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <header className="business-header">
      <div className="business-header-inner">
        <div className="header-left">
          <h2>사업자 대시보드</h2>
        </div>
        <div className="header-right">
          <span>{businessInfo?.businessName || businessInfo?.name || "Business"}</span>
          <button onClick={handleLogout} className="btn btn-outline">
            로그아웃
          </button>
        </div>
      </div>
    </header>
  );
};

export default BusinessHeader;

