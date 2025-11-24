import React, { useEffect, useState } from "react";
import { message } from "antd";
import styles from "@/styles/UserProfile.module.scss";

// 引入拆分的组件和类型
import UserInfoSidebar from "./UserInfoSidebar";
import BasicInfoForm from "./BasicInfoForm";
import SecuritySettingsForm from "./SecuritySettingsForm";
import { useAuthStore } from "@/stores";

const UserProfileModule: React.FC = () => {
  const { getInf } = useAuthStore((state) => state);
  // 头像上传处理

  useEffect(() => {
    getInf();
  });

  return (
    <div className={styles.container}>
      <div className={styles.layoutGrid}>
        {/* 左侧：固定展示区 */}
        <UserInfoSidebar />

        {/* 右侧：输入交互区 */}
        <div className={styles.rightContent}>
          <BasicInfoForm />

          <SecuritySettingsForm />
        </div>
      </div>
    </div>
  );
};

export default UserProfileModule;
