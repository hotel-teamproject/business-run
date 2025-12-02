import { useAdminAuth } from "../../hooks/useAdminAuth";
import AdminProfileForm from "../../components/admin/settings/AdminProfileForm";

const AdminMyProfilePage = () => {
  const { adminInfo } = useAdminAuth();

  const handleSubmit = async (formData) => {
    try {
      // TODO: API 연결
      alert("정보가 수정되었습니다.");
    } catch (err) {
      alert(err.message || "수정에 실패했습니다.");
    }
  };

  return (
    <div className="admin-my-profile-page">
      <div className="page-header">
        <h1>내 정보</h1>
      </div>

      <AdminProfileForm profile={adminInfo} onSubmit={handleSubmit} />
    </div>
  );
};

export default AdminMyProfilePage;
