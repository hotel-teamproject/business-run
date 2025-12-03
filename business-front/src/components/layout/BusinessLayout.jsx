import { Outlet, Navigate } from "react-router-dom";
import { useBusinessAuth } from "../../hooks/useBusinessAuth";
import Loader from "../common/Loader";
import BusinessHeader from "./BusinessHeader";
import BusinessSidebar from "./BusinessSidebar";
import "../../styles/index.scss";

const BusinessLayout = () => {
  const { isAuthenticated, loading } = useBusinessAuth();

  if (loading) {
    return <Loader fullScreen />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/business/login" replace />;
  }

  return (
    <div className="business-layout">
      <BusinessSidebar />
      <div className="business-main">
        <BusinessHeader />
        <main className="business-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default BusinessLayout;

