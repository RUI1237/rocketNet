import apiClient from "@/shared/services/http";
import type { User } from "@/features/auth/types/auth.types";

export const profileService = {
  /** 获取用户信息 */
  getUserInfo: (username: string): Promise<User> => {
    return apiClient.get("/user/information", { params: { username } });
  },

  /** 更新基本信息 */
  updateBasicInfo: (user: User): Promise<string> => {
    const formData = new FormData();
    formData.append("username", user.username);
    formData.append("token", user.token);
    if (user.email) formData.append("email", user.email);
    return apiClient.post("/user/reset", formData);
  },

  /** 修改密码 */
  changePassword: (
    username: string,
    token: string,
    oldPassword: string,
    newPassword: string
  ): Promise<string> => {
    const formData = new FormData();
    formData.append("username", username);
    formData.append("token", token);
    formData.append("oldPassword", oldPassword);
    formData.append("password", newPassword);
    return apiClient.post("/user/reset", formData);
  },

  /** 上传头像 */
  uploadAvatar: (username: string, token: string, avatar: File): Promise<string> => {
    const formData = new FormData();
    formData.append("username", username);
    formData.append("token", token);
    formData.append("avatar", avatar);
    return apiClient.post("/user/reset", formData);
  },
};
