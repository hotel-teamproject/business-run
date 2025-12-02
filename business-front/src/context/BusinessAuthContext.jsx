import { createContext, useState, useEffect } from "react";
import { businessAuthApi } from "../api/businessApi";

export const BusinessAuthContext = createContext(null);

export const BusinessAuthProvider = ({ children }) => {
  const [businessInfo, setBusinessInfo] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 로컬 스토리지에서 토큰 확인
    const savedToken = localStorage.getItem("business_token");
    if (savedToken) {
      setToken(savedToken);
      fetchBusinessInfo();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchBusinessInfo = async () => {
    try {
      const data = await businessAuthApi.getMyInfo();
      setBusinessInfo(data);
    } catch (error) {
      console.error("Failed to fetch business info:", error);
      localStorage.removeItem("business_token");
      setToken(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      const response = await businessAuthApi.login(credentials);
      setToken(response.token);
      setBusinessInfo(response.user);
      localStorage.setItem("business_token", response.token);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await businessAuthApi.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setToken(null);
      setBusinessInfo(null);
      localStorage.removeItem("business_token");
    }
  };

  const value = {
    businessInfo,
    token,
    isAuthenticated: !!token,
    loading,
    login,
    logout,
  };

  return (
    <BusinessAuthContext.Provider value={value}>
      {children}
    </BusinessAuthContext.Provider>
  );
};

