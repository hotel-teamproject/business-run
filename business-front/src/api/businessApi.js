// API 선택 로직: 환경 변수에 따라 실제 API 또는 목업 API 사용
// USE_MOCK_API=true면 목업만 사용, false면 실제 API 우선 사용 (실패 시 목업 fallback)

import {
  mockBusinessUser,
  mockBusinessDashboardStats,
  mockBusinessHotels,
  mockRooms,
  mockBusinessReservations,
  mockBusinessReviews,
  mockPricePolicies,
  mockInventory,
} from "./mockData";

// 실제 백엔드 API import
import {
  realBusinessAuthApi,
  realBusinessDashboardApi,
  realBusinessHotelApi,
  realBusinessRoomApi,
  realBusinessReservationApi,
  realBusinessReviewApi,
  realBusinessStatsApi,
  realBusinessSettlementApi,
} from "./realBusinessApi";

// 환경 변수 확인
const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API === "true";
const USE_MOCK_FALLBACK = import.meta.env.VITE_USE_MOCK_FALLBACK !== "false"; // 기본값: true

// API 지연 시뮬레이션
const delay = (ms = 500) => new Promise((resolve) => setTimeout(resolve, ms));

// Mock API 응답 생성
const createResponse = (data) => {
  return Promise.resolve(data);
};

// API 호출 래퍼: 실제 API를 우선 호출하고 실패하면 목업 사용
const apiCall = async (realApiCall, mockApiCall) => {
  // 목업만 사용하도록 설정된 경우
  if (USE_MOCK_API) {
    return mockApiCall();
  }

  // 실제 API 우선 사용
  try {
    return await realApiCall();
  } catch (error) {
    // 실제 API 실패 시 목업 사용 (fallback 활성화된 경우)
    if (USE_MOCK_FALLBACK) {
      console.warn("백엔드 API 호출 실패, 목업 데이터 사용:", error.message);
      return mockApiCall();
    }
    // fallback 비활성화된 경우 에러 그대로 전달
    throw error;
  }
};

// Mock 사업자 인증 API
const mockBusinessAuthApi = {
  login: async (credentials) => {
    await delay();

    if (
      credentials.email === "business@hotel.com" &&
      credentials.password === "business1234"
    ) {
      return createResponse({
        token: "mock-business-jwt-token-" + Date.now(),
        user: mockBusinessUser,
      });
    }

    throw new Error("이메일 또는 비밀번호가 올바르지 않습니다.");
  },

  logout: async () => {
    await delay(200);
    return createResponse({ message: "Logged out successfully" });
  },

  getMyInfo: async () => {
    await delay();
    return createResponse(mockBusinessUser);
  },

  applyBusiness: async (data) => {
    await delay();
    return createResponse({
      message: "사업자 신청이 완료되었습니다. 관리자 승인을 기다려주세요.",
      businessId: "biz_new_" + Date.now(),
    });
  },
};

// 실제 API와 목업 API를 결합한 사업자 인증 API
export const businessAuthApi = {
  login: async (credentials) => {
    return apiCall(
      () => realBusinessAuthApi.login(credentials),
      () => mockBusinessAuthApi.login(credentials)
    );
  },

  logout: async () => {
    return apiCall(
      () => realBusinessAuthApi.logout(),
      () => mockBusinessAuthApi.logout()
    );
  },

  getMyInfo: async () => {
    return apiCall(
      () => realBusinessAuthApi.getMyInfo(),
      () => mockBusinessAuthApi.getMyInfo()
    );
  },

  applyBusiness: async (data) => {
    return apiCall(
      () => realBusinessAuthApi.applyBusiness(data),
      () => mockBusinessAuthApi.applyBusiness(data)
    );
  },
};

// Mock 사업자 대시보드 API
const mockBusinessDashboardApi = {
  getDashboardStats: async () => {
    await delay();
    return createResponse(mockBusinessDashboardStats);
  },
};

// 실제 API와 목업 API를 결합한 사업자 대시보드 API
export const businessDashboardApi = {
  getDashboardStats: async () => {
    return apiCall(
      () => realBusinessDashboardApi.getDashboardStats(),
      () => mockBusinessDashboardApi.getDashboardStats()
    );
  },
};

