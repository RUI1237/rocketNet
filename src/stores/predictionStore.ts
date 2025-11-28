import { create } from "zustand";
import { message } from "antd";
import type { PredictionLogType, QuaryLogs } from "@/types";
import { logsService } from "@/services";

interface PredictionStore {
  logs: PredictionLogType[];
  isLoading: boolean;
  total: number;

  fetchLogs: (data: QuaryLogs) => Promise<void>;
  fetchLogDetail: (id: number) => Promise<void>;
}

export const usePredictionStore = create<PredictionStore>((set) => ({
  logs: [],
  isLoading: false,
  total: 1,

  fetchLogs: async (data: QuaryLogs) => {
    set({ isLoading: true });
    try {
      const res = await logsService.fetchLogs<PredictionLogType>(data, "/predictions/page");
      set({ logs: res.data.records, total: res.data.total });
    } catch (error) {
      message.error("获取报警日志失败");
    } finally {
      set({ isLoading: false });
    }
  },

  fetchLogDetail: async (id: number) => {
    try {
      const res = await logsService.fetchLogDetail<PredictionLogType>(id, `/predictions/${id}`);
      set((state) => ({
        logs: state.logs.map((log) => (log.id === id ? { ...log, ...res.data } : log)),
      }));

      message.success(`日志 ${id} 获取成功!`);
    } catch (error) {
      message.error("处理失败，请稍后重试");
    }
  },
}));
