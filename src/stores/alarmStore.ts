import { create } from "zustand";
import { message } from "antd";
import type { AlarmLogType } from "@/types";
import { alarmService } from "@/services";

interface AlarmStore {
  logs: AlarmLogType[];
  isLoading: boolean;

  // Actions
  fetchLogs: () => Promise<void>;
  // processAlarm 现在接收 logId 和 备注
  processAlarm: (logId: string, notes: string) => Promise<void>;
}

export const useAlarmStore = create<AlarmStore>((set, get) => ({
  logs: [],
  isLoading: false,

  fetchLogs: async () => {
    set({ isLoading: true });
    try {
      const data = await alarmService.fetchLogs();
      set({ logs: data });
    } catch (error) {
      message.error("获取报警日志失败");
    } finally {
      set({ isLoading: false });
    }
  },

  processAlarm: async (logId: string, notes: string) => {
    // 模拟当前登录用户
    const currentUser = "AdminUser";

    try {
      await alarmService.processLog({ logId, notes, operator: currentUser });

      // 乐观更新本地状态
      set((state) => ({
        logs: state.logs.map((log) =>
          log.logId === logId
            ? {
                ...log,
                status: "已处理",
                acknowledgedBy: currentUser,
                notes: notes,
                acknowledgedTime: new Date().toLocaleString(), // 简单模拟时间
              }
            : log
        ),
      }));

      message.success(`日志 ${logId} 处理成功!`);
    } catch (error) {
      message.error("处理失败，请稍后重试");
    }
  },
}));