// Mock 사업자 호텔 API
const mockBusinessHotelApi = {
  getHotels: async (params = {}) => {
    await delay();
    let hotels = [...mockBusinessHotels];

    // 필터링
    if (params.status) {
      hotels = hotels.filter((h) => {
        if (params.status === "approved") return h.isApproved;
        if (params.status === "pending") return !h.isApproved;
        return true;
      });
    }

    return createResponse({
      hotels,
      totalPages: 1,
      currentPage: 1,
      total: hotels.length,
    });
  },

  getHotelById: async (hotelId) => {
    await delay();
    const hotel = mockBusinessHotels.find((h) => h._id === hotelId);
    if (!hotel) throw new Error("호텔을 찾을 수 없습니다.");
    return createResponse(hotel);
  },

  createHotel: async (data) => {
    await delay();
    return createResponse({
      _id: "hotel_new_" + Date.now(),
      ...data,
      isApproved: false,
      createdAt: new Date().toISOString(),
      message: "호텔이 등록되었습니다. 관리자 승인을 기다려주세요.",
    });
  },

  updateHotel: async (hotelId, data) => {
    await delay();
    return createResponse({
      _id: hotelId,
      ...data,
      message: "호텔 정보가 수정되었습니다.",
    });
  },

  deleteHotel: async (hotelId) => {
    await delay();
    return createResponse({ message: "호텔이 삭제되었습니다." });
  },
};

// 실제 API와 목업 API를 결합한 사업자 호텔 API
export const businessHotelApi = {
  getHotels: async (params = {}) => {
    return apiCall(
      () => realBusinessHotelApi.getHotels(params),
      () => mockBusinessHotelApi.getHotels(params)
    );
  },

  getHotelById: async (hotelId) => {
    return apiCall(
      () => realBusinessHotelApi.getHotelById(hotelId),
      () => mockBusinessHotelApi.getHotelById(hotelId)
    );
  },

  createHotel: async (data) => {
    return apiCall(
      () => realBusinessHotelApi.createHotel(data),
      () => mockBusinessHotelApi.createHotel(data)
    );
  },

  updateHotel: async (hotelId, data) => {
    return apiCall(
      () => realBusinessHotelApi.updateHotel(hotelId, data),
      () => mockBusinessHotelApi.updateHotel(hotelId, data)
    );
  },

  deleteHotel: async (hotelId) => {
    return apiCall(
      () => realBusinessHotelApi.deleteHotel(hotelId),
      () => mockBusinessHotelApi.deleteHotel(hotelId)
    );
  },
};

// Mock 사업자 객실 API
const mockBusinessRoomApi = {
  getRooms: async (hotelId, params = {}) => {
    await delay();
    const rooms = mockRooms.filter((r) => r.hotelId === hotelId);
    return createResponse({
      rooms,
      total: rooms.length,
    });
  },

  getRoomById: async (roomId) => {
    await delay();
    const room = mockRooms.find((r) => r._id === roomId);
    if (!room) throw new Error("객실을 찾을 수 없습니다.");
    return createResponse(room);
  },

  createRoom: async (hotelId, data) => {
    await delay();
    return createResponse({
      _id: "room_new_" + Date.now(),
      hotelId,
      ...data,
      message: "객실이 등록되었습니다.",
    });
  },

  updateRoom: async (roomId, data) => {
    await delay();
    return createResponse({
      _id: roomId,
      ...data,
      message: "객실 정보가 수정되었습니다.",
    });
  },

  deleteRoom: async (roomId) => {
    await delay();
    return createResponse({ message: "객실이 삭제되었습니다." });
  },

  getPricePolicies: async (roomId) => {
    await delay();
    const policies = mockPricePolicies.filter((p) => p.roomId === roomId);
    return createResponse({ policies });
  },

  setPricePolicy: async (roomId, data) => {
    await delay();
    return createResponse({
      _id: "policy_new_" + Date.now(),
      roomId,
      ...data,
      message: "가격 정책이 설정되었습니다.",
    });
  },

  getInventory: async (roomId, params = {}) => {
    await delay();
    let inventory = [...mockInventory];

    if (params.dateFrom && params.dateTo) {
      inventory = inventory.filter((inv) => {
        const date = new Date(inv.date);
        const from = new Date(params.dateFrom);
        const to = new Date(params.dateTo);
        return date >= from && date <= to;
      });
    }

    return createResponse({ inventory });
  },

  updateInventory: async (roomId, date, data) => {
    await delay();
    return createResponse({
      message: "재고가 업데이트되었습니다.",
    });
  },
};

