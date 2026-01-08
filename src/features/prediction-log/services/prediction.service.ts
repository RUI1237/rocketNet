import apiClient from "@/shared/services/http";
import type { PredictionLogType, PredictionLogRespond } from "../types/prediction.types";
import type { QuaryLogs } from "@/shared/types";

export const predictionService = {
  /** 分页获取预测日志列表 */
  fetchLogs: (params: QuaryLogs): Promise<PredictionLogRespond> => {
    return apiClient.get("/predictions/page", { params });
  },

  /** 获取预测详情 */
  fetchLogDetail: (id: number): Promise<PredictionLogType> => {
    return apiClient.get(`/predictions/${id}`);
  },

  /** 重试失败的任务 */
  retryTask: (id: number): Promise<boolean> => {
    return apiClient.post(`/predictions/${id}/retry`);
  },
};
