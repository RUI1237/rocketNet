import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
// import "./index.css";

async function enableMocking() {
  // 1. 检查环境：如果是生产环境 (production)，直接跳过
  // Vite 使用 import.meta.env.PROD 或 import.meta.env.DEV
  // return;
  if (import.meta.env.PROD) return;

  // 2. 动态导入 browser.ts
  // 这样可以确保 mock 代码不会被打包到生产环境的 bundle 中
  const { worker } = await import("@/mocks/browser");

  // 3. 启动 worker
  return worker.start({
    onUnhandledRequest: "bypass", // 对于没有 mock 的接口，直接放行，不报错
  });
}

// 4. 等待 MSW 启动后再渲染 App
enableMocking().then(() => {
  createRoot(document.getElementById("root")!).render(
    // <StrictMode>
    <App />
    // </StrictMode>
  );
});
