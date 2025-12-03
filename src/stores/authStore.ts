import { create } from "zustand";
import type { User } from "@/types";
import { authService } from "@/services";
import { message } from "antd";
import { getErrorMessage } from "@/utils/getErrorMessage";
// import { base64ToFile } from "@/utils/fileUtils";

interface AuthState {
  isLoggedIn: boolean;
  user: User | null;
  login: (userData: User) => Promise<string>;
  logout: () => void;
  getInf: () => Promise<void>;
  reSetInf: (user: User) => Promise<void>;
}

const useAuthStore = create<AuthState>((set, get) => ({
  isLoggedIn: !!sessionStorage.getItem("authToken"),
  user:
    sessionStorage.getItem("username") && sessionStorage.getItem("authToken")
      ? {
          username: sessionStorage.getItem("username") || "",
          token: sessionStorage.getItem("authToken") || "",
          avatarUrl: sessionStorage.getItem("avatarUrl") || "",
        }
      : null,
  /**
   * 模拟异步登录
   * @param userData - 登录成功后从API获取的用户数据
   */
  login: async (userData) => {
    console.log("正在登录...", userData);
    const res = await authService.login(userData);
    console.log(res);
    if (res.code) {
      sessionStorage.setItem("authToken", res.data.token);
      sessionStorage.setItem("username", userData.username);
      if (res.data.avatarUrl) sessionStorage.setItem("avatarUrl", res.data.avatarUrl);

      set({ isLoggedIn: true, user: { ...userData, ...res.data, password: "" } });
    }
    console.log(get().user);
    return res.msg;
  },

  logout: () => {
    sessionStorage.clear();
    set({ isLoggedIn: false, user: null });
  },

  getInf: async () => {
    let user = await authService.getInf(useAuthStore.getState().user?.username!);
    // if (user.data.processedaAatarUrl) {
    //   user.data.processedaAatarUrl = URL.createObjectURL(
    //     base64ToFile(user.data.processedaAatarUrl, "uploaded_avatar.png")
    //   );
    // }

    set((state) => ({
      user: state.user ? { ...state.user, ...user.data } : null,
    }));
  },

  reSetInf: async (newUser) => {
    console.log("reset newUser", newUser);

    try {
      await authService.reSetInf(newUser);
      sessionStorage.setItem("username", newUser.username);
      if (newUser.avatarUrl) sessionStorage.setItem("avatarUrl", newUser.avatarUrl);
      message.success(`修改成功!`);
    } catch (error) {
      message.error(`修改失败! ${getErrorMessage(error)}`);
    }
  },
}));

export { useAuthStore };
