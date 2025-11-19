export interface ApiResponse<T> {
  code: number;
  msg: string;
  data: T;
}

export * from "./auth.types";
export * from "./alarm.types";
