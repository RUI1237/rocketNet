import apiClient from "./http";
import type { ApiResponse, User } from "@/types";

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

    // 2. 一个个把字段塞进去
    // 注意：FormData 只能存字符串或文件，如果是 number 需要转 string
    formData.append("username", user.username);
    formData.append("token", user.token);
    if (user.password) formData.append("password", user.password);
    if (user.oldPassword) formData.append("oldPassword", user.oldPassword!);

    // 处理可选字段 (如果有才塞)
    if (user.email) formData.append("email", user.email);

    // 3. 重点：处理文件
    // 如果 user.avatar 是 File 对象，直接塞进去
    if (user.avatar) formData.append("avatar", user.avatar);

    // 4. 发送请求
    // ⚠️ 关键点：不要手动写 Content-Type！
    // ⚠️ 关键点：axios 看到 formData 会自动帮你加上正确的 Content-Type 和 boundary
    return apiClient.post("/user/reset", formData);
  },
};
