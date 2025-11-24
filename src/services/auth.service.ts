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
  login: (data: User): Promise<ApiResponse<string>> => {
    return apiClient.get("/user/login", {
      params: data,
    });
  },
  register: (data: any): Promise<ApiResponse<string>> => {
    return apiClient.post("/user/register", data);
  },
  getInf: (username: string): Promise<ApiResponse<User>> => {
    return apiClient.get("/user/information", { params: { username } });
  },
  reSetInf: (user: User): Promise<ApiResponse<string>> => {
    return apiClient.post("/user/reset", user);
  },
};
