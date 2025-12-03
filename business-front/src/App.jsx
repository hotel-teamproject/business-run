import { BrowserRouter, Routes, Route } from "react-router-dom";
import businessRoutes from "./router/businessRoutes";
import { BusinessAuthProvider } from "./context/BusinessAuthContext";
import BusinessLoginPage from "./pages/auth/BusinessLoginPage";

function App() {

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
