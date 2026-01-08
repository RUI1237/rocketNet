export interface ApiResponse<T> {
  code: number;
  msg: string;
  data: T;
}

export interface QuaryLogs {
  page: number;
  pageSize: number;
  operator?: string; // 当前操作员
}

export interface ProcessPayload {
  id: number;
  notes?: string;
}
