import { create } from "zustand";
import { message } from "antd";
import type { AlarmLogType, QuaryLogs } from "@/types";
import { logsService } from "@/services";
import { useAuthStore } from "./authStore";

interface AlarmStore {
  logs: AlarmLogType[];
  isLoading: boolean;
  total: number;

  fetchLogs: (data: QuaryLogs) => Promise<void>;
  processAlarm: (id: number, notes: string) => Promise<void>;
  fetchLogDetail: (id: number) => Promise<void>;
}

export const useAlarmStore = create<AlarmStore>((set) => ({
  logs: [],
  isLoading: false,
  total: 1,

  fetchLogs: async (data: QuaryLogs) => {
    set({ isLoading: true });
    try {
      const res = await logsService.fetchLogs<AlarmLogType>(data, "/alarms/page");
      set({ logs: res.data.records, total: res.data.total });
    } catch (error) {
      message.error("获取报警日志失败");
    } finally {
      set({ isLoading: false });
    }
  },

  fetchLogDetail: async (id: number) => {
    try {
      const res = await logsService.fetchLogDetail<AlarmLogType>(id, `/alarms/${id}`);

      set((state) => ({
        logs: state.logs.map((log) => (log.id === id ? { ...log, ...res.data } : log)),
      }));

      console.log(`日志 ${id} 获取成功!`);
    } catch (error) {
      console.log("处理失败，请稍后重试", error);
    }
  },
  processAlarm: async (id: number, notes: string) => {
    const username = useAuthStore.getState().user?.username;
    try {
      await logsService.processLog({ id, notes }, `/alarms/${id}/process`);
      set((state) => ({
        logs: state.logs.map((log) =>
          log.id === id
            ? {
                ...log,
                status: "已处理",
                acknowledgedBy: username,
                notes: notes,
                acknowledgedTime: new Date().toLocaleString(),
              }
            : log
        ),
      }));

      message.success(`日志 ${id} 处理成功!`);
    } catch (error) {
      message.error("处理失败，请稍后重试");
    }
  },
}));
