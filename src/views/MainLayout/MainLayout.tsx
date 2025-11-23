import React from "react"; // 不再需要 useState
import { Dropdown, Avatar, Space } from "antd";
import type { MenuProps } from "antd";
// 1. 引入 Outlet 和 NavLink
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import {
  PieChartOutlined,
  VideoCameraOutlined,
  WarningOutlined,
  LogoutOutlined,
  UserOutlined,
  SettingOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";
import styles from "./MainLayout.module.scss";
// 不再需要直接引入模块组件
import { useMousePosition } from "@/hooks/useMousePosition";
import { useAuthStore } from "@/stores";

// 2. 更新导航项，加入 to 属性用于导航
const navItems = [
  { key: "1", to: "/analysis", icon: <PieChartOutlined />, label: "数据分析" },
  { key: "2", to: "/monitoring", icon: <VideoCameraOutlined />, label: "画面监控" },
  { key: "3", to: "/alarm", icon: <WarningOutlined />, label: "报警日志" },
  { key: "4", to: "/prediction", icon: <ThunderboltOutlined />, label: "预测日志" },
];

interface MainLayoutProps {
  // onLogout?: () => void;
}

const MainLayout: React.FC<MainLayoutProps> = () => {
  const layoutRef = React.useRef<HTMLDivElement>(null!); // useRef 保持
  const mousePosition = useMousePosition(layoutRef);
  const navigate = useNavigate();

  const dropdownItems: MenuProps["items"] = [
    {
      key: "profile",
      label: "个人中心",
      icon: <UserOutlined />,
      onClick: () => navigate("/profile"),
    },
    { key: "settings", label: "系统设置", icon: <SettingOutlined /> },
    { type: "divider" },
    {
      key: "logout",
      label: "退出登录",
      icon: <LogoutOutlined />,
      danger: true,
      onClick: useAuthStore((state) => state.logout),
    },
  ];

  return (
    <main
      ref={layoutRef}
      className={styles.mainLayout}
      style={
        {
          "--mouse-x": `${mousePosition.x}px`,
          "--mouse-y": `${mousePosition.y}px`,
        } as React.CSSProperties
      }
    >
      <nav className={styles.mainNav}>
        <div className={styles.logo}>GEMINI</div>
        <div className={styles.navButtonsContainer}>
          {navItems.map((item) => (
            // 4. 使用 NavLink 组件替代 button
            <NavLink
              key={item.key}
              to={item.to}
              // NavLink 会自动在匹配当前 URL 时添加 'active' class
              // end={true} 确保 '/' 只在精确匹配时才激活
              end={item.to === "/"}
              className={({ isActive }) => `${styles.navButton} ${isActive ? styles.active : ""}`}
            >
              <span className={styles.icon}>{item.icon}</span>
              <span className={styles.label}>{item.label}</span>
            </NavLink>
          ))}
        </div>
      </nav>

      <header className={styles.header}>
        <Dropdown menu={{ items: dropdownItems }} trigger={["click"]}>
          <a onClick={(e) => e.preventDefault()} className={styles.userProfile}>
            <Space>
              <Avatar className={styles.avatar} icon={<UserOutlined />} />
              <span>Admin</span>
            </Space>
          </a>
        </Dropdown>
      </header>

      <section className={styles.contentArea}>
        {/* 5. 核心：在这里放置 Outlet，路由匹配的子组件将在这里渲染 */}
        <Outlet />
      </section>
    </main>
  );
};

export default MainLayout;
