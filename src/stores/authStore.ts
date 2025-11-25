import { create } from "zustand";
import type { User } from "@/types";
import { authService } from "@/services";
import { base64ToFile } from "@/utils/fileUtils";
// 1. 定义用户信息的类型接口

// 2. 定义 Store 的 state 和 actions 的类型接口
interface AuthState {
  isLoggedIn: boolean;
  user: User | null;
  login: (userData: User) => Promise<string>; // 登录是一个异步操作
  logout: () => void;
  //updateUser: (newUserData: Partial<User>) => void; // 用于更新用户信息
  getInf: () => Promise<void>;
  reSetInf: (user: User) => Promise<string>;
  // reSetPwd: (userData: User, oldPassword: string) => Promise<string>;
}

// 3. 使用 create 函数创建 store
const useAuthStore = create<AuthState>((set, get) => ({
  // --- State (状态) ---
  isLoggedIn: false,
  user: null,

  // --- Actions (操作) ---

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

  /**
   * 退出登录
   */
  logout: () => {
    // 退出登录时，重置状态
    set({ isLoggedIn: false, user: null });
  },

  /**
   * 更新用户信息 (例如：在个人中心修改后)
   * @param newUserData - 新的用户信息
   */
  // updateUser: (newUserData) => {
  //   set((state) => ({
  //     // 使用扩展运算符保留旧信息，并覆盖新信息
  //     user: state.user ? { ...state.user, ...newUserData } : null,
  //   }));
  // },

  getInf: async () => {
    let user = await authService.getInf(useAuthStore.getState().user?.username!);
    if (user.data.processedaAatarUrl) {
      user.data.processedaAatarUrl = URL.createObjectURL(
        base64ToFile(user.data.processedaAatarUrl, "uploaded_avatar.png")
      );
    }
    //   user.data.processedaAatarUrl = window.URL.createObjectURL(user.data.avatar);
    set((state) => ({
      // 使用扩展运算符保留旧信息，并覆盖新信息
      user: state.user ? { ...state.user, ...user.data } : null,
    }));
    // get().updateUser(user.data);
  },
  reSetInf: async (newUser) => {
    const res = await authService.reSetInf(newUser);
    return res.msg;
  },

  // reSetPwd: async (userData, newPassword) => {
  //   const res = await get().login(userData);
  //   if (res != "success") return res;
  //   return await get().reSetInf({ ...userData, ...{ passward: newPassword } });
  // },
}));

export { useAuthStore };
