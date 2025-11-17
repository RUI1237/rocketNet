import React, { useState, useRef } from "react";
import { Dropdown, Avatar, Space } from "antd";
import type { MenuProps } from "antd";
// 1. 引入新的图标
import {
  PieChartOutlined,
  VideoCameraOutlined,
  WarningOutlined,
  LogoutOutlined,
  UserOutlined,
  SettingOutlined,
  ThunderboltOutlined, // 新增图标
} from "@ant-design/icons";
import styles from "./MainLayout.module.scss";
import MonitoringModule from "@/modules/MonitoringModule";
import AlarmLogModule from "@/modules/AlarmLogModule";
// 2. 引入新的模块组件
import PredictionLogModule from "@/modules/PredictionLogModule";
import DataAnalysisModule from "@/modules/DataAnalysisModule";
import { useMousePosition } from "@/hooks/useMousePosition";

// 3. 更新导航项数组
const navItems = [
  { key: "1", icon: <VideoCameraOutlined />, label: "画面监控" },
  { key: "2", icon: <WarningOutlined />, label: "报警日志" },
  { key: "3", icon: <ThunderboltOutlined />, label: "预测日志" }, // 新增
  { key: "4", icon: <PieChartOutlined />, label: "数据分析" }, // 调整 key
];

interface MainLayoutProps {
  onLogout: () => void;
}

const MainLayout: React.FC<MainLayoutProps> = ({ onLogout }) => {
  const [selectedKey, setSelectedKey] = useState("1");
  const layoutRef = useRef<HTMLDivElement>(null!);
  const mousePosition = useMousePosition(layoutRef);

  const dropdownItems: MenuProps["items"] = [
    { key: "1", label: "个人中心", icon: <UserOutlined /> },
    { key: "2", label: "系统设置", icon: <SettingOutlined /> },
    { type: "divider" },
    { key: "3", label: "退出登录", icon: <LogoutOutlined />, danger: true, onClick: onLogout },
  ];

  const renderContent = () => {
    const module = (() => {
      // 4. 更新 switch 语句以渲染新模块
      switch (selectedKey) {
        case "1":
          return <MonitoringModule />;
        case "2":
          return <AlarmLogModule />;
        case "3":
          return <PredictionLogModule />; // 新增
        case "4":
          return <DataAnalysisModule />; // 新增
        default:
          return <div style={{ padding: "2rem", color: "#94a3b8" }}>请选择一个模块</div>;
      }
    })();

    return selectedKey ? (
      <div className={styles.contentPanel} key={selectedKey}>
        {module}
      </div>
    ) : null;
  };

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
            <button
              key={item.key}
              className={`${styles.navButton} ${selectedKey === item.key ? styles.active : ""}`}
              onClick={() => setSelectedKey(item.key)}
            >
              <span className={styles.icon}>{item.icon}</span>
              <span className={styles.label}>{item.label}</span>
            </button>
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

      <section className={styles.contentArea}>{renderContent()}</section>
    </main>
  );
};

export default MainLayout;
