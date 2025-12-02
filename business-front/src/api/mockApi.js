import { mockDashboardStats } from "./mockData";

// API 지연 시뮬레이션
const delay = (ms = 500) => new Promise((resolve) => setTimeout(resolve, ms));

// Mock API 응답 생성
const createResponse = (data) => {
  return Promise.resolve(data);
};

// Mock 호텔 API - 기본 골격만
export const mockHotelApi = {
  getHotels: async (params = {}) => {
    await delay();
    return createResponse({ hotels: [], totalPages: 1, currentPage: 1 });
  },
  getHotelById: async (hotelId) => {
    await delay();
    return createResponse({});
  },
  createHotel: async (data) => {
    await delay();
    return createResponse({ message: "Hotel created" });
  },
  updateHotel: async (hotelId, data) => {
    await delay();
    return createResponse({ message: "Hotel updated" });
  },
  deleteHotel: async (hotelId) => {
    await delay();
    return createResponse({ message: "Hotel deleted" });
  },
  approveHotel: async (hotelId) => {
    await delay();
    return createResponse({ message: "Hotel approved" });
  },
  rejectHotel: async (hotelId, reason) => {
    await delay();
    return createResponse({ message: "Hotel rejected" });
  },
};

// Mock 예약 API - 기본 골격만
export const mockBookingApi = {
  getBookings: async (params = {}) => {
    await delay();
    return createResponse({ bookings: [], totalPages: 1, currentPage: 1 });
  },
  getBookingById: async (bookingId) => {
    await delay();
    return createResponse({});
  },
  updateBookingStatus: async (bookingId, status) => {
    await delay();
    return createResponse({ message: "Status updated" });
  },
  cancelBooking: async (bookingId, reason) => {
    await delay();
    return createResponse({ message: "Booking cancelled" });
  },
  deleteBooking: async (bookingId) => {
    await delay();
    return createResponse({ message: "Booking deleted" });
  },
};

// Mock 사용자 API - 기본 골격만
export const mockUserApi = {
  getUsers: async (params = {}) => {
    await delay();
    return createResponse({ users: [], totalPages: 1, currentPage: 1 });
  },
  getUserById: async (userId) => {
    await delay();
    return createResponse({});
  },
  updateUser: async (userId, data) => {
    await delay();
    return createResponse({ message: "User updated" });
  },
  deleteUser: async (userId) => {
    await delay();
    return createResponse({ message: "User deleted" });
  },
  updateUserStatus: async (userId, status) => {
    await delay();
    return createResponse({ message: "Status updated" });
  },
  getBusinessUsers: async (params = {}) => {
    await delay();
    return createResponse({ users: [], totalPages: 1, currentPage: 1 });
  },
};

// Mock 리뷰 API - 기본 골격만
export const mockReviewApi = {
  getReviews: async (params = {}) => {
    await delay();
    return createResponse({ reviews: [], totalPages: 1, currentPage: 1 });
  },
  getReviewById: async (reviewId) => {
    await delay();
    return createResponse({});
  },
  deleteReview: async (reviewId) => {
    await delay();
    return createResponse({ message: "Review deleted" });
  },
  getReportedReviews: async (params = {}) => {
    await delay();
    return createResponse({ reviews: [], totalPages: 1, currentPage: 1 });
  },
  handleReport: async (reviewId, action) => {
    await delay();
    return createResponse({ message: "Report handled" });
  },
};

// Mock 통계 API
export const mockStatsApi = {
  getDashboardStats: async () => {
    await delay();
    return createResponse(mockDashboardStats);
  },
  getRevenueStats: async (params = {}) => {
    await delay();
    return createResponse({ total: 0, monthly: [] });
  },
  getBookingStats: async (params = {}) => {
    await delay();
    return createResponse({ total: 0, monthly: [] });
  },
  getUserStats: async (params = {}) => {
    await delay();
    return createResponse({ total: 0, new: 0, active: 0 });
  },
  getHotelStats: async (params = {}) => {
    await delay();
    return createResponse({ total: 0, active: 0, pending: 0 });
  },
};
