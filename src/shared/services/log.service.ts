import apiClient from "./http";
import type { ProcessPayload, QuaryLogs } from "../types";

interface DataType<LogType> {
  total: number;
  records: LogType[];
}

export const logsService = {
  fetchLogs: async <LogType>(data: QuaryLogs, url: string): Promise<DataType<LogType>> => {
    return apiClient.get(url, {
      params: data,
    });
  },

  fetchLogDetail: async <LogType>(id: number, url: string): Promise<LogType> => {
    return apiClient.get(url, {
      params: { id },
    });
  },

  processLog: async (payload: ProcessPayload, url: string): Promise<boolean> => {
    return apiClient.post(url, payload);
  },
};
