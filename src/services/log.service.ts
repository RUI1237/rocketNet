// src/services/log.service.ts

import apiClient from "./http";
import type { ApiResponse, User } from "@/types";

/**
 * 封装日志相关的 API 调用
 */
export const logService = {
  /**
   * 获取日志列表
   * @param params - 查询参数
   */
  register: (params: User): Promise<ApiResponse<User>> => {
    return apiClient.post("user/register", { params });
  },

  /**
   * 根据 ID 获取单条日志详情 (示例)
   * @param id - 日志 ID
   */
  // getLogById: (id: number): Promise<Log> => {
  //   return apiClient.get(`/logs/${id}`);
  // },
};
