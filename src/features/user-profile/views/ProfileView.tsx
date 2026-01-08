import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import UserProfileModule from "../components/UserProfileModule";
import styles from "../styles/ProfileView.module.scss";

// 路由 loader - 在进入页面前获取用户数据

const ProfileView: React.FC = () => {
  const navigate = useNavigate();

  return (
    <main className={styles.profileViewLayout}>
      <header className={styles.profileHeader}>
        <Button
          className={styles.backBtn}
          type="default"
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate("/")}
        >
          返回仪表盘
        </Button>
        <div className={styles.headerTitle}>个人中心</div>
      </header>
      <section className={styles.profileContent}>
        <UserProfileModule />
      </section>
    </main>
  );
};

export default ProfileView;
