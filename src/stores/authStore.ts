import { create } from "zustand";
import type { User } from "@/types";
import { authService } from "@/services";
// 1. 定义用户信息的类型接口

// 2. 定义 Store 的 state 和 actions 的类型接口
interface AuthState {
  isLoggedIn: boolean;
  user: User | null;
  login: (userData: User) => Promise<string>; // 登录是一个异步操作
  logout: () => void;
  updateUser: (newUserData: Partial<User>) => void; // 用于更新用户信息
}

// 3. 使用 create 函数创建 store
const useAuthStore = create<AuthState>((set) => ({
  // --- State (状态) ---
  isLoggedIn: false,
  user: null,

  // --- Actions (操作) ---

  /**
   * 模拟异步登录
   * @param userData - 登录成功后从API获取的用户数据
   */
  login: async (userData) => {
    // 在这里你可以执行真实的 API 调用
    console.log("正在登录...", userData);
    const res = await authService.login(userData);
    // 登录成功后，使用 set 更新状态
    if (!res.code) return res.msg;
    set({ isLoggedIn: true, user: { ...userData, token: res.data } });
    // set({ isLoggedIn: true, user: userData });

    return "success";
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
  updateUser: (newUserData) => {
    set((state) => ({
      // 使用扩展运算符保留旧信息，并覆盖新信息
      user: state.user ? { ...state.user, ...newUserData } : null,
    }));
  },
}));

export { useAuthStore };
export type { User };
