export interface ApiResponse<T> {
  code: number;
  msg: string;
  data: T;
}

export * from "./auth.types";
export * from "./alarm.types";
export * from "./prediction.types";
export * from "./log.types";
export * from "./dataAnalysis.types";
