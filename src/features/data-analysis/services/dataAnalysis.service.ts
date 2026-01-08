import apiClient from "@/shared/services/http";
import type {
  DataAnalysisKpi,
  DataAnalysisTrends24h,
  DataAnalysisEfficiency,
  DataAnalysisSizeDistribution,
  DataAnalysisLatestAlarmSnapshot,
} from "../types/dataAnalysis.types";

export const dataAnalysisService = {
  /** 获取仪表盘顶部四个关键实时指标 */
  getKpi: (): Promise<DataAnalysisKpi> => {
    return apiClient.get("/analytics/kpi");
  },

  /** 获取 24 小时任务 & 报警趋势数据 */
  getTrends24h: (): Promise<DataAnalysisTrends24h> => {
    return apiClient.get("/analytics/trends/24h");
  },

  /** 获取报警处理效率统计 */
  getEfficiency: (): Promise<DataAnalysisEfficiency> => {
    return apiClient.get("/analytics/efficiency");
  },

  /** 获取超规尺寸分布数据 */
  getSizeDistribution: (): Promise<DataAnalysisSizeDistribution> => {
    return apiClient.get("/analytics/size-distribution");
  },

  /** 获取最新 N 条报警事件快照 */
  getLatestAlarms: (limit = 10): Promise<DataAnalysisLatestAlarmSnapshot[]> => {
    return apiClient.get("/analytics/latest-alarms", {
      params: { limit },
    });
  },
};