// 실제 API와 목업 API를 결합한 사업자 객실 API
export const businessRoomApi = {
  getRooms: async (hotelId, params = {}) => {
    return apiCall(
      () => realBusinessRoomApi.getRooms(hotelId, params),
      () => mockBusinessRoomApi.getRooms(hotelId, params)
    );
  },

  getRoomById: async (roomId) => {
    return apiCall(
      () => realBusinessRoomApi.getRoomById(roomId),
      () => mockBusinessRoomApi.getRoomById(roomId)
    );
  },

  createRoom: async (hotelId, data) => {
    return apiCall(
      () => realBusinessRoomApi.createRoom(hotelId, data),
      () => mockBusinessRoomApi.createRoom(hotelId, data)
    );
  },

  updateRoom: async (roomId, data) => {
    return apiCall(
      () => realBusinessRoomApi.updateRoom(roomId, data),
      () => mockBusinessRoomApi.updateRoom(roomId, data)
    );
  },

  deleteRoom: async (roomId) => {
    return apiCall(
      () => realBusinessRoomApi.deleteRoom(roomId),
      () => mockBusinessRoomApi.deleteRoom(roomId)
    );
  },

  getPricePolicies: async (roomId) => {
    return apiCall(
      () => realBusinessRoomApi.getPricePolicies(roomId),
      () => mockBusinessRoomApi.getPricePolicies(roomId)
    );
  },

  setPricePolicy: async (roomId, data) => {
    return apiCall(
      () => realBusinessRoomApi.setPricePolicy(roomId, data),
      () => mockBusinessRoomApi.setPricePolicy(roomId, data)
    );
  },

  getInventory: async (roomId, params = {}) => {
    return apiCall(
      () => realBusinessRoomApi.getInventory(roomId, params),
      () => mockBusinessRoomApi.getInventory(roomId, params)
    );
  },

  updateInventory: async (roomId, date, data) => {
    return apiCall(
      () => realBusinessRoomApi.updateInventory(roomId, date, data),
      () => mockBusinessRoomApi.updateInventory(roomId, date, data)
    );
  },
};

// Mock 사업자 예약 API
const mockBusinessReservationApi = {
  getReservations: async (params = {}) => {
    await delay();
    let reservations = [...mockBusinessReservations];

    // 필터링
    if (params.status) {
      reservations = reservations.filter((r) => r.status === params.status);
    }

    if (params.hotelId) {
      reservations = reservations.filter((r) => r.hotelId === params.hotelId);
    }

    return createResponse({
      reservations,
      totalPages: 1,
      currentPage: 1,
      total: reservations.length,
    });
  },

  getReservationById: async (reservationId) => {
    await delay();
    const reservation = mockBusinessReservations.find(
      (r) => r._id === reservationId
    );
    if (!reservation) throw new Error("예약을 찾을 수 없습니다.");
    return createResponse(reservation);
  },

  updateReservationStatus: async (reservationId, status) => {
    await delay();
    return createResponse({
      message: "예약 상태가 변경되었습니다.",
      status,
    });
  },

  cancelReservation: async (reservationId, reason) => {
    await delay();
    return createResponse({
      message: "예약이 취소되었습니다.",
    });
  },
};

// 실제 API와 목업 API를 결합한 사업자 예약 API
export const businessReservationApi = {
  getReservations: async (params = {}) => {
    return apiCall(
      () => realBusinessReservationApi.getReservations(params),
      () => mockBusinessReservationApi.getReservations(params)
    );
  },

  getReservationById: async (reservationId) => {
    return apiCall(
      () => realBusinessReservationApi.getReservationById(reservationId),
      () => mockBusinessReservationApi.getReservationById(reservationId)
    );
  },

  updateReservationStatus: async (reservationId, status) => {
    return apiCall(
      () => realBusinessReservationApi.updateReservationStatus(reservationId, status),
      () => mockBusinessReservationApi.updateReservationStatus(reservationId, status)
    );
  },

  cancelReservation: async (reservationId, reason) => {
    return apiCall(
      () => realBusinessReservationApi.cancelReservation(reservationId, reason),
      () => mockBusinessReservationApi.cancelReservation(reservationId, reason)
    );
  },
};

