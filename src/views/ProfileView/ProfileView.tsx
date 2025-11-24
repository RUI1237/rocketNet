import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import styles from "./ProfileView.module.scss";
import UserProfileModule from "@/modules/UserProfileModule";

const ProfileView: React.FC = () => {
  const navigate = useNavigate();

  return (
    <main className={styles.profileViewLayout}>
      <header className={styles.profileHeader}>
        <Button
          // 🟢 1. 添加自定义样式类
          className={styles.backBtn}
          // 🟢 2. 建议去掉 type="primary"，避免 AntD 默认蓝色干扰，或者改为 "default"
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
