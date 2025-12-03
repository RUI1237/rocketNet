import apiClient from "./http";
import type {
  ApiResponse,
  DataAnalysisKpi,
  DataAnalysisTrends24h,
  DataAnalysisEfficiency,
  DataAnalysisSizeDistribution,
  DataAnalysisLatestAlarmSnapshot,
} from "@/types";

export const dataAnalysisService = {
  /** 获取仪表盘顶部四个关键实时指标 */
  getKpi: (): Promise<ApiResponse<DataAnalysisKpi>> => {
    return apiClient.get("/analytics/kpi");
  },

  /** 获取 24 小时任务 & 报警趋势数据 */
  getTrends24h: (): Promise<ApiResponse<DataAnalysisTrends24h>> => {
    return apiClient.get("/analytics/trends/24h");
  },

  /** 获取报警处理效率统计 */
  getEfficiency: (): Promise<ApiResponse<DataAnalysisEfficiency>> => {
    return apiClient.get("/analytics/efficiency");
  },

  /** 获取超规尺寸分布数据 */
  getSizeDistribution: (): Promise<ApiResponse<DataAnalysisSizeDistribution>> => {
    return apiClient.get("/analytics/size-distribution");
  },

  /** 获取最新 N 条报警事件快照 */
  getLatestAlarms: (limit = 10): Promise<ApiResponse<DataAnalysisLatestAlarmSnapshot[]>> => {
    return apiClient.get("/analytics/latest-alarms", {
      params: { limit },
    });
  },
};
