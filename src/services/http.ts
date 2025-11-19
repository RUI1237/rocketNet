// src/services/http.ts

import axios, { AxiosError } from "axios";
import { message } from "antd";
import { useAuthStore } from "@/stores/authStore"; // 假设你的 store 在这个路径
import type { ApiResponse } from "@/types"; // 假设你有通用的响应类型
import { BASE_URL, TIME_OUT } from "@/config";
// 假设你有通用的响应类型

// 创建 Axios 实例
const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: TIME_OUT,
});

// 请求拦截器：为每个请求注入 Token
apiClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().user?.username;
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器：统一处理数据和错误
apiClient.interceptors.response.use(
  (response) => {
    // 假设后端成功时总是返回 { code, message, data } 结构
    // 我们在这里直接返回 `data` 字段，简化组件中的使用
    // 注意：如果你的后端直接返回数据，而不是包裹一层，你可以直接返回 response.data
    // return response.data.data || response.data;
    return response.data;
  },
  (error: AxiosError<ApiResponse<null>>) => {
    // 全局错误处理
    if (error.response) {
      const status = error.response.status;
      const errorMessage = error.response.data?.msg || "请求失败，请稍后重试";

      switch (status) {
        case 401:
          message.error("登录已过期，请重新登录。");
          // 调用 store 的 logout 方法，清空用户信息并重定向
          useAuthStore.getState().logout();
          break;
        case 403:
          message.error("您没有权限执行此操作。");
          break;
        case 404:
          message.error("请求的资源不存在。");
          break;
        case 500:
          message.error("服务器内部错误，请联系管理员。");
          break;
        default:
          message.error(errorMessage);
      }
    } else if (error.request) {
      message.error("网络连接异常，请检查您的网络。");
    } else {
      message.error(`请求发送失败: ${error.message}`);
    }

    return Promise.reject(error);
  }
);

export default apiClient;
