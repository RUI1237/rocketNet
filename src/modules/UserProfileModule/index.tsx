import React, { useEffect } from "react";
import styles from "@/styles/UserProfile.module.scss";

// 引入拆分的组件和类型
import UserInfoSidebar from "./UserInfoSidebar";
import BasicInfoForm from "./BasicInfoForm";
import SecuritySettingsForm from "./SecuritySettingsForm";
import { useAuthStore } from "@/stores";

const UserProfileModule: React.FC = () => {
  const { user, getInf } = useAuthStore((state) => state);
  // console.log("shdfahjsfgdah");

  useEffect(() => {
    getInf();
    return () => {
      if (user?.avatarUrl) URL.revokeObjectURL(user?.avatarUrl);
    };
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.layoutGrid}>
        <UserInfoSidebar />
        <div className={styles.rightContent}>
          <BasicInfoForm />
          <SecuritySettingsForm />
        </div>
      </div>
    </div>
  );
};

export default UserProfileModule;
