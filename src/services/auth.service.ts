// src/services/auth.service.ts

import apiClient from "./http";
import type { LoginPayload, LoginResponse, User } from "@/types";

/**
 * 封装认证相关的 API 调用
 */
export const authService = {
  /**
   * 用户登录
   * @param data - 包含用户名和密码
   */
  login: (data: LoginPayload): Promise<LoginResponse> => {
    return apiClient.post("/auth/login", data);
  },

  /**
   * 获取当前登录用户的个人资料
   */
  getProfile: (): Promise<User> => {
    return apiClient.get("/user/profile");
  },

  /**
   * 刷新 Token (示例)
   */
  refreshToken: (): Promise<{ accessToken: string }> => {
    return apiClient.post("/auth/refresh-token");
  },
};
