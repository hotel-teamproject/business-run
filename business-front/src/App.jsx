import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import businessRoutes from "./router/businessRoutes";
import { BusinessAuthProvider } from "./context/BusinessAuthContext";
import BusinessLoginPage from "./pages/auth/BusinessLoginPage";

function App() {
  // 백엔드 연결 테스트 (개발 환경에서만 실행)
  useEffect(() => {
    if (import.meta.env.DEV) {
      console.log("🔌 백엔드 연결 테스트 시작...");
      
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";
      
      // 호텔 API 테스트
      fetch(`${apiBaseUrl}/hotels`)
        .then((res) => res.json())
        .then((data) => console.log("✅ GET /api/hotels:", data))
        .catch((err) => console.error("❌ GET /api/hotels error:", err));

      // 객실 API 테스트
      fetch(`${apiBaseUrl}/rooms`)
        .then((res) => res.json())
        .then((data) => console.log("✅ GET /api/rooms:", data))
        .catch((err) => console.error("❌ GET /api/rooms error:", err));

      // 리뷰 API 테스트 (필요시 주석 해제)
      // fetch(`${apiBaseUrl}/reviews`)
      //   .then((res) => res.json())
      //   .then((data) => console.log("✅ GET /api/reviews:", data))
      //   .catch((err) => console.error("❌ GET /api/reviews error:", err));
    }
  }, []); // 빈 배열 = 컴포넌트 마운트 시 한 번만 실행

  return (
    <BrowserRouter>
      <BusinessAuthProvider>
        <Routes>
          {/* 사업자 라우트 */}
          {businessRoutes.map((route) => (
            <Route key={route.path} path={route.path} element={route.element}>
              {route.children?.map((child) => (
                <Route
                  key={child.path || "index"}
                  index={child.index}
                  path={child.path}
                  element={child.element}
                />
              ))}
            </Route>
          ))}

          {/* 루트 - 사업자 로그인 페이지 */}
          <Route path="/" element={<BusinessLoginPage />} />
        </Routes>
      </BusinessAuthProvider>
    </BrowserRouter>
  );
}

export default App;
