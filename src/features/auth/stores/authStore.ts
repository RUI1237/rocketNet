import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { User } from "../types/auth.types";
import { authService, initAuthTokenGetter } from "../services/auth.service";
import { message } from "antd";
import { getErrorMessage } from "@/shared/utils/getErrorMessage";

interface AuthState {
  isLoggedIn: boolean;
  user: User | null;
  login: (userData: User) => Promise<void>;
  logout: () => void;
  getInf: () => Promise<void>;
  reSetInf: (user: User) => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isLoggedIn: false,
      user: null,

      login: async (userData) => {
        console.log("正在登录...", userData);
        const res = await authService.login(userData);

        set({
          isLoggedIn: true,
          user: { ...userData, ...res, password: "" },
        });
      },

      logout: () => {
        set({ isLoggedIn: false, user: null });
      },

      getInf: async () => {
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
      name: "authStore",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);

// Initialize the token getter for HTTP client
initAuthTokenGetter(() => useAuthStore.getState().user?.token);
