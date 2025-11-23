import React from "react";
import { useRoutes, Navigate } from "react-router-dom";
import AuthView from "@/views/AuthView/AuthView";
import MainLayout from "@/views/MainLayout/MainLayout";
import ProfileView from "@/views/ProfileView/ProfileView";

// 1. 引入所有模块组件
import MonitoringModule from "@/modules/MonitoringModule";
import AlarmLogModule from "@/modules/AlarmLogModule";
import PredictionLogModule from "@/modules/PredictionLogModule";
import DataAnalysisModule from "@/modules/DataAnalysisModule";
import { useAuthStore } from "@/stores";

interface AppRouterProps {}

export const AppRouter: React.FC<AppRouterProps> = () => {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const routes = useRoutes([
    {
      path: "/login",
      element: !isLoggedIn ? <AuthView /> : <Navigate to="/" />,
    },
    {
      path: "/*",
      element: isLoggedIn ? <AuthenticatedRoutes /> : <Navigate to="/login" />,
    },
  ]);
  return routes;
};

// 2. 在这里定义二级路由
const AuthenticatedRoutes: React.FC = () => {
  const authenticatedRoutes = useRoutes([
    {
      path: "/",
      // MainLayout 现在是布局组件，它内部会有一个 <Outlet />
      element: <MainLayout />,
      // 3. 定义子路由 (二级路由)
      children: [
        {
          // index: true 表示当访问父路由 '/' 时，默认渲染这个组件
          // index: true,
          path: "monitoring",
          element: <MonitoringModule />,
        },
        {
          path: "alarm", // 路径是 /alarm
          element: <AlarmLogModule />,
        },
        {
          path: "prediction", // 路径是 /prediction
          element: <PredictionLogModule />,
        },
        {
          index: true,
          path: "analysis", // 路径是 /analysis
          element: <DataAnalysisModule />,
        },
      ],
    },
    {
      path: "/profile",
      element: <ProfileView />,
    },
    {
      path: "*",
      element: <Navigate to="/" />,
    },
  ]);

  return authenticatedRoutes;
};
