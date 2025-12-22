import axios from "axios";

// API 기본 URL 설정 (Nginx 프록시 사용)
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

// axios 인스턴스 생성
const axiosClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // 쿠키 전송을 위한 설정
});

// 요청 인터셉터
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("business_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터
axiosClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    // 401 에러 처리 (로그인 페이지로 리다이렉트는 로그인 실패 시에는 하지 않음)
    if (error.response?.status === 401) {
      // 로그인 페이지가 아닐 때만 리다이렉트
      if (!window.location.pathname.includes('/login')) {
        localStorage.removeItem("business_token");
        window.location.href = "/business/login";
      }
    }
    
    // 에러 메시지가 있으면 그대로 전달, 없으면 기본 메시지
    const errorMessage = error.response?.data?.message || error.message || "요청 처리 중 오류가 발생했습니다.";
    const customError = new Error(errorMessage);
    customError.response = error.response;
    return Promise.reject(customError);
  }
);

export default axiosClient;
