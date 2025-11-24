import React, { useState } from "react";
import { Avatar, Button, Col, Row, Form, Input, message, Upload } from "antd";
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  SafetyCertificateOutlined,
  IdcardOutlined,
  LockOutlined,
  KeyOutlined,
  CheckCircleOutlined,
  RocketOutlined,
  CalendarOutlined,
  ApartmentOutlined,
  NumberOutlined,
  CameraOutlined,
} from "@ant-design/icons";

// 引入样式
import styles from "@/styles/UserProfile.module.scss";

const UserProfileModule: React.FC = () => {
  const [passForm] = Form.useForm();

  const [user, setUser] = useState({
    username: "System_Admin",
    email: "admin@nebula.io",
    phone: "138-8888-9999",
    avatar: "", // 默认无头像
    userId: "A-001",
    department: "指挥中心",
    joinDate: "2024-05-01",
  });

  const handleAvatarUpload = (file: File) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setUser((prev) => ({ ...prev, avatar: reader.result as string }));
      message.success("头像更新成功");
    };
    return false;
  };

  const onUpdateInfo = () => {
    message.success("基本资料已同步");
  };

  const onResetPass = () => {
    message.success("密码修改指令已下发");
    passForm.resetFields();
  };

  return (
    <div className={styles.container}>
      <div className={styles.layoutGrid}>
        {/* --- 左侧：固定展示区 --- */}
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
              <span className={styles.value}>{user.userId}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.label}>
                <ApartmentOutlined /> 所属部门
              </span>
              <span className={styles.value}>{user.department}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.label}>
                <CalendarOutlined /> 入职日期
              </span>
              <span className={styles.value}>{user.joinDate}</span>
            </div>
          </div>
        </div>

        {/* --- 右侧：输入交互区 --- */}
        <div className={styles.rightContent}>
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <IdcardOutlined />
              <h3>基本资料配置</h3>
            </div>

            <Form
              layout="vertical"
              initialValues={user}
              className={styles.bigForm}
              onFinish={onUpdateInfo}
            >
              <Row gutter={40}>
                <Col span={12}>
                  <Form.Item name="username" label="用户昵称">
                    <Input prefix={<UserOutlined />} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="phone" label="联系电话">
                    <Input prefix={<PhoneOutlined />} />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item
                    name="email"
                    label="电子邮箱"
                    rules={[{ type: "email", message: "格式不正确" }]}
                  >
                    <Input prefix={<MailOutlined />} />
                  </Form.Item>
                </Col>
              </Row>

              <div style={{ marginTop: "auto", textAlign: "right" }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={<RocketOutlined />}
                  style={{ minWidth: 160 }}
                >
                  保存更改
                </Button>
              </div>
            </Form>
          </div>

          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <SafetyCertificateOutlined style={{ color: "#d946ef" }} />
              <h3>账户安全</h3>
            </div>

            <Form
              form={passForm}
              layout="vertical"
              className={styles.bigForm}
              onFinish={onResetPass}
            >
              <Row gutter={40}>
                <Col span={24}>
                  <Form.Item name="oldPassword" label="验证旧密码" rules={[{ required: true }]}>
                    <Input.Password prefix={<LockOutlined />} placeholder="请输入旧密码" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="newPassword" label="新密码" rules={[{ required: true }]}>
                    <Input.Password prefix={<KeyOutlined />} placeholder="设置新密码" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="confirmPassword"
                    label="确认密码"
                    dependencies={["newPassword"]}
                    rules={[
                      { required: true },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value || getFieldValue("newPassword") === value)
                            return Promise.resolve();
                          return Promise.reject(new Error("密码不一致"));
                        },
                      }),
                    ]}
                  >
                    <Input.Password prefix={<CheckCircleOutlined />} placeholder="再次确认" />
                  </Form.Item>
                </Col>
              </Row>

              <div style={{ marginTop: "auto", textAlign: "right" }}>
                <Button
                  type="primary"
                  danger
                  htmlType="submit"
                  icon={<KeyOutlined />}
                  style={{ minWidth: 160 }}
                >
                  重置密码
                </Button>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileModule;
