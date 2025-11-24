// import dayjs from "dayjs"; // 建议安装 dayjs 处理时间: npm install dayjs
import apiClient from "./http";
import type { ApiResponse, ProcessPayload, QuaryLogs } from "@/types";

interface DataType<LogType> {
  total: number;
  records: LogType[];
}

export const logsService = {
  fetchLogs: async <LogType>(
    data: QuaryLogs,
    url: string
  ): Promise<ApiResponse<DataType<LogType>>> => {
    return apiClient.get(url, {
      params: data,
    });
  },

  fetchLogDetail: async <LogType>(id: number, url: string): Promise<ApiResponse<LogType>> => {
    return apiClient.get(url, {
      params: { id },
    });
  },

  processLog: async (payload: ProcessPayload, url: string): Promise<ApiResponse<boolean>> => {
    return apiClient.post(url, payload);
  },
};
