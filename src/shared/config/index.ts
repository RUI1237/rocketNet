// 1. 尝试从浏览器本地存储获取自定义端口
const debugPort = localStorage.getItem("DEBUG_PORT");

// 2. 如果有自定义端口，就拼凑 localhost 地址；否则使用默认的环境变量
export const BASE_URL = debugPort
  ? `http://localhost:${debugPort}`
  : import.meta.env.PROD
    ? "http://localhost:8080"
    : "http://localhost:5173";

// export const BASE_URL = import.meta.env.VITE_API_BASE_URL;
console.log("当前使用的后端地址:", BASE_URL);
export const TIME_OUT = 100000;
