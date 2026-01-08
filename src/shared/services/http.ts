import axios, { AxiosError } from "axios";
import type { ApiResponse } from "../types";
import { BASE_URL, TIME_OUT } from "../config/index";
import { router } from "@/app/router";

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: TIME_OUT,
});

// Token getter function - will be set by auth feature to avoid circular dependency
let getAuthToken: (() => string | undefined) | null = null;

export const setAuthTokenGetter = (getter: () => string | undefined) => {
  getAuthToken = getter;
};

apiClient.interceptors.request.use(
  (config) => {
    const token = getAuthToken?.();
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
    if (res.code === 401) {
      router.navigate("/login", { replace: true });
      return Promise.reject(new Error(res.msg || "登录过期"));
    }
    return res.data;
  },
  (error: AxiosError<ApiResponse<null>>) => {
    return Promise.reject(error);
  }
);

export default apiClient;
