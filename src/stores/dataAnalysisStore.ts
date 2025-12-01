import { create } from "zustand";
import { message } from "antd";
import { dataAnalysisService } from "@/services";
import type {
  DataAnalysisKpi,
  DataAnalysisTrends24h,
  DataAnalysisEfficiency,
  DataAnalysisSizeDistribution,
  DataAnalysisLatestAlarmSnapshot,
} from "@/types";

interface DataAnalysisState {
  kpi: DataAnalysisKpi | null;
  trends24h: DataAnalysisTrends24h | null;
  efficiency: DataAnalysisEfficiency | null;
  sizeDistribution: DataAnalysisSizeDistribution | null;
  latestAlarms: DataAnalysisLatestAlarmSnapshot[];

  loadingKpi: boolean;
  loadingTrends: boolean;
  loadingEfficiency: boolean;
  loadingSizeDistribution: boolean;
  loadingLatestAlarms: boolean;

  fetchKpi: () => Promise<void>;
  fetchTrends24h: () => Promise<void>;
  fetchEfficiency: () => Promise<void>;
  fetchSizeDistribution: () => Promise<void>;
  fetchLatestAlarms: (limit?: number) => Promise<void>;
  /** 一次性拉取所有分析数据，方便仪表盘初始化 */
  fetchAll: () => Promise<void>;
}

export const useDataAnalysisStore = create<DataAnalysisState>((set, get) => ({
  kpi: null,
  trends24h: null,
  efficiency: null,
  sizeDistribution: null,
  latestAlarms: [],

  loadingKpi: false,
  loadingTrends: false,
  loadingEfficiency: false,
  loadingSizeDistribution: false,
  loadingLatestAlarms: false,

  async fetchKpi() {
    try {
      set({ loadingKpi: true });
      const res = await dataAnalysisService.getKpi();
      set({ kpi: res.data });
    } catch (error) {
      console.error("获取仪表盘 KPI 失败:", error);
      message.error("获取仪表盘关键指标失败");
    } finally {
      set({ loadingKpi: false });
    }
  },

  async fetchTrends24h() {
    try {
      set({ loadingTrends: true });
      const res = await dataAnalysisService.getTrends24h();
      set({ trends24h: res.data });
    } catch (error) {
      console.error("获取 24 小时趋势数据失败:", error);
      message.error("获取 24 小时趋势数据失败");
    } finally {
      set({ loadingTrends: false });
    }
  },

  async fetchEfficiency() {
    try {
      set({ loadingEfficiency: true });
      const res = await dataAnalysisService.getEfficiency();
      set({ efficiency: res.data });
    } catch (error) {
      console.error("获取报警处理效率失败:", error);
      message.error("获取报警处理效率失败");
    } finally {
      set({ loadingEfficiency: false });
    }
  },

  async fetchSizeDistribution() {
    try {
      set({ loadingSizeDistribution: true });
      const res = await dataAnalysisService.getSizeDistribution();
      set({ sizeDistribution: res.data });
    } catch (error) {
      console.error("获取尺寸分布数据失败:", error);
      message.error("获取尺寸分布数据失败");
    } finally {
      set({ loadingSizeDistribution: false });
    }
  },

  async fetchLatestAlarms(limit) {
    try {
      set({ loadingLatestAlarms: true });
      const res = await dataAnalysisService.getLatestAlarms(limit);
      set({ latestAlarms: res.data });
    } catch (error) {
      console.error("获取最新报警快照失败:", error);
      message.error("获取最新报警快照失败");
    } finally {
      set({ loadingLatestAlarms: false });
    }
  },

  async fetchAll() {
    const { fetchKpi, fetchTrends24h, fetchEfficiency, fetchSizeDistribution, fetchLatestAlarms } =
      get();
    await Promise.all([
      fetchKpi(),
      fetchTrends24h(),
      fetchEfficiency(),
      fetchSizeDistribution(),
      fetchLatestAlarms(),
    ]);
  },
}));


