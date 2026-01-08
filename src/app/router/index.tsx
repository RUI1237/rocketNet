import { createBrowserRouter, Navigate } from "react-router-dom";
import { AuthGuard, GuestGuard } from "./guards";
import { lazyLoad } from "@/shared/utils/lazyLoad";
import { alarmLogLoader } from "@/features/alarm-log/loader/dataAnalysisLoader";
import { predictionLogLoader } from "@/features/prediction-log/loader/predictionLogLoader";
import { dataAnalysisLoader } from "@/features/data-analysis/loader/dataAnalysisLoader";
import { profileLoader } from "@/features/user-profile/loader/profileLoader";

// 导入组件（懒加载形式）
const AuthView = () => import("@/features/auth/views/AuthView"); // 认证视图
const MainLayout = () => import("@/app/layout/MainLayout");
const MonitoringModule = () => import("@/features/monitoring/components/MonitoringModule");
const AlarmLogView = () => import("@/features/alarm-log/views/AlarmLogView");
const PredictionLogView = () => import("@/features/prediction-log/views/PredictionLogView");
const DataAnalysisView = () => import("@/features/data-analysis/views/DataAnalysisView");
const ProfileView = () => import("@/features/user-profile/views/ProfileView");
const ErrorPage = () => import("@/features/error-page/views/ErrorPage");
const RootLayout = () => import("@/app/layout/RootLayout");
export const router = createBrowserRouter([
  {
    path: "/",
    // 🔥 核心改动：用 RootLayout 包裹一切
    element: lazyLoad(RootLayout),
    // errorElement: lazyLoad(ErrorPage), // 全局错误也在这层捕获
    children: [
      // --- 1. 公开路由 (Login) ---
      {
        path: "/login",
        // 使用 GuestGuard 包裹，防止已登录用户再次进入
        element: <GuestGuard>{lazyLoad(AuthView)}</GuestGuard>,
      },

      // --- 2. 受保护的路由 (需要登录) ---
      {
        // 这里没有 path，或者 path="/"，作为父级布局容器
        element: <AuthGuard />, // 关键：整个分支都被 AuthGuard 保护
        errorElement: lazyLoad(ErrorPage),
        children: [
          {
            element: lazyLoad(MainLayout), // 布局组件
            children: [
              {
                index: true, // 等同于 path: "/"
                element: <Navigate to="/analysis" replace />,
              },
              // 业务模块
              {
                path: "monitoring",
                element: lazyLoad(MonitoringModule),
              },
              {
                path: "alarm",
                element: lazyLoad(AlarmLogView),
                loader: alarmLogLoader,
              },
              {
                path: "prediction",
                element: lazyLoad(PredictionLogView),
                loader: predictionLogLoader,
              },
              {
                path: "analysis",
                element: lazyLoad(DataAnalysisView),
                loader: dataAnalysisLoader,
              },
            ],
          },
          {
            path: "/profile",
            element: lazyLoad(ProfileView),
            loader: profileLoader,
          },
        ],
      },

      // --- 3. 404 路由 ---
      {
        path: "*",
        element: <Navigate to="/" replace />,
      },
    ],
  },
]);
