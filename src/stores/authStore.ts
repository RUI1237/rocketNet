import { create } from "zustand";
// 1. 必须引入中间件
import { persist, createJSONStorage } from "zustand/middleware";
import type { User } from "@/types";
import { authService } from "@/services";
import { message } from "antd";
import { getErrorMessage } from "@/utils/getErrorMessage";

interface AuthState {
  isLoggedIn: boolean; // 建议初始设为 false，不要用 null
  user: User | null;
  login: (userData: User) => Promise<string>;
  logout: () => void;
  getInf: () => Promise<void>;
  reSetInf: (user: User) => Promise<void>;
}

// 2. 使用 create<AuthState>()(...) 的柯里化写法，TS 推断更准确
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // 3. 初始化状态：布尔值给 false，不要给 null
      isLoggedIn: false,
      user: null,

      login: async (userData) => {
        console.log("正在登录...", userData);
        const res = await authService.login(userData);

        if (res.code) {
          // 4. 【重要】删除了所有 sessionStorage.setItem
          // 只要调用 set 更新了 state，persist 中间件会自动把它存入 sessionStorage
          set({
            isLoggedIn: true,
            user: { ...userData, ...res.data, password: "" },
          });
        }
        return res.msg;
      },

      logout: () => {
        // 5. 【重要】删除了 sessionStorage.clear()
        // 只要把 state 置空，persist 中间件会自动清空 storage 里的对应数据
        set({ isLoggedIn: false, user: null });
      },

      getInf: async () => {
        // 注意：这里需要确保 user 存在再发请求，增加 ?.
        const currentUsername = get().user?.username;
        if (!currentUsername) return;

        try {
          let userRes = await authService.getInf(currentUsername);
          set((state) => ({
            user: state.user ? { ...state.user, ...userRes.data } : null,
          }));
        } catch (error) {
          console.error("获取信息失败", error);
        }
      },

      reSetInf: async (newUser) => {
        try {
          await authService.reSetInf(newUser);

          // 更新本地状态，persist 会自动同步到 storage
          set((state) => ({
            user: state.user ? { ...state.user, ...newUser } : null,
          }));

          message.success(`修改成功!`);
        } catch (error) {
          message.error(`修改失败! ${getErrorMessage(error)}`);
        }
      },
    }),
    {
      // 配置项
      name: "authStore", // sessionStorage 中的 Key
      storage: createJSONStorage(() => sessionStorage), // 指定使用 SessionStorage
      // 可选：部分持久化 (如果你不想存 isLoggedIn，只想存 user)
      // partialize: (state) => ({ user: state.user, isLoggedIn: state.isLoggedIn }),
    }
  )
);
