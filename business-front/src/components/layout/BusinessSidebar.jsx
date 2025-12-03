import { NavLink } from "react-router-dom";

const BusinessSidebar = () => {
  const menuItems = [
    { path: "/business/dashboard", label: "대시보드", icon: "📊" },
    { path: "/business/hotels", label: "호텔 관리", icon: "🏨" },
    { path: "/business/reservations", label: "예약 관리", icon: "📅" },
    { path: "/business/reviews", label: "리뷰 관리", icon: "⭐" },
    { path: "/business/statistics", label: "통계", icon: "📈" },
    { path: "/business/settlements", label: "정산 관리", icon: "💰" },
    { path: "/business/profile", label: "내 정보", icon: "👤" },
  ];

  return (
    <aside className="business-sidebar">
      <div className="business-sidebar-inner">
        <div className="sidebar-logo">
          <h2>사업자 대시보드</h2>
        </div>
        <nav>
          <ul className="sidebar-menu">
            {menuItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) => (isActive ? "active" : "")}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </aside>
  );
};

export default BusinessSidebar;

