import React from "react";
import { Form, Input, Button, type FormProps, Modal } from "antd";
import { ApiOutlined, UserOutlined, MailOutlined, LockOutlined } from "@ant-design/icons";
import styles from "../styles/AuthForms.module.scss";
import { authService } from "../services/auth.service";
import { getErrorMessage } from "@/shared/utils/getErrorMessage";
import type { User } from "../types/auth.types";

interface RegistrationFormProps {
  onSwitchToLogin: () => void;
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({ onSwitchToLogin }) => {
  const [modal, contextHolder] = Modal.useModal();

  const handleRegistration: FormProps<User>["onFinish"] = async (values) => {
    console.log("正在提交:", values);

    try {
      const res = await authService.register(values);

      modal.success({
        className: "theme-modal",
        title: "注册成功",
        content: res.msg,
        centered: true,
        okText: "前往登录",
        onOk: () => {
          onSwitchToLogin();
        },
      });

      return res;
    } catch (error) {
      modal.error({
        className: "theme-modal",
        centered: true,
        title: "注册失败",
        content: getErrorMessage(error),
      });
    }
  };

  const handleRegistrationFailed: FormProps<User>["onFinishFailed"] = (errorInfo) => {
    console.log("Validation Failed:", errorInfo);
  };

  return (
    <div className={styles.formWrapper}>
      <div className={styles.formHeader}>
        <ApiOutlined className={styles.headerIcon} />
        <h2>创建新的凭证</h2>
        <p>欢迎加入，请填写注册信息</p>
      </div>

      <Form
        name="register"
        onFinish={handleRegistration}
        onFinishFailed={handleRegistrationFailed}
        autoComplete="off"
        layout="vertical"
      >
        <Form.Item
          label="用户名"
          name="username"
          rules={[{ required: true, message: "请输入您的用户名!", whitespace: true }]}
        >
          <Input prefix={<UserOutlined />} placeholder="请输入用户名" size="large" />
        </Form.Item>

        <Form.Item
          label="密码"
          name="password"
          rules={[
            { required: true, message: "请输入您的密码!" },
            { min: 6, message: "密码长度至少为 6 位" },
            { pattern: /^(?=.*[a-zA-Z])(?=.*\d).+$/, message: "密码需同时包含字母和数字" },
          ]}
          hasFeedback
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="请输入密码（至少6位，包含字母数字）"
            size="large"
          />
        </Form.Item>

        <Form.Item
          label="确认密码"
          name="confirm"
          dependencies={["password"]}
          hasFeedback
          rules={[
            { required: true, message: "请确认您的密码!" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error("两次输入的密码不匹配!"));
              },
            }),
          ]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder="请再次输入密码" size="large" />
        </Form.Item>

        <Form.Item
          label="电子邮箱"
          name="email"
          rules={[{ type: "email", message: "请输入有效的电子邮件地址!" }]}
        >
          <Input prefix={<MailOutlined />} placeholder="请输入电子邮箱" size="large" />
        </Form.Item>

        <Form.Item>
          {contextHolder}
          <Button type="primary" htmlType="submit" className={styles.submitButton} size="large">
            注 册 账 户
          </Button>
        </Form.Item>
      </Form>

      <div className={styles.formFooter}>
        <a onClick={onSwitchToLogin}>
          <UserOutlined />
          <span>已有账户？前往登录</span>
        </a>
      </div>
    </div>
  );
};

export default RegistrationForm;
