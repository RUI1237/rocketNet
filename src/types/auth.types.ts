// src/types/api.ts

// import type { User } from "@/stores";

// 用户信息接口
// export interface User {
//   id: number;
//   username: string;
//   email: string;
//   avatar?: string;
// }
export interface User {
  username: string;
  password: string;
  email?: string;
  avatar?: string;
  phone?: string;
  registrationDate?: string;
  // role?: string;
}
// 登录请求体
export interface LoginPayload {
  username: string;
  password: string;
}

// 登录成功后的响应数据
export interface LoginResponse {
  token: string;
  user: User;
}

// 通用的 API 响应结构 (很多后端会这样设计)
export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

// 日志信息的接口
export interface Log {
  key: string;
  id: number;
  timestamp: string;
  message: string;
  level: "info" | "error" | "warning";
}
