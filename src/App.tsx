import React, { useState } from "react";
import { BrowserRouter, Navigate } from "react-router-dom";
import { ConfigProvider, theme } from "antd";
import { AppRouter } from "@/router"; // 1. 引入我们新的路由组件
import "antd/dist/reset.css";
import { useAuthStore } from "./stores";

function App() {
  // const token = sessionStorage.getItem("token");

  // if (!token) {
  //   return <Navigate to="/login" replace state={{ from: location }} />;
  // }
  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        token: {
          colorPrimary: "#00ddff",
          colorInfo: "#00ddff",
          colorBgBase: "#0d0221",
          colorBgContainer: "#1d103f",
          colorBorder: "rgba(0, 221, 255, 0.2)",
          colorText: "rgba(255, 255, 255, 0.85)",
          colorTextSecondary: "rgba(255, 255, 255, 0.65)",
        },
        components: {
          Table: { headerBg: "#150c30" },
          Modal: { headerBg: "#1d103f" },
        },
      }}
    >
      {/* BrowserRouter 需要在 AppRouter 的外部 */}
      <BrowserRouter>
        {/* 2. 在这里渲染 AppRouter，并传入所需的状态和函数 */}
        <AppRouter
        // isLoggedIn={isLoggedIn}
        // onLoginSuccess={handleLoginSuccess}
        // onLogout={handleLogout}
        />
      </BrowserRouter>
    </ConfigProvider>
  );
}

export default App;
