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

const UserInfoSidebar: React.FC<UserInfoSidebarProps> = () => {
  // const user = useAuthStore((state) => state.user)!;
  const { user, reSetInf, getInf } = useAuthStore((state) => state);

  const handleAvatarUpload = async (file: File) => {
    // console.log("都会受到噶");
    // await reSetInf({ ...user!, avatar: file });
    // await getInf();
    // const reader = new FileReader()!;
    // reader.readAsDataURL(file);
    // reader.onload = async () => {

    await reSetInf({ ...user!, avatar: file });

    await getInf();
    console.log("userinf", user);
    console.log("头像更新成功");
    // };
    // return false; // 阻止自动上传，仅做前端预览演示
  };
  return (
    <div className={styles.leftSidebar}>
      <div className={styles.avatarUploader}>
        <Upload showUploadList={false} beforeUpload={handleAvatarUpload}>
          <div style={{ width: "100%", height: "100%", position: "relative" }}>
            <div className={styles.uploadOverlay}>
              <CameraOutlined />
            </div>
            <Avatar
              src={user!.avatarUrl || undefined}
              icon={!user!.avatarUrl && <UserOutlined style={{ fontSize: 70 }} />}
              className={styles.avatarIcon}
            />
          </div>
        </Upload>
      </div>

      <div className={styles.userInfo}>
        <h2>{user!.username}</h2>
      </div>

      <div className={styles.infoList}>
        <div className={styles.infoItem}>
          <span className={styles.label}>
            <NumberOutlined /> 员工邮箱
          </span>
          <span className={styles.value}>{user!.email}</span>
        </div>
        {/* <div className={styles.infoItem}>
          <span className={styles.label}>
            <ApartmentOutlined /> 联系方式
          </span>
          <span className={styles.value}>{user!.phone}</span>
        </div> */}
        <div className={styles.infoItem}>
          <span className={styles.label}>
            <CalendarOutlined /> 注册日期
          </span>
          <span className={styles.value}>{user!.registrationDate}</span>
        </div>
      </div>
    </div>
  );
};

export default UserInfoSidebar;
