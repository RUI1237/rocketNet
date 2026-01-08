import React, { Suspense } from "react";
import { useLoaderData, Await, useRevalidator } from "react-router-dom";
import { Spin } from "antd";
import styles from "../styles/UserProfile.module.scss";
import UserInfoSidebar from "./UserInfoSidebar";
import BasicInfoForm from "./BasicInfoForm";
import SecuritySettingsForm from "./SecuritySettingsForm";
import type { User } from "@/features/auth/types/auth.types";
import type { profileLoader } from "../loader/profileLoader";

const SectionLoading = () => (
  <div style={{ padding: 50, display: "flex", justifyContent: "center", alignItems: "center" }}>
    <Spin tip="加载用户信息...">
      <div style={{ padding: 50, background: "transparent" }} />
    </Spin>
  </div>
);

const UserProfileModule: React.FC = () => {
  const { userInfo } = useLoaderData() as ReturnType<typeof profileLoader>;
  const revalidator = useRevalidator();

  const handleRefresh = () => {
    revalidator.revalidate();
  };

  const renderContent = (user: User | null) => {
    if (!user) {
      return <div className={styles.emptyState}>用户信息加载失败</div>;
    }

    return (
      <div className={styles.layoutGrid}>
        <UserInfoSidebar user={user} onRefresh={handleRefresh} />
        <div className={styles.rightContent}>
          <BasicInfoForm user={user} onRefresh={handleRefresh} />
          <SecuritySettingsForm user={user} />
        </div>
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <Suspense fallback={<SectionLoading />}>
        <Await resolve={userInfo} errorElement={<div>加载失败</div>}>
          {(user) => renderContent(user)}
        </Await>
      </Suspense>
    </div>
  );
};

export default UserProfileModule;
