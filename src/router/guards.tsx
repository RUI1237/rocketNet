import { useAuthStore } from "@/stores";
import type { JSX } from "react";
import { Navigate, Outlet } from "react-router-dom";

// 1. 登录鉴权守卫：只有登录了才能看，否则跳去登录页
export const AuthGuard = () => {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  // 如果没登录，重定向到 /login，并加上 replace 防止回退
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  // 如果登录了，渲染子路由 (Outlet)
  return <Outlet />;
};

// 2. 游客守卫：只有【没】登录才能看 (防止已登录用户访问登录页)
export const GuestGuard = ({ children }: { children: JSX.Element }) => {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  // 如果已经登录了，访问登录页时直接踢回首页
  if (isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  return children;
};
