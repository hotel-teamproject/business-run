import axiosClient from "./axiosClient";

// 실제 백엔드 API 호출 함수들
// 백엔드 API가 준비되면 이 함수들을 구현하면 됩니다

// 사업자 인증 API
export const realBusinessAuthApi = {
  login: async (credentials) => {
    // axios 인터셉터에서 자동으로 data 추출
    const response = await axiosClient.post("/admin/auth/login", credentials);
    return response; // 이미 {token, user} 형태로 변환됨
  },

  logout: async () => {
    const response = await axiosClient.post("/admin/auth/logout");
    return response;
  },

  getMyInfo: async () => {
    // axios 인터셉터에서 자동으로 data 추출
    const response = await axiosClient.get("/admin/auth/me");
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
    // axios 인터셉터에서 자동으로 data 추출
    const data = await axiosClient.get("/business/dashboard/stats");
    // 서버 필드명과 프론트 필드명 매핑
    return {
      totalRevenue: data.totalRevenue || 0,
      monthlyRevenue: data.monthlyRevenue || 0,
      bookingCount: data.totalBookings || 0,
      monthlyBookingCount: data.monthlyBookings || 0,
      todayBookings: data.todayBookings || 0,
      averageRating: data.averageRating || 0,
      reviewCount: data.reviewCount || 0,
      occupancyRate: data.occupancyRate || 0,
      chartData: data.chartData || { labels: [], revenue: [], bookings: [] },
      recentBookings: data.recentBookings || [],
      recentReviews: data.recentReviews || [],
    };
  },
};

// 사업자 호텔 API
export const realBusinessHotelApi = {
  getHotels: async (params = {}) => {
    // axios 인터셉터에서 자동으로 data 추출 (배열)
    const hotels = await axiosClient.get("/business/hotels", { params });
    return { hotels: Array.isArray(hotels) ? hotels : [], total: Array.isArray(hotels) ? hotels.length : 0, totalPages: 1, currentPage: 1 };
  },

  getHotelById: async (hotelId) => {
    // axios 인터셉터에서 자동으로 data 추출
    return await axiosClient.get(`/business/hotels/${hotelId}`);
  },

  createHotel: async (data) => {
    const response = await axiosClient.post("/business/hotels", data);
    // 서버가 {message: '...', hotel: {...}} 형태로 반환하는 경우
    return response.hotel || response;
  },

  updateHotel: async (hotelId, data) => {
    const response = await axiosClient.put(`/business/hotels/${hotelId}`, data);
    return response.hotel || response;
  },

  deleteHotel: async (hotelId) => {
    const response = await axiosClient.delete(`/business/hotels/${hotelId}`);
    return response;
  },
};

// 사업자 객실 API
export const realBusinessRoomApi = {
  getRooms: async (hotelId, params = {}) => {
    // axios 인터셉터에서 자동으로 data 추출 (배열)
    const rooms = await axiosClient.get(`/business/hotels/${hotelId}/rooms`, { params });
    return { rooms: Array.isArray(rooms) ? rooms : [], total: Array.isArray(rooms) ? rooms.length : 0 };
  },

  getRoomById: async (roomId) => {
    return await axiosClient.get(`/business/rooms/${roomId}`);
  },

  createRoom: async (hotelId, data) => {
    const response = await axiosClient.post(`/business/hotels/${hotelId}/rooms`, data);
    return response.room || response;
  },

  updateRoom: async (roomId, data) => {
    const response = await axiosClient.put(`/business/rooms/${roomId}`, data);
    return response.room || response;
  },

  deleteRoom: async (roomId) => {
    return await axiosClient.delete(`/business/rooms/${roomId}`);
  },

  getPricePolicies: async (roomId) => {
    const policies = await axiosClient.get(`/business/rooms/${roomId}/pricing`);
    return { policies: Array.isArray(policies) ? policies : [] };
  },

  setPricePolicy: async (roomId, data) => {
    return await axiosClient.post(`/business/rooms/${roomId}/pricing`, data);
  },

  getInventory: async (roomId, params = {}) => {
    // axios 인터셉터에서 자동으로 data 추출 (배열)
    const inventory = await axiosClient.get(`/business/rooms/${roomId}/inventory`, { params });
    return { inventory: Array.isArray(inventory) ? inventory : [] };
  },

  updateInventory: async (roomId, date, data) => {
    // 서버는 PUT /business/rooms/:roomId/inventory (body에 date 포함)
    const response = await axiosClient.put(`/business/rooms/${roomId}/inventory`, {
      date,
      ...data
    });
    if (response.success || response.inventory) {
      return response.inventory || response.data || response;
    }
    return response;
  },
};

// 사업자 예약 API
export const realBusinessReservationApi = {
  getReservations: async (params = {}) => {
    // axios 인터셉터에서 자동으로 data 추출 (배열)
    const reservations = await axiosClient.get("/business/reservations", { params });
    return {
      reservations: Array.isArray(reservations) ? reservations : [],
      total: Array.isArray(reservations) ? reservations.length : 0,
      totalPages: 1,
      currentPage: 1,
    };
  },

  getReservationById: async (reservationId) => {
    return await axiosClient.get(`/business/reservations/${reservationId}`);
  },

  updateReservationStatus: async (reservationId, status) => {
    return await axiosClient.patch(`/business/reservations/${reservationId}/status`, { status });
  },

  cancelReservation: async (reservationId, reason) => {
    return await axiosClient.post(`/business/reservations/${reservationId}/cancel`, { reason });
  },
};

// 사업자 리뷰 API
export const realBusinessReviewApi = {
  getReviews: async (params = {}) => {
    const response = await axiosClient.get("/business/reviews", { params });
    // 서버 응답: {items: [...], total: ..., page: ..., limit: ...}
    return {
      reviews: Array.isArray(response?.items) ? response.items : [],
      total: response?.total || 0,
      totalPages: response?.limit ? Math.ceil((response.total || 0) / response.limit) : 1,
      currentPage: response?.page || 1,
    };
  },

  getReviewById: async (reviewId) => {
    return await axiosClient.get(`/business/reviews/${reviewId}`);
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
    // 서버 응답: {revenue: {...}, bookings: {...}, occupancy: {...}}
    return response || {};
  },

  getRevenueChart: async (params = {}) => {
    const response = await axiosClient.get("/business/statistics/revenue/chart", { params });
    // 서버 응답: {labels: [...], revenue: [...]}
    return response || { labels: [], revenue: [] };
  },
};

// 사업자 정산 API
export const realBusinessSettlementApi = {
  getSettlements: async (params = {}) => {
    const settlements = await axiosClient.get("/business/settlements", { params });
    return { settlements: Array.isArray(settlements) ? settlements : [] };
  },

  getSettlementById: async (settlementId) => {
    return await axiosClient.get(`/business/settlements/${settlementId}`);
  },
};

