import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import styles from "./ProfileView.module.scss";
import UserProfileModule from "@/modules/UserProfileModule"; // 我们将复用这个模块的内容

const ProfileView: React.FC = () => {
  const navigate = useNavigate();

  return (
    <main className={styles.profileViewLayout}>
      <header className={styles.profileHeader}>
        <Button
          type="primary"
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate("/")} // 点击返回主仪表盘
        >
          返回仪表盘
        </Button>
        <div className={styles.headerTitle}>个人中心</div>
      </header>
      <section className={styles.profileContent}>
        {/* 这里嵌入了我们之前创建的个人中心模块 */}
        <UserProfileModule />
      </section>
    </main>
  );
};

export default ProfileView;
