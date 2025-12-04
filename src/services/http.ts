import axios, { AxiosError } from "axios";
import { useAuthStore } from "@/stores/authStore";
import type { ApiResponse } from "@/types";
import { BASE_URL, TIME_OUT } from "@/config";

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: TIME_OUT,
});

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

apiClient.interceptors.response.use(
  (response) => {
    const res = response.data;

    if (res.code === 0) {
      return Promise.reject(new Error(res.msg || "业务出错"));
    }

    return res;
  },
  (error: AxiosError<ApiResponse<null>>) => {
    // if (error.response) {
    //   const status = error.response.status;
    //   const errorMessage = error.response.data?.msg || "请求失败，请稍后重试";

    //   switch (status) {
    //     case 401:
    //       message.error("登录已过期，请重新登录。");
    //       // 调用 store 的 logout 方法，清空用户信息并重定向
    //       useAuthStore.getState().logout();
    //       break;
    //     case 403:
    //       message.error("您没有权限执行此操作。");
    //       break;
    //     case 404:
    //       message.error("请求的资源不存在。");
    //       break;
    //     case 500:
    //       message.error("服务器内部错误，请联系管理员。");
    //       break;
    //     default:
    //       message.error(errorMessage);
    //   }
    // } else if (error.request) {
    //   message.error("网络连接异常，请检查您的网络。");
    // } else {
    //   message.error(`请求发送失败: ${error.message}`);
    // }

    return Promise.reject(error);
  }
);

export default apiClient;
