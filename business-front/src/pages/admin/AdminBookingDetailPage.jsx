import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminBookingDetail from "../../components/admin/bookings/AdminBookingDetail";
import { adminBookingApi } from "../../api/adminBookingApi";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";

const AdminBookingDetailPage = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchBooking();
  }, [bookingId]);

  const fetchBooking = async () => {
    try {
      setLoading(true);
      const data = await adminBookingApi.getBookingById(bookingId);
      setBooking(data);
    } catch (err) {
      setError(err.message || "데이터를 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader fullScreen />;
  if (error) return <ErrorMessage message={error} onRetry={fetchBooking} />;

  return (
    <div className="admin-booking-detail-page">
      <div className="page-header">
        <h1>예약 상세</h1>
        <button
          onClick={() => navigate("/admin/bookings")}
          className="btn btn-outline"
        >
          목록으로
        </button>
      </div>

      <AdminBookingDetail booking={booking} />
    </div>
  );
};

export default AdminBookingDetailPage;
