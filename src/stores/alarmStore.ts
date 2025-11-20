import { create } from "zustand";
import { message } from "antd";
import type { AlarmLogType, ProcessAlarmPayload } from "@/types";
import { alarmService } from "@/services";
import { useAuthStore } from "./authStore";
import { useEffect } from "react";

interface AlarmStore {
  logs: AlarmLogType[];
  isLoading: boolean;
  total: number;

  // Actions
  load: () => Promise<void>;
  fetchLogs: (data: ProcessAlarmPayload) => Promise<void>;
  // processAlarm 现在接收 logId 和 备注
  processAlarm: (id: number, notes: string) => Promise<void>;
  moreAlarm: (id: number) => Promise<void>;
}

export const useAlarmStore = create<AlarmStore>((set, get) => ({
  logs: [],
  isLoading: false,
  total: 0,

  load: async () => {
    set({ isLoading: true });
    try {
      const res = await alarmService.fetchLogs({ page: 1, pageSize: 10 });
      set({ logs: res.data.records, total: res.data.total });
    } catch (error) {
      message.error("获取报警日志失败");
    } finally {
      set({ isLoading: false });
    }
  },

  fetchLogs: async (data: ProcessAlarmPayload) => {
    set({ isLoading: true });
    try {
      const res = await alarmService.fetchLogs(data);
      set({ logs: res.data.records });
    } catch (error) {
      message.error("获取报警日志失败");
    } finally {
      set({ isLoading: false });
    }
  },

  moreAlarm: async (id: number) => {
    // const user = useAuthStore((state) => state.user);
    // 模拟当前登录用户
    try {
      const res = await alarmService.moreAlarm({ id });

      // 乐观更新本地状态
      set((state) => ({
        logs: state.logs.map((log) => (log.id === id ? res.data : log)),
      }));

      message.success(`日志 ${id} 获取成功!`);
    } catch (error) {
      message.error("处理失败，请稍后重试");
    }
  },
  processAlarm: async (id: number, notes: string) => {
    const user = useAuthStore((state) => state.user);
    // 模拟当前登录用户
    try {
      await alarmService.processLog({ id, notes });

      // 乐观更新本地状态
      set((state) => ({
        logs: state.logs.map((log) =>
          log.id === id
            ? {
                ...log,
                status: "已处理",
                acknowledgedBy: user?.username,
                notes: notes,
                acknowledgedTime: new Date().toLocaleString(), // 简单模拟时间
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
