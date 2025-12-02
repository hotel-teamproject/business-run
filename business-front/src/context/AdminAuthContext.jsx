import { createContext, useState, useEffect } from "react";
import adminAuthApi from "../api/adminAuthApi";

export const AdminAuthContext = createContext(null);

export const AdminAuthProvider = ({ children }) => {
  const [adminInfo, setAdminInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      if (token) {
        const data = await adminAuthApi.getMyInfo();
        setAdminInfo(data);
      }
    } catch (error) {
      localStorage.removeItem("adminToken");
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    const data = await adminAuthApi.login(credentials);
    localStorage.setItem("adminToken", data.token);
    setAdminInfo(data.admin);
  };

  const logout = async () => {
    try {
      await adminAuthApi.logout();
    } finally {
      localStorage.removeItem("adminToken");
      setAdminInfo(null);
    }
  };

  return (
    <AdminAuthContext.Provider
      value={{ adminInfo, loading, login, logout, checkAuth }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export default AdminAuthContext;
