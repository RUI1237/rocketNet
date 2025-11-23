// export interface LogType<T> extends T;
export interface QuaryLogs {
  page: number;
  pageSize: number;
  operator?: string; // 当前操作员
}

export interface ProcessPayload {
  id: number;
  notes?: string;
}
