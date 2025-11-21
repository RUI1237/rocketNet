// src/services/predictionService.ts
import axios from "axios";
import type {
  // ApiResponse,
  PageResult,
  PredictionTask,
  PredictionQueryParams,
} from "@/types/prediction.types";
import type { ApiResponse } from "@/types";

// 假设 API 前缀
// const BASE_URL = "/api/prediction";

export const predictionService = {
  /**
   * 获取预测任务分页列表
   */
  getTaskList: async (params: PredictionQueryParams) => {
    // 这里模拟 request，实际请换成您项目封装好的 axios 实例
    const res = await axios.get<ApiResponse<PageResult<PredictionTask>>>(`prediction/page`, {
      params,
    });
    return res.data;
  },

  /**
   * 获取单个任务的详情（包含 events 列表）
   */
  getTaskDetail: async (taskId: string) => {
    const res = await axios.get<ApiResponse<PredictionTask>>(`prediction/${taskId}`);
    return res.data;
  },
};
