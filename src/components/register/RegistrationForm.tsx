import React from "react";
import { Form, Input, Button } from "antd";
import { ApiOutlined, UserOutlined, MailOutlined, LockOutlined } from "@ant-design/icons";
import styles from "@/styles/AuthForms/AuthForms.module.scss";

interface RegistrationFormProps {
  onSwitchToLogin: () => void;
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({ onSwitchToLogin }) => {
  const onFinish = (values: any) => {
    console.log("Registration Submitted:", values);
  };

  return (
    <div className={styles.formWrapper}>
      <div className={styles.formHeader}>
        <ApiOutlined className={styles.headerIcon} />
        <h2>创建新的凭证</h2>
        <p>欢迎加入，请填写注册信息</p>
      </div>

      <Form name="register" onFinish={onFinish} autoComplete="off">
        <Form.Item
          name="username"
          rules={[{ required: true, message: "请输入您的用户名!", whitespace: true }]}
        >
          <Input prefix={<UserOutlined />} placeholder="用户名" size="large" />
        </Form.Item>

        <Form.Item
          name="email"
          rules={[
            { required: true, message: "请输入您的电子邮件!" },
            { type: "email", message: "请输入有效的电子邮件地址!" },
          ]}
        >
          <Input prefix={<MailOutlined />} placeholder="电子邮件" size="large" />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[{ required: true, message: "请输入您的密码!" }]}
          hasFeedback
        >
          <Input.Password prefix={<LockOutlined />} placeholder="密码" size="large" />
        </Form.Item>

        <Form.Item
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
          <Input.Password prefix={<LockOutlined />} placeholder="确认密码" size="large" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" className={styles.submitButton}>
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
