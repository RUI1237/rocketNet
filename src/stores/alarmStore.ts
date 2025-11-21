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
  // load: () => Promise<void>;
  fetchLogs: (data: ProcessAlarmPayload) => Promise<void>;
  // processAlarm 现在接收 logId 和 备注
  processAlarm: (id: number, notes: string) => Promise<void>;
  moreAlarm: (id: number) => Promise<void>;
}

const mockAlarmLogs: AlarmLogType[] = [
  {
    id: 1,
    logId: "ALM-20231121-0001",
    alarmTime: "2023-11-21 09:15:30",
    alarmType: "长度超限",
    status: "未处理",
    originalFilename: "scan_data_001.raw",
    measuredLength: 105.2,
    resultImageUrl: "E:/storage/20231121/img_001_error.jpg",
  },
  {
    id: 2,
    logId: "ALM-20231121-0002",
    alarmTime: "2023-11-21 10:22:15",
    alarmType: "表面缺陷",
    status: "已处理",
    originalFilename: "scan_data_002.raw",
    measuredLength: 98.5,
    resultImageUrl: "E:/storage/20231121/img_002_defect.jpg",
    acknowledgedBy: "张三",
    acknowledgedTime: "2023-11-21 11:00:00",
    notes: "已确认为误报，手动复位。",
  },
  {
    id: 3,
    logId: "ALM-20231121-0003",
    alarmTime: "2023-11-21 13:45:00",
    alarmType: "断裂报警",
    status: "未处理",
    originalFilename: "scan_data_005.raw",
    measuredLength: 45.0,
    resultImageUrl: "E:/storage/20231121/img_005_break.jpg",
  },
  {
    id: 4,
    logId: "ALM-20231120-0998",
    alarmTime: "2023-11-20 16:30:20",
    alarmType: "长度不足",
    status: "已处理",
    originalFilename: "scan_data_old_998.raw",
    measuredLength: 88.1,
    resultImageUrl: "E:/storage/20231120/img_998_short.jpg",
    acknowledgedBy: "李四",
    acknowledgedTime: "2023-11-20 17:00:00",
    notes: "次品已剔除。",
  },
  {
    id: 5,
    logId: "ALM-20231121-0001",
    alarmTime: "2023-11-21 09:15:30",
    alarmType: "长度超限",
    status: "未处理",
    originalFilename: "scan_data_001.raw",
    measuredLength: 105.2,
    resultImageUrl: "E:/storage/20231121/img_001_error.jpg",
  },
  {
    id: 6,
    logId: "ALM-20231121-0002",
    alarmTime: "2023-11-21 10:22:15",
    alarmType: "表面缺陷",
    status: "已处理",
    originalFilename: "scan_data_002.raw",
    measuredLength: 98.5,
    resultImageUrl: "E:/storage/20231121/img_002_defect.jpg",
    acknowledgedBy: "张三",
    acknowledgedTime: "2023-11-21 11:00:00",
    notes: "已确认为误报，手动复位。",
  },
  {
    id: 7,
    logId: "ALM-20231121-0003",
    alarmTime: "2023-11-21 13:45:00",
    alarmType: "断裂报警",
    status: "未处理",
    originalFilename: "scan_data_005.raw",
    measuredLength: 45.0,
    resultImageUrl: "E:/storage/20231121/img_005_break.jpg",
  },
  {
    id: 8,
    logId: "ALM-20231120-0998",
    alarmTime: "2023-11-20 16:30:20",
    alarmType: "长度不足",
    status: "已处理",
    originalFilename: "scan_data_old_998.raw",
    measuredLength: 88.1,
    resultImageUrl: "E:/storage/20231120/img_998_short.jpg",
    acknowledgedBy: "李四",
    acknowledgedTime: "2023-11-20 17:00:00",
    notes: "次品已剔除。",
  },
  {
    id: 9,
    logId: "ALM-20231121-0003",
    alarmTime: "2023-11-21 13:45:00",
    alarmType: "断裂报警",
    status: "未处理",
    originalFilename: "scan_data_005.raw",
    measuredLength: 45.0,
    resultImageUrl: "E:/storage/20231121/img_005_break.jpg",
  },
  {
    id: 10,
    logId: "ALM-20231120-0998",
    alarmTime: "2023-11-20 16:30:20",
    alarmType: "长度不足",
    status: "已处理",
    originalFilename: "scan_data_old_998.raw",
    measuredLength: 88.1,
    resultImageUrl: "E:/storage/20231120/img_998_short.jpg",
    acknowledgedBy: "李四",
    acknowledgedTime: "2023-11-20 17:00:00",
    notes: "次品已剔除。",
  },
  // {
  //   id: 11,
  //   logId: "ALM-20231121-0003",
  //   alarmTime: "2023-11-21 13:45:00",
  //   alarmType: "断裂报警",
  //   status: "未处理",
  //   originalFilename: "scan_data_005.raw",
  //   measuredLength: 45.0,
  //   resultImageUrl: "E:/storage/20231121/img_005_break.jpg",
  // },
  // {
  //   id: 12,
  //   logId: "ALM-20231120-0998",
  //   alarmTime: "2023-11-20 16:30:20",
  //   alarmType: "长度不足",
  //   status: "已处理",
  //   originalFilename: "scan_data_old_998.raw",
  //   measuredLength: 88.1,
  //   resultImageUrl: "E:/storage/20231120/img_998_short.jpg",
  //   acknowledgedBy: "李四",
  //   acknowledgedTime: "2023-11-20 17:00:00",
  //   notes: "次品已剔除。",
  // },
];

export const useAlarmStore = create<AlarmStore>((set, get) => ({
  logs: [],
  isLoading: false,
  total: 1,

  // load: async () => {
  //   set({ isLoading: true });
  //   try {
  //     // const res = await alarmService.fetchLogs({ page: 1, pageSize: 10 });
  //     // set({ logs: res.data.records, total: res.data.total });
  //     set({ logs: mockAlarmLogs, total: 4 });
  //   } catch (error) {
  //     message.error("获取报警日志失败");
  //   } finally {
  //     set({ isLoading: false });
  //   }
  // },

  fetchLogs: async (data: ProcessAlarmPayload) => {
    set({ isLoading: true });
    try {
      set({ logs: mockAlarmLogs, total: 20 });
      // const res = await alarmService.fetchLogs(data);
      // set({ logs: res.data.records, total: res.data.total });
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
