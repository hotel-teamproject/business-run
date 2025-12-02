import axiosClient from "./axiosClient";
import { mockReviewApi } from "./mockApi";

const USE_MOCK = true;

export const adminReviewApi = {
  // 리뷰 목록 조회
  getReviews: (params) => {
    if (USE_MOCK) return mockReviewApi.getReviews(params);
    return axiosClient.get("/admin/reviews", { params });
  },

  // 리뷰 상세 조회
  getReviewById: (reviewId) => {
    if (USE_MOCK) return mockReviewApi.getReviewById(reviewId);
    return axiosClient.get(`/admin/reviews/${reviewId}`);
  },

  // 리뷰 삭제
  deleteReview: (reviewId) => {
    if (USE_MOCK) return mockReviewApi.deleteReview(reviewId);
    return axiosClient.delete(`/admin/reviews/${reviewId}`);
  },

  // 신고된 리뷰 목록 조회
  getReportedReviews: (params) => {
    if (USE_MOCK) return mockReviewApi.getReportedReviews(params);
    return axiosClient.get("/admin/reviews/reported", { params });
  },

  // 리뷰 신고 처리
  handleReport: (reviewId, action) => {
    if (USE_MOCK) return mockReviewApi.handleReport(reviewId, action);
    return axiosClient.post(`/admin/reviews/${reviewId}/report`, { action });
  },
};

export default adminReviewApi;
