import axios from "axios";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
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
    // 서버 응답 구조가 {success: true, data: ...} 형태인 경우 자동으로 data 추출
    if (response.data && typeof response.data === 'object' && response.data.success !== undefined) {
      // 성공 응답인 경우 data 필드 반환, 실패인 경우 에러로 처리
      if (response.data.success && response.data.data !== undefined) {
        return response.data.data;
      }
      // success: false인 경우 에러로 처리
      if (!response.data.success) {
        const error = new Error(response.data.message || '요청이 실패했습니다.');
        error.response = response;
        return Promise.reject(error);
      }
    }
    // 기존 형태 그대로 반환
    return response.data;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("business_token");
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
