import { create } from "zustand";
import type { User } from "@/types";
import { authService } from "@/services";
// import { base64ToFile } from "@/utils/fileUtils";

interface AuthState {
  isLoggedIn: boolean;
  user: User | null;
  login: (userData: User) => Promise<string>;
  logout: () => void;
  getInf: () => Promise<void>;
  reSetInf: (user: User) => Promise<string>;
}

const useAuthStore = create<AuthState>((set, get) => ({
  isLoggedIn: false,
  user: null,

  /**
   * 模拟异步登录
   * @param userData - 登录成功后从API获取的用户数据
   */
  login: async (userData) => {
    console.log("正在登录...", userData);
    const res = await authService.login(userData);
    console.log(res);
    if (res.code) set({ isLoggedIn: true, user: { ...userData, token: res.data, password: "" } });
    console.log(get().user);
    return res.msg;
  },

  logout: () => {
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
    const res = await authService.reSetInf(newUser);
    return res.msg;
  },
}));

export { useAuthStore };
