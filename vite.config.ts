import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    open: true, // 在开发服务器启动时自动在浏览器中打开应用程序
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"), // <--- 确保这一行存在且正确
    },
  },
});
