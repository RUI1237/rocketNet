import apiClient from "@/shared/services/http";
import type { AlarmLogType, AlarmLogRespond } from "../types/alarm.types";
import type { QuaryLogs } from "@/shared/types";

export const alarmService = {
  /** 分页获取报警日志列表 */
  fetchLogs: (params: QuaryLogs): Promise<AlarmLogRespond> => {
    return apiClient.get("/alarms/page", { params });
  },

  /** 获取报警详情 */
  fetchLogDetail: (id: number): Promise<AlarmLogType> => {
    return apiClient.get(`/alarms/${id}`);
  },

  /** 处理报警 */
  processAlarm: (id: number, notes: string): Promise<boolean> => {
    return apiClient.post(`/alarms/${id}/process`, { id, notes });
  },
};
