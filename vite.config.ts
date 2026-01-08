import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { visualizer } from "rollup-plugin-visualizer";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    visualizer({
      open: true, // 打包完成后自动打开浏览器
      gzipSize: true, // 查看压缩后的大小 (实际传输大小)
      brotliSize: true,
      filename: "stats.html", // 生成的分析文件名
    }),
  ],
  build: {
    target: "es2020", // 现代浏览器，减少 polyfill
    sourcemap: false, // 生产环境关闭 sourcemap
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            // 1. 巨无霸 ECharts (优先级最高，因为最大)
            if (id.includes("echarts") || id.includes("zrender")) {
              return "echarts";
            }

            if (id.includes("antd") || id.includes("@ant-design") || id.includes("rc-")) {
              return "antd";
            }

            if (
              id.includes("/react/") || // 匹配 .../node_modules/react/...
              id.includes("/react-dom/") ||
              id.includes("/react-router")
            ) {
              return "react-vendor";
            }

            return "vendor";
          }
        },
      },
    },
    // 调高警告阈值，防止 ECharts 包太大报警 (ECharts 本身就大，这是正常的)
    chunkSizeWarningLimit: 1500,
  },
  server: {
    open: true, // 在开发服务器启动时自动在浏览器中打开应用程序
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"), // <--- 确保这一行存在且正确
      "@features": path.resolve(__dirname, "./src/features"), // 特性模块路径别名
      "@shared": path.resolve(__dirname, "./src/shared"), // 共享模块路径别名
      "@app": path.resolve(__dirname, "./src/app"), // 应用层路径别名
    },
  },
});
