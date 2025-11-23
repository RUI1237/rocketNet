import React, { Suspense, lazy } from "react";
import { useRoutes, Navigate } from "react-router-dom";
import { Spin } from "antd"; // 如果你使用了 Ant Design，推荐用 Spin，没有的话可以用简单的 div
import { useAuthStore } from "@/stores";

// ----------------------------------------------------------------------
// 1. 改为动态引入 (Lazy Loading)
// ----------------------------------------------------------------------
// 页面视图
const AuthView = lazy(() => import("@/views/AuthView/AuthView"));
const MainLayout = lazy(() => import("@/views/MainLayout/MainLayout"));
const ProfileView = lazy(() => import("@/views/ProfileView/ProfileView"));

// 业务模块
const MonitoringModule = lazy(() => import("@/modules/MonitoringModule"));
const AlarmLogModule = lazy(() => import("@/modules/AlarmLogModule"));
const PredictionLogModule = lazy(() => import("@/modules/PredictionLogModule"));
const DataAnalysisModule = lazy(() => import("@/modules/DataAnalysisModule"));

// ----------------------------------------------------------------------
// 2. 定义加载中的占位组件 (Loading)
// ----------------------------------------------------------------------
const PageLoader = () => (
  <div
    style={{
      height: "100%",
      width: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "200px", // 防止高度塌陷
    }}
  >
    {/* 如果项目没装 Antd，可以将 <Spin /> 换成简单的文字 <div>加载中...</div> */}
    <Spin size="large" tip="页面加载中..." />
  </div>
);

// ----------------------------------------------------------------------
// 3. 封装辅助函数：给懒加载组件包裹 Suspense
// 这样就不用在 useRoutes 里每行都写 Suspense 了，代码更干净
// ----------------------------------------------------------------------
const lazyLoad = (Component: React.LazyExoticComponent<any>) => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Component />
    </Suspense>
  );
};

interface AppRouterProps {}

export const AppRouter: React.FC<AppRouterProps> = () => {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  const routes = useRoutes([
    {
      path: "/login",
      // 使用 lazyLoad 包裹
      element: !isLoggedIn ? lazyLoad(AuthView) : <Navigate to="/" />,
    },
    {
      path: "/*",
      element: isLoggedIn ? <AuthenticatedRoutes /> : <Navigate to="/login" />,
    },
  ]);
  return routes;
};

// 4. 二级路由配置
const AuthenticatedRoutes: React.FC = () => {
  const authenticatedRoutes = useRoutes([
    {
      path: "/",
      // MainLayout 也可以懒加载
      element: lazyLoad(MainLayout),
      children: [
        {
          path: "/",
          element: <Navigate to="/analysis" />,
        },
        {
          path: "monitoring",
          // 这里原本是 <MonitoringModule />，现在改为函数调用
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
      ],
    },
    {
      path: "/profile",
      element: lazyLoad(ProfileView),
    },
    {
      path: "*",
      element: <Navigate to="/" />,
    },
  ]);

  return authenticatedRoutes;
};
