import type { AlarmLogType, ProcessAlarmPayload } from "@/types/alarm.types";
import dayjs from "dayjs"; // 建议安装 dayjs 处理时间: npm install dayjs

// 模拟后端数据库
let mockData: AlarmLogType[] = [
  {
    logId: "LOG-20251119-001",
    alarmTime: "2025-11-19 10:30:05",
    alarmType: "岩石尺寸异常",
    status: "未处理",
    originalFilename: "cam01_20251119_103005.jpg",
    measuredLength: 1.25,
    resultImageUrl: "E:/rock_storage/results/ab1f2120-5ba1-4bbb-9b75-deda395df5b9.jpg",
    acknowledgedBy: "",
    acknowledgedTime: "",
    notes: "",
  },
  {
    logId: "LOG-20251119-002",
    alarmTime: "2025-11-19 09:15:21",
    alarmType: "输送带异物",
    status: "已处理",
    originalFilename: "cam02_20251119_091521.jpg",
    measuredLength: 0.8,
    resultImageUrl: "E:/rock_storage/results/failure_example.jpg",
    acknowledgedBy: "Admin",
    acknowledgedTime: "2025-11-19 09:20:00",
    notes: "误报，已确认为反光。",
  },
];

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const alarmService = {
  // GET /api/alarms
  fetchLogs: async (): Promise<AlarmLogType[]> => {
    await delay(500);
    return JSON.parse(JSON.stringify(mockData)); // 深拷贝返回
  },

  // POST /api/alarms/process
  processLog: async (payload: ProcessAlarmPayload): Promise<boolean> => {
    await delay(400);
    const target = mockData.find((item) => item.logId === payload.logId);

    if (target) {
      target.status = "已处理";
      target.acknowledgedBy = payload.operator;
      target.notes = payload.notes;
      target.acknowledgedTime = dayjs().format("YYYY-MM-DD HH:mm:ss");
      return true;
    }
    throw new Error("日志未找到");
  },
};
