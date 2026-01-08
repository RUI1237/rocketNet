import { Outlet } from "react-router-dom";
import GlobalLoading from "@shared/components/GlobalLoading";
import { App as AntdApp } from "antd"; // Antd 的全局上下文组件

export default function RootLayout() {
  return (
    // AntdApp 包裹是为了让 message/modal 静态方法能读到 Context
    <AntdApp>
      {/* 1. 挂载全局进度条监听器 */}
      <GlobalLoading />

      {/* 2. 渲染具体的子路由 (Login 或 MainLayout) */}
      <Outlet />
    </AntdApp>
  );
}
