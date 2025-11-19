// src/services/auth.service.ts

import apiClient from "./http";
import type { ApiResponse, User } from "@/types";

/**
 * 封装认证相关的 API 调用
 */
export const authService = {
  /**
   * 用户登录
   * @param data - 包含用户名和密码
   */
  login: (data: User): Promise<ApiResponse<User>> => {
    return apiClient.get("/user/login", {
      params: data,
    });
  },
};
