import React from "react";
import { Avatar, Upload } from "antd";
import {
  UserOutlined,
  CameraOutlined,
  NumberOutlined,
  ApartmentOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import styles from "@/styles/UserProfile.module.scss";
import { useAuthStore } from "@/stores";

interface UserInfoSidebarProps {
  // user: User;
  // onAvatarUpload: (file: File) => boolean;
}
const { updateUser } = useAuthStore((state) => state);

const handleAvatarUpload = async (file: File) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = async () => {
    await updateUser({ avatar: reader.result as string });
    console.log("头像更新成功");
  };
  return false; // 阻止自动上传，仅做前端预览演示
};
const UserInfoSidebar: React.FC<UserInfoSidebarProps> = () => {
  const user = useAuthStore((state) => state.user)!;
  return (
    <div className={styles.leftSidebar}>
      <div className={styles.avatarUploader}>
        <Upload showUploadList={false} beforeUpload={handleAvatarUpload}>
          <div style={{ width: "100%", height: "100%", position: "relative" }}>
            <div className={styles.uploadOverlay}>
              <CameraOutlined />
            </div>
            <Avatar
              src={user.avatar || undefined}
              icon={!user.avatar && <UserOutlined style={{ fontSize: 70 }} />}
              className={styles.avatarIcon}
            />
          </div>
        </Upload>
      </div>

      <div className={styles.userInfo}>
        <h2>{user.username}</h2>
      </div>

      <div className={styles.infoList}>
        <div className={styles.infoItem}>
          <span className={styles.label}>
            <NumberOutlined /> 员工编号
          </span>
          <span className={styles.value}>{user.email}</span>
        </div>
        <div className={styles.infoItem}>
          <span className={styles.label}>
            <ApartmentOutlined /> 所属部门
          </span>
          <span className={styles.value}>{user.phone}</span>
        </div>
        <div className={styles.infoItem}>
          <span className={styles.label}>
            <CalendarOutlined /> 入职日期
          </span>
          <span className={styles.value}>{user.registrationDate}</span>
        </div>
      </div>
    </div>
  );
};

export default UserInfoSidebar;
