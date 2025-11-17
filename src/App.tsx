import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ConfigProvider, theme } from "antd";
import AuthView from "@/views/AuthView/AuthView";
import MainLayout from "@/views/MainLayout/MainLayout";
import "antd/dist/reset.css";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLoginSuccess = () => setIsLoggedIn(true);
  const handleLogout = () => setIsLoggedIn(false);

  return (
    // 使用 ConfigProvider 包裹整个应用，以注入统一的主题
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm, // 使用 antd 的暗色算法作为基础
        token: {
          // 覆盖关键颜色为我们的主题色
          colorPrimary: "#00ddff", // 主色调 (按钮、链接、选中项等)
          colorInfo: "#00ddff", // 信息色
          colorBgBase: "#0d0221", // 基础背景色
          colorBgContainer: "#1d103f", // 容器背景色 (表格、模态框、输入框等)
          colorBorder: "rgba(0, 221, 255, 0.2)", // 边框色
          colorText: "rgba(255, 255, 255, 0.85)", // 主要文本颜色
          colorTextSecondary: "rgba(255, 255, 255, 0.65)", // 次要文本颜色
        },
        components: {
          Table: {
            headerBg: "#150c30", // 表头背景可以更深一些，增加对比度
          },
          Modal: {
            headerBg: "#1d103f", // 模态框头部背景与容器一致
          },
        },
      }}
    >
      <BrowserRouter>
        <Routes>
          <Route
            path="/login"
            element={
              !isLoggedIn ? <AuthView onLoginSuccess={handleLoginSuccess} /> : <Navigate to="/" />
            }
          />
          <Route
            path="/*"
            element={isLoggedIn ? <MainLayout onLogout={handleLogout} /> : <Navigate to="/login" />}
          />
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  );
}

export default App;
