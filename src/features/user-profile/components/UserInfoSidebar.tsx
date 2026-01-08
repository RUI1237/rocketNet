import React, { useState } from "react";
import { Avatar, Upload, message, Spin } from "antd";
import { UserOutlined, CameraOutlined, NumberOutlined, CalendarOutlined } from "@ant-design/icons";
import styles from "../styles/UserProfile.module.scss";
import { profileService } from "../services/profile.service";
import type { User } from "@/features/auth/types/auth.types";

interface UserInfoSidebarProps {
  user: User;
  onRefresh: () => void;
}

const UserInfoSidebar: React.FC<UserInfoSidebarProps> = ({ user, onRefresh }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [localAvatarUrl, setLocalAvatarUrl] = useState<string | null>(null);

  const handleAvatarUpload = async (file: File) => {
    // 验证文件类型
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      message.error("只能上传图片文件");
      return false;
    }

    // 验证文件大小 (2MB)
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("图片大小不能超过 2MB");
      return false;
    }

    setIsUploading(true);
    try {
      await profileService.uploadAvatar(user.username, user.token, file);

      // 本地预览
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        setLocalAvatarUrl(reader.result as string);
      };

      message.success("头像上传成功");
      onRefresh();
    } catch (error) {
      message.error("头像上传失败，请稍后重试");
    } finally {
      setIsUploading(false);
    }

    return false; // 阻止默认上传行为
  };

  const displayAvatarUrl = localAvatarUrl || user.avatarUrl;

  return (
    <div className={styles.leftSidebar}>
      <div className={styles.avatarUploader}>
        <Upload showUploadList={false} beforeUpload={handleAvatarUpload} disabled={isUploading}>
          <div style={{ width: "100%", height: "100%", position: "relative" }}>
            <div className={styles.uploadOverlay}>
              {isUploading ? <Spin /> : <CameraOutlined />}
            </div>
            <Avatar
              src={displayAvatarUrl || undefined}
              icon={!displayAvatarUrl && <UserOutlined style={{ fontSize: 70 }} />}
              className={styles.avatarIcon}
            />
          </div>
        </Upload>
      </div>

      <div className={styles.userInfo}>
        <h2>{user.username || "未登录"}</h2>
      </div>

      <div className={styles.infoList}>
        <div className={styles.infoItem}>
          <span className={styles.label}>
            <NumberOutlined /> 员工邮箱
          </span>
          <span className={styles.value}>{user.email || "-"}</span>
        </div>
        <div className={styles.infoItem}>
          <span className={styles.label}>
            <CalendarOutlined /> 注册日期
          </span>
          <span className={styles.value}>{user.registrationDate || "-"}</span>
        </div>
      </div>
    </div>
  );
};

export default UserInfoSidebar;
