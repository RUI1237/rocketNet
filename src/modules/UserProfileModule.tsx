import React, { useState } from "react";
import { Avatar, Button, Card, Col, Row, Descriptions, Form, Input, message, Upload } from "antd";
import type { UploadProps } from "antd";
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  EditOutlined,
  SaveOutlined,
  KeyOutlined,
  CameraOutlined,
} from "@ant-design/icons";
import commonStyles from "@/styles/Modules.module.scss";

import profileStyles from "./UserProfile.module.scss"; // 新的、独立的样式
import { useAuthStore } from "@/stores";

// // 模拟当前登录的用户数据
// const currentUser = {
//   username: "Admin",
//   email: "admin@gemini-systems.io",
//   phone: "138-0013-8000",
//   // 假设用户还没有头像
//   avatar: "",
//   role: "系统管理员",
//   registrationDate: "2025-01-15",
// };

const UserProfileModule: React.FC = () => {
  const [form] = Form.useForm();
  // 1. 创建 state 来管理头像 URL
  // const [imageUrl, setImageUrl] = useState<string>(currentUser.avatar);

  const currentUser = useAuthStore((state) => state.user)!;
  const updateUser = useAuthStore((state) => state.updateUser);

  // 2. 定义上传前的处理逻辑
  const beforeUpload = (file: File) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("您只能上传 JPG/PNG 格式的图片!");
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("图片大小必须小于 2MB!");
    }

    // 如果校验通过，则使用 FileReader 生成 Base64 预览
    if (isJpgOrPng && isLt2M) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        // setImageUrl(reader.result as string);
        updateUser({ avatar: reader.result as string });
        message.success("头像已更新，点击保存以生效！");
      };
    }

    return false; // 返回 false, 阻止 antd 的自动上传行为
  };

  // 3. 定义 Upload 组件的 props
  const uploadProps: UploadProps = {
    name: "avatar",
    showUploadList: false, // 不显示默认的文件列表
    beforeUpload: beforeUpload,
  };

  const onFinishInfo = (values: any) => {
    // 在实际应用中，这里会把 imageUrl 和表单数据一起提交
    console.log("更新基本信息:", { ...values });
    updateUser(values);
    message.success("基本信息更新成功！");
  };

  const onFinishPassword = (values: any) => {
    console.log("更新基本信息:", { ...values });
    if (values.currentPassword === currentUser.password) {
      updateUser({ password: values.newPassword });
      message.success("基本信息更新成功！");
    } else {
    }
  };

  return (
    <div className={commonStyles.moduleContainer} style={{ height: "100%" }}>
      <h2
        style={{
          padding: "1.5rem 2rem",
          margin: 0,
          borderBottom: "1px solid rgba(0, 221, 255, 0.3)",
        }}
      >
        个人中心
      </h2>
      <div className={`${commonStyles.scrollableContent}`} style={{ padding: "2rem" }}>
        <Row gutter={[32, 32]}>
          {/* 左侧：用户信息展示 */}
          <Col xs={24} lg={8}>
            <Card
              // bordered={false}
              style={{ background: "rgba(29, 16, 63, 0.6)", textAlign: "center" }}
            >
              {/* 4. 将 Avatar 包裹在 Upload 组件中 */}
              <div className={profileStyles.avatarUploader}>
                <Upload {...uploadProps}>
                  <Avatar
                    size={128}
                    icon={<UserOutlined />}
                    src={currentUser?.avatar}
                    className={profileStyles.avatarImage}
                  />
                  <div className={profileStyles.uploadOverlay}>
                    <CameraOutlined />
                  </div>
                </Upload>
              </div>

              <h3 style={{ color: "#fff", fontSize: "1.5rem" }}>{currentUser.username}</h3>
              {/* <p style={{ color: "#8b8a95" }}>{currentUser.role}</p> */}
            </Card>
            <Card
              // bordered={false}
              title="账户详情"
              style={{ background: "rgba(29, 16, 63, 0.6)", marginTop: 24 }}
              // headStyle={{ borderBottom: "1px solid rgba(0, 221, 255, 0.2)" }}
            >
              <Descriptions column={1}>
                <Descriptions.Item
                  label={
                    <>
                      <MailOutlined /> 邮箱
                    </>
                  }
                >
                  {currentUser.email}
                </Descriptions.Item>
                <Descriptions.Item
                  label={
                    <>
                      <PhoneOutlined /> 手机
                    </>
                  }
                >
                  {currentUser.phone}
                </Descriptions.Item>
                <Descriptions.Item label="注册日期">
                  {currentUser.registrationDate}
                </Descriptions.Item>
              </Descriptions>
            </Card>
          </Col>

          {/* 右侧：信息修改表单 */}
          <Col xs={24} lg={16}>
            <Card
              // bordered={false}
              title="修改基本信息"
              style={{ background: "rgba(29, 16, 63, 0.6)" }}
              // headStyle={{ borderBottom: "1px solid rgba(0, 221, 255, 0.2)" }}
            >
              <Form
                layout="vertical"
                initialValues={{
                  username: currentUser.username,
                  email: currentUser.email,
                  phone: currentUser.phone,
                }}
                onFinish={onFinishInfo}
              >
                <Form.Item name="username" label="用户名" rules={[{ required: true }]}>
                  <Input prefix={<UserOutlined />} />
                </Form.Item>
                <Form.Item
                  name="email"
                  label="电子邮箱"
                  rules={[{ required: true, type: "email" }]}
                >
                  <Input prefix={<MailOutlined />} />
                </Form.Item>
                <Form.Item name="phone" label="手机号码">
                  <Input prefix={<PhoneOutlined />} />
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>
                    保存更改
                  </Button>
                </Form.Item>
              </Form>
            </Card>

            <Card
              // bordered={false}
              title="修改密码"
              style={{ background: "rgba(29, 16, 63, 0.6)", marginTop: 24 }}
              // headStyle={{ borderBottom: "1px solid rgba(0, 221, 255, 0.2)" }}
            >
              <Form form={form} layout="vertical" onFinish={onFinishPassword}>
                <Form.Item
                  name="currentPassword"
                  label="旧密码"
                  rules={[
                    { required: true },
                    ({ getFieldValue }) => ({
                      // 它返回一个对象，这个对象就是一条校验规则
                      validator(_, value) {
                        if (value && currentUser.password !== value)
                          return Promise.reject(new Error("不是旧密码!"));
                        else return Promise.resolve();
                      },
                    }),
                  ]}
                >
                  <Input.Password prefix={<KeyOutlined />} />
                </Form.Item>
                <Form.Item
                  name="newPassword"
                  label="新密码"
                  rules={[
                    { required: true },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (value && currentUser.password === value) {
                          return Promise.reject(new Error("新密码不能和旧密码相同!"));
                        } else return Promise.resolve();
                      },
                    }),
                  ]}
                >
                  <Input.Password prefix={<KeyOutlined />} />
                </Form.Item>
                <Form.Item
                  name="confirmPassword"
                  label="确认新密码"
                  dependencies={["newPassword"]}
                  rules={[
                    { required: true },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (value && getFieldValue("newPassword") !== value)
                          return Promise.reject(new Error("两次输入的密码不匹配!"));
                        else if (value && currentUser.password === value) {
                          return Promise.reject(new Error("新密码不能和旧密码相同!"));
                        } else return Promise.resolve();
                      },
                    }),
                  ]}
                >
                  <Input.Password prefix={<KeyOutlined />} />
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit" icon={<EditOutlined />} danger>
                    更新密码
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default UserProfileModule;
