import { createBrowserRouter, Navigate } from "react-router-dom";
import { AuthGuard, GuestGuard } from "./guards"; // 引入上面的守卫
// 引入你的组件（这里假设你已经封装好了 lazyLoad）
import { lazyLoad } from "@/utils/lazyLoad";

// 导入组件（懒加载形式）
const AuthView = () => import("@/views/AuthView/AuthView"); // 示例
const MainLayout = () => import("@/views/MainLayout/MainLayout");
const MonitoringModule = () => import("@/modules/MonitoringModule");
const AlarmLogModule = () => import("@/modules/AlarmLogModule");
const PredictionLogModule = () => import("@/modules/PredictionLogModule");
const DataAnalysisModule = () => import("@/modules/DataAnalysisModule");
const ProfileView = () => import("@/views/ProfileView/ProfileView");

export const router = createBrowserRouter([
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
    children: [
      {
        path: "/",
        element: lazyLoad(MainLayout), // 布局组件
        children: [
          // 默认重定向
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
            element: lazyLoad(AlarmLogModule),
          },
          {
            path: "prediction",
            element: lazyLoad(PredictionLogModule),
          },
          {
            path: "analysis",
            element: lazyLoad(DataAnalysisModule),
          },
          // 个人中心 (如果它也在 MainLayout 里)
        ],
      },
      {
        path: "/profile",
        element: lazyLoad(ProfileView),
      },
      // 如果 Profile 不在 MainLayout 里，可以写在这里
      // { path: "profile", element: lazyLoad(ProfileView) }
    ],
  },

  // --- 3. 404 路由 ---
  {
    path: "*",
    element: <Navigate to="/" replace />, // 或者跳转到专门的 404 页面
  },
]);
