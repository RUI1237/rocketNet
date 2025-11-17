import React, { useState, useRef } from "react"; // useRef 保持不变
import { Layout, Menu, Dropdown, Avatar, Space } from "antd";
import type { MenuProps } from "antd";
import {
  PieChartOutlined,
  VideoCameraOutlined,
  WarningOutlined,
  LogoutOutlined,
  UserOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import styles from "./MainLayout.module.scss";
import MonitoringModule from "@/modules/MonitoringModule";
import AlarmLogModule from "@/modules/AlarmLogModule";
import { useMousePosition } from "@/hooks/useMousePosition";

const { Header, Content, Sider } = Layout;

interface MainLayoutProps {
  onLogout: () => void;
}

const MainLayout: React.FC<MainLayoutProps> = ({ onLogout }) => {
  const [selectedKey, setSelectedKey] = useState("1");
  const [currentModuleTitle, setCurrentModuleTitle] = useState("画面监控");

  // --- 核心修改在这里 ---
  // 将 useRef 的泛型从 <HTMLDivElement | null> 改为 <HTMLDivElement>
  const contentRef = useRef<HTMLDivElement>(null!);
  // --- 修改结束 ---

  const mousePosition = useMousePosition(contentRef); // 现在这里的类型将完美匹配

  const onSelectMenu = ({ key }: { key: string }) => {
    setSelectedKey(key);
    switch (key) {
      case "1":
        setCurrentModuleTitle("画面监控");
        break;
      case "2":
        setCurrentModuleTitle("报警日志");
        break;
      case "3":
        setCurrentModuleTitle("数据分析");
        break;
      default:
        setCurrentModuleTitle("仪表盘");
    }
  };

  const dropdownItems: MenuProps["items"] = [
    { key: "1", label: "个人中心", icon: <UserOutlined /> },
    { key: "2", label: "系统设置", icon: <SettingOutlined /> },
    { type: "divider" },
    { key: "3", label: "退出登录", icon: <LogoutOutlined />, danger: true, onClick: onLogout },
  ];

  const renderContent = () => {
    switch (selectedKey) {
      case "1":
        return <MonitoringModule />;
      case "2":
        return <AlarmLogModule />;
      default:
        return <div style={{ color: "white" }}>欢迎使用系统</div>;
    }
  };

  return (
    <Layout className={styles.mainLayout}>
      <Sider breakpoint="lg" collapsedWidth="0" className={styles.sider}>
        <div className={styles.logo}>GEMINI</div>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["1"]}
          onSelect={onSelectMenu}
          style={{ background: "transparent", borderRight: 0 }}
          items={[
            { key: "1", icon: <VideoCameraOutlined />, label: "画面监控" },
            { key: "2", icon: <WarningOutlined />, label: "报警日志" },
            { key: "3", icon: <PieChartOutlined />, label: "数据分析" },
          ]}
        />
      </Sider>
      <Layout>
        <Header className={styles.header}>
          <div className={styles.headerTitle}>{currentModuleTitle}</div>
          <Dropdown menu={{ items: dropdownItems }} trigger={["click"]}>
            <a onClick={(e) => e.preventDefault()} className={styles.userProfile}>
              <Space>
                <Avatar className={styles.avatar} icon={<UserOutlined />} />
                <span>Admin</span>
              </Space>
            </a>
          </Dropdown>
        </Header>
        <Content
          ref={contentRef}
          className={styles.content}
          style={
            {
              "--mouse-x": `${mousePosition.x}px`,
              "--mouse-y": `${mousePosition.y}px`,
            } as React.CSSProperties
          }
        >
          {renderContent()}
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