// Mock 사업자 리뷰 API
const mockBusinessReviewApi = {
  getReviews: async (params = {}) => {
    await delay();
    let reviews = [...mockBusinessReviews];

    if (params.hotelId) {
      reviews = reviews.filter((r) => r.hotelId === params.hotelId);
    }

    return createResponse({
      reviews,
      totalPages: 1,
      currentPage: 1,
      total: reviews.length,
    });
  },

  getReviewById: async (reviewId) => {
    await delay();
    const review = mockBusinessReviews.find((r) => r._id === reviewId);
    if (!review) throw new Error("리뷰를 찾을 수 없습니다.");
    return createResponse(review);
  },

  replyToReview: async (reviewId, replyContent) => {
    await delay();
    return createResponse({
      message: "답변이 작성되었습니다.",
      reply: {
        content: replyContent,
        createdAt: new Date().toISOString(),
      },
    });
  },

  reportReview: async (reviewId, reason, content) => {
    await delay();
    return createResponse({
      message: "리뷰 신고가 접수되었습니다.",
    });
  },
};

// 실제 API와 목업 API를 결합한 사업자 리뷰 API
export const businessReviewApi = {
  getReviews: async (params = {}) => {
    return apiCall(
      () => realBusinessReviewApi.getReviews(params),
      () => mockBusinessReviewApi.getReviews(params)
    );
  },

  getReviewById: async (reviewId) => {
    return apiCall(
      () => realBusinessReviewApi.getReviewById(reviewId),
      () => mockBusinessReviewApi.getReviewById(reviewId)
    );
  },

  replyToReview: async (reviewId, replyContent) => {
    return apiCall(
      () => realBusinessReviewApi.replyToReview(reviewId, replyContent),
      () => mockBusinessReviewApi.replyToReview(reviewId, replyContent)
    );
  },

  reportReview: async (reviewId, reason, content) => {
    return apiCall(
      () => realBusinessReviewApi.reportReview(reviewId, reason, content),
      () => mockBusinessReviewApi.reportReview(reviewId, reason, content)
    );
  },
};

// Mock 사업자 통계 API
const mockBusinessStatsApi = {
  getStatistics: async (params = {}) => {
    await delay();
    return createResponse({
      revenue: {
        total: 12500000,
        monthly: 3500000,
        daily: 120000,
      },
      bookings: {
        total: 45,
        monthly: 12,
        daily: 2,
      },
      occupancy: {
        rate: 78,
        totalRooms: 15,
        bookedRooms: 12,
      },
    });
  },

  getRevenueChart: async (params = {}) => {
    await delay();
    return createResponse({
      labels: ["1월", "2월", "3월", "4월", "5월", "6월"],
      revenue: [2000000, 2500000, 2200000, 2800000, 3000000, 3500000],
    });
  },
};

// 실제 API와 목업 API를 결합한 사업자 통계 API
export const businessStatsApi = {
  getStatistics: async (params = {}) => {
    return apiCall(
      () => realBusinessStatsApi.getStatistics(params),
      () => mockBusinessStatsApi.getStatistics(params)
    );
  },

  getRevenueChart: async (params = {}) => {
    return apiCall(
      () => realBusinessStatsApi.getRevenueChart(params),
      () => mockBusinessStatsApi.getRevenueChart(params)
    );
  },
};

// Mock 사업자 정산 API
const mockBusinessSettlementApi = {
  getSettlements: async (params = {}) => {
    await delay();
    return createResponse({
      settlements: [
        {
          _id: "settle_001",
          month: "2024-11",
          totalRevenue: 15000000,
          platformFee: 750000,
          tax: 1500000,
          finalAmount: 12750000,
          status: "pending",
          paymentDate: "2024-12-05",
        },
        {
          _id: "settle_002",
          month: "2024-10",
          totalRevenue: 12000000,
          platformFee: 600000,
          tax: 1200000,
          finalAmount: 10200000,
          status: "completed",
          paymentDate: "2024-11-05",
        },
      ],
    });
  },

  getSettlementById: async (settlementId) => {
    await delay();
    return createResponse({
      _id: settlementId,
      month: "2024-11",
      totalRevenue: 15000000,
      platformFee: 750000,
      tax: 1500000,
      finalAmount: 12750000,
      status: "pending",
      paymentDate: "2024-12-05",
      details: [],
    });
  },
};

// 실제 API와 목업 API를 결합한 사업자 정산 API
export const businessSettlementApi = {
  getSettlements: async (params = {}) => {
    return apiCall(
      () => realBusinessSettlementApi.getSettlements(params),
      () => mockBusinessSettlementApi.getSettlements(params)
    );
  },

  getSettlementById: async (settlementId) => {
    return apiCall(
      () => realBusinessSettlementApi.getSettlementById(settlementId),
      () => mockBusinessSettlementApi.getSettlementById(settlementId)
    );
  },
};
