import axiosClient from "./axiosClient";
import { mockHotelApi } from "./mockApi";

const USE_MOCK = true;

export const adminHotelApi = {
  // 호텔 목록 조회
  getHotels: (params) => {
    if (USE_MOCK) return mockHotelApi.getHotels(params);
    return axiosClient.get("/admin/hotels", { params });
  },

  // 호텔 상세 조회
  getHotelById: (hotelId) => {
    if (USE_MOCK) return mockHotelApi.getHotelById(hotelId);
    return axiosClient.get(`/admin/hotels/${hotelId}`);
  },

  // 호텔 등록
  createHotel: (data) => {
    if (USE_MOCK) return mockHotelApi.createHotel(data);
    return axiosClient.post("/admin/hotels", data);
  },

  // 호텔 수정
  updateHotel: (hotelId, data) => {
    if (USE_MOCK) return mockHotelApi.updateHotel(hotelId, data);
    return axiosClient.put(`/admin/hotels/${hotelId}`, data);
  },

  // 호텔 삭제
  deleteHotel: (hotelId) => {
    if (USE_MOCK) return mockHotelApi.deleteHotel(hotelId);
    return axiosClient.delete(`/admin/hotels/${hotelId}`);
  },

  // 호텔 승인
  approveHotel: (hotelId) => {
    if (USE_MOCK) return mockHotelApi.approveHotel(hotelId);
    return axiosClient.post(`/admin/hotels/${hotelId}/approve`);
  },

  // 호텔 승인 거부
  rejectHotel: (hotelId, reason) => {
    if (USE_MOCK) return mockHotelApi.rejectHotel(hotelId, reason);
    return axiosClient.post(`/admin/hotels/${hotelId}/reject`, { reason });
  },
};

export default adminHotelApi;
