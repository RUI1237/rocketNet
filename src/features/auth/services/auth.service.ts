import apiClient, { setAuthTokenGetter } from "@/shared/services/http";
import type { ApiResponse } from "@/shared/types";
import type { User } from "../types/auth.types";

// Initialize token getter - will be called when auth store is available
export const initAuthTokenGetter = (getter: () => string | undefined) => {
  setAuthTokenGetter(getter);
};

export const authService = {
  login: (data: User): Promise<ApiResponse<User>> => {
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
    const formData = new FormData();

    formData.append("username", user.username);
    formData.append("token", user.token);
    if (user.password) formData.append("password", user.password);
    if (user.oldPassword) formData.append("oldPassword", user.oldPassword!);

    if (user.email) formData.append("email", user.email);

    if (user.avatar) formData.append("avatar", user.avatar);

    return apiClient.post("/user/reset", formData);
  },
};
