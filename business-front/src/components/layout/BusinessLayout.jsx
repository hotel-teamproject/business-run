import { Outlet } from "react-router-dom";
import BusinessHeader from "./BusinessHeader";
import BusinessSidebar from "./BusinessSidebar";
import "../../styles/index.scss";

const BusinessLayout = () => {
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

