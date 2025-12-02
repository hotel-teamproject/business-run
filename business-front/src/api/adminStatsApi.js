import axiosClient from "./axiosClient";
import { mockStatsApi } from "./mockApi";

const USE_MOCK = true;

export const adminStatsApi = {
  // 대시보드 통계 조회
  getDashboardStats: () => {
    if (USE_MOCK) return mockStatsApi.getDashboardStats();
    return axiosClient.get("/admin/stats/dashboard");
  },

  // 매출 통계 조회
  getRevenueStats: (params) => {
    if (USE_MOCK) return mockStatsApi.getRevenueStats(params);
    return axiosClient.get("/admin/stats/revenue", { params });
  },

  // 예약 통계 조회
  getBookingStats: (params) => {
    if (USE_MOCK) return mockStatsApi.getBookingStats(params);
    return axiosClient.get("/admin/stats/bookings", { params });
  },

  // 사용자 통계 조회
  getUserStats: (params) => {
    if (USE_MOCK) return mockStatsApi.getUserStats(params);
    return axiosClient.get("/admin/stats/users", { params });
  },

  // 호텔 통계 조회
  getHotelStats: (params) => {
    if (USE_MOCK) return mockStatsApi.getHotelStats(params);
    return axiosClient.get("/admin/stats/hotels", { params });
  },
};

export default adminStatsApi;
