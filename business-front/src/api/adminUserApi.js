import axiosClient from "./axiosClient";
import { mockUserApi } from "./mockApi";

const USE_MOCK = true;

export const adminUserApi = {
  // 사용자 목록 조회
  getUsers: (params) => {
    if (USE_MOCK) return mockUserApi.getUsers(params);
    return axiosClient.get("/admin/users", { params });
  },

  // 사용자 상세 조회
  getUserById: (userId) => {
    if (USE_MOCK) return mockUserApi.getUserById(userId);
    return axiosClient.get(`/admin/users/${userId}`);
  },

  // 사용자 정보 수정
  updateUser: (userId, data) => {
    if (USE_MOCK) return mockUserApi.updateUser(userId, data);
    return axiosClient.put(`/admin/users/${userId}`, data);
  },

  // 사용자 삭제
  deleteUser: (userId) => {
    if (USE_MOCK) return mockUserApi.deleteUser(userId);
    return axiosClient.delete(`/admin/users/${userId}`);
  },

  // 사용자 상태 변경 (활성화/비활성화)
  updateUserStatus: (userId, status) => {
    if (USE_MOCK) return mockUserApi.updateUserStatus(userId, status);
    return axiosClient.put(`/admin/users/${userId}/status`, { status });
  },

  // 사업자 목록 조회
  getBusinessUsers: (params) => {
    if (USE_MOCK) return mockUserApi.getBusinessUsers(params);
    return axiosClient.get("/admin/users/business", { params });
  },
};

export default adminUserApi;
