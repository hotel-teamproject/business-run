import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminCouponTable from "../../components/admin/coupons/AdminCouponTable";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";

const AdminCouponListPage = () => {
  const navigate = useNavigate();
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      // TODO: API 연결
      setCoupons([]);
    } catch (err) {
      setError(err.message || "데이터를 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (couponId) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;

    try {
      // TODO: API 연결
      fetchCoupons();
    } catch (err) {
      alert(err.message || "삭제에 실패했습니다.");
    }
  };

  if (loading) return <Loader fullScreen />;
  if (error) return <ErrorMessage message={error} onRetry={fetchCoupons} />;

  return (
    <div className="admin-coupon-list-page">
      <div className="page-header">
        <h1>쿠폰 관리</h1>
        <button
          onClick={() => navigate("/admin/coupons/new")}
          className="btn btn-primary"
        >
          쿠폰 생성
        </button>
      </div>

      <AdminCouponTable coupons={coupons} onDelete={handleDelete} />
    </div>
  );
};

export default AdminCouponListPage;
