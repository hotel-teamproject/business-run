import axiosClient from "./axiosClient";

// 실제 백엔드 API 호출 함수들
// 백엔드 API가 준비되면 이 함수들을 구현하면 됩니다

// 사업자 인증 API
export const realBusinessAuthApi = {
  login: async (credentials) => {
    const response = await axiosClient.post("/business/auth/login", credentials);
    return response;
  },

  logout: async () => {
    const response = await axiosClient.post("/business/auth/logout");
    return response;
  },

  getMyInfo: async () => {
    const response = await axiosClient.get("/business/auth/me");
    return response;
  },

  applyBusiness: async (data) => {
    const response = await axiosClient.post("/business/auth/apply", data);
    return response;
  },
};

// 사업자 대시보드 API
export const realBusinessDashboardApi = {
  getDashboardStats: async () => {
    const response = await axiosClient.get("/business/dashboard/stats");
    return response;
  },
};

// 사업자 호텔 API
export const realBusinessHotelApi = {
  getHotels: async (params = {}) => {
    const response = await axiosClient.get("/business/hotels", { params });
    return response;
  },

  getHotelById: async (hotelId) => {
    const response = await axiosClient.get(`/business/hotels/${hotelId}`);
    return response;
  },

  createHotel: async (data) => {
    const response = await axiosClient.post("/business/hotels", data);
    return response;
  },

  updateHotel: async (hotelId, data) => {
    const response = await axiosClient.put(`/business/hotels/${hotelId}`, data);
    return response;
  },

  deleteHotel: async (hotelId) => {
    const response = await axiosClient.delete(`/business/hotels/${hotelId}`);
    return response;
  },
};

// 사업자 객실 API
export const realBusinessRoomApi = {
  getRooms: async (hotelId, params = {}) => {
    const response = await axiosClient.get(`/business/hotels/${hotelId}/rooms`, { params });
    return response;
  },

  getRoomById: async (roomId) => {
    const response = await axiosClient.get(`/business/rooms/${roomId}`);
    return response;
  },

  createRoom: async (hotelId, data) => {
    const response = await axiosClient.post(`/business/hotels/${hotelId}/rooms`, data);
    return response;
  },

  updateRoom: async (roomId, data) => {
    const response = await axiosClient.put(`/business/rooms/${roomId}`, data);
    return response;
  },

  deleteRoom: async (roomId) => {
    const response = await axiosClient.delete(`/business/rooms/${roomId}`);
    return response;
  },

  getPricePolicies: async (roomId) => {
    const response = await axiosClient.get(`/business/rooms/${roomId}/pricing`);
    return response;
  },

  setPricePolicy: async (roomId, data) => {
    const response = await axiosClient.post(`/business/rooms/${roomId}/pricing`, data);
    return response;
  },

  getInventory: async (roomId, params = {}) => {
    const response = await axiosClient.get(`/business/rooms/${roomId}/inventory`, { params });
    return response;
  },

  updateInventory: async (roomId, date, data) => {
    const response = await axiosClient.put(`/business/rooms/${roomId}/inventory/${date}`, data);
    return response;
  },
};

// 사업자 예약 API
export const realBusinessReservationApi = {
  getReservations: async (params = {}) => {
    const response = await axiosClient.get("/business/reservations", { params });
    return response;
  },

  getReservationById: async (reservationId) => {
    const response = await axiosClient.get(`/business/reservations/${reservationId}`);
    return response;
  },

  updateReservationStatus: async (reservationId, status) => {
    const response = await axiosClient.patch(`/business/reservations/${reservationId}/status`, { status });
    return response;
  },

  cancelReservation: async (reservationId, reason) => {
    const response = await axiosClient.post(`/business/reservations/${reservationId}/cancel`, { reason });
    return response;
  },
};

// 사업자 리뷰 API
export const realBusinessReviewApi = {
  getReviews: async (params = {}) => {
    const response = await axiosClient.get("/business/reviews", { params });
    return response;
  },

  getReviewById: async (reviewId) => {
    const response = await axiosClient.get(`/business/reviews/${reviewId}`);
    return response;
  },

  replyToReview: async (reviewId, replyContent) => {
    const response = await axiosClient.post(`/business/reviews/${reviewId}/reply`, { content: replyContent });
    return response;
  },

  reportReview: async (reviewId, reason, content) => {
    const response = await axiosClient.post(`/business/reviews/${reviewId}/report`, { reason, content });
    return response;
  },
};

// 사업자 통계 API
export const realBusinessStatsApi = {
  getStatistics: async (params = {}) => {
    const response = await axiosClient.get("/business/statistics", { params });
    return response;
  },

  getRevenueChart: async (params = {}) => {
    const response = await axiosClient.get("/business/statistics/revenue/chart", { params });
    return response;
  },
};

// 사업자 정산 API
export const realBusinessSettlementApi = {
  getSettlements: async (params = {}) => {
    const response = await axiosClient.get("/business/settlements", { params });
    return response;
  },

  getSettlementById: async (settlementId) => {
    const response = await axiosClient.get(`/business/settlements/${settlementId}`);
    return response;
  },
};

