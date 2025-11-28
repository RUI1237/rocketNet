import apiClient from "./http";
import type { ApiResponse, User } from "@/types";

export const authService = {
  login: (data: User): Promise<ApiResponse<string>> => {
    return apiClient.get("/user/login", {
      params: data,
    });
  },
  register: (data: any): Promise<ApiResponse<string>> => {
    return apiClient.post("/user/register", data);
  },
  getInf: (username: string): Promise<ApiResponse<User>> => {
    return apiClient.get("/user/information", { params: { username } });
  },
  reSetInf: (user: User): Promise<ApiResponse<string>> => {
    return apiClient.post("/user/reset", user);
  },
};
