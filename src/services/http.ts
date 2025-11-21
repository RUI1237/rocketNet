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
    const token = useAuthStore.getState().user?.token;
    if (token && config.headers) {
      config.headers.Authorization = token;
    }
    console.log(token);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器：统一处理数据和错误
apiClient.interceptors.response.use(
  (response) => {
    const res = response.data;

    // 2. 判断业务状态码 (假设后端约定：code === 200 才是成功，其他都是失败)
    // if (res.code !== 200) {
    //   // 3. 关键点：手动返回一个 rejected Promise
    //   // 这会强制让代码跳到调用方的 .catch() 中
    //   return Promise.reject(new Error(res.msg || "业务出错"));
    // }

    // 业务成功，只返回数据部分
    return res;
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
