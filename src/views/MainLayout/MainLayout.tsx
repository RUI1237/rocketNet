import React, { useState, useRef, useEffect } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import {
  PieChartOutlined,
  VideoCameraOutlined,
  WarningOutlined,
  ThunderboltOutlined,
  UserOutlined,
  SettingOutlined,
  BellOutlined,
  PoweroffOutlined,
} from "@ant-design/icons";
import styles from "./MainLayout.module.scss";
import { useMousePosition } from "@/hooks/useMousePosition";
import { useAuthStore } from "@/stores";
import { Avatar } from "antd";

const navItems = [
  { key: "1", to: "/analysis", icon: <PieChartOutlined />, label: "数据分析" },
  { key: "2", to: "/monitoring", icon: <VideoCameraOutlined />, label: "画面监控" },
  { key: "3", to: "/alarm", icon: <WarningOutlined />, label: "报警日志" },
  { key: "4", to: "/prediction", icon: <ThunderboltOutlined />, label: "预测日志" },
];

const MainLayout: React.FC = () => {
  const layoutRef = useRef<HTMLDivElement>(null!);
  const menuRef = useRef<HTMLDivElement>(null);
  const mousePosition = useMousePosition(layoutRef);
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const user = useAuthStore((state) => state.user);
  // 点击外部关闭菜单
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
      {/* 侧边导航 */}
      <nav className={styles.mainNav}>
        <div className={styles.logo}>RockNet</div>
        <div className={styles.navButtonsContainer}>
          {navItems.map((item) => (
            <NavLink
              key={item.key}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) => `${styles.navButton} ${isActive ? styles.active : ""}`}
            >
              <span className={styles.icon}>{item.icon}</span>
              <span className={styles.label}>{item.label}</span>
            </NavLink>
          ))}
        </div>
      </nav>

      {/* 顶部 Header */}
      <header className={styles.header}>
        <div className={styles.userProfileWrapper} ref={menuRef}>
          {/* 头像按钮：无边框，颜色优化 */}
          <div
            className={styles.userAvatarBtn}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            title="User Profile"
          >
            <Avatar
              src={user?.avatarUrl || undefined}
              icon={!user?.avatarUrl && <UserOutlined style={{ fontSize: 30 }} />}
              // className={styles.avatarIcon}
              style={{ height: "100%", width: "100%" }}
            />
          </div>

          {/* 下拉菜单 */}
          <div className={`${styles.userMenuDropdown} ${isMenuOpen ? styles.active : ""}`}>
            <div className={styles.menuHeader}>
              <span className={styles.userName}>COMMANDER</span>
              <span className={styles.userEmail}>admin@rocknet.sys</span>
            </div>

            <div
              className={styles.menuItem}
              onClick={() => {
                navigate("/profile");
                setIsMenuOpen(false);
              }}
            >
              <UserOutlined /> <span>个人中心</span>
            </div>
            <div className={styles.menuItem}>
              <SettingOutlined /> <span>系统设置</span>
            </div>
            <div className={styles.menuItem}>
              <BellOutlined /> <span>消息通知</span>
            </div>

            <div style={{ height: 1, background: "rgba(255,255,255,0.05)", margin: "4px 0" }} />

            <div className={`${styles.menuItem} ${styles.logout}`} onClick={logout}>
              <PoweroffOutlined /> <span>退出登录</span>
            </div>
          </div>
        </div>
      </header>

      {/* 内容区域：无框模式 */}
      <section className={styles.contentArea}>
        <div className={styles.contentPanel}>
          <div className={styles.panelBody}>
            <Outlet />
          </div>
        </div>
      </section>
    </main>
  );
};

export default MainLayout;
