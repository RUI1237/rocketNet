import React from "react";
import { Form, Input, Button } from "antd";
import { ApiOutlined, MailOutlined, LockOutlined, UserAddOutlined } from "@ant-design/icons";
import styles from "@/styles/AuthForms/AuthForms.module.scss";

// 1. 更新 props 接口，增加 onLoginSuccess
interface LoginFormProps {
  onSwitchToRegister: () => void;
  onLoginSuccess: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSwitchToRegister, onLoginSuccess }) => {
  // 2. 在 onFinish 函数中处理登录逻辑
  const onFinish = (values: any) => {
    console.log("Login Submitted:", values);

    // 在这里，您通常会调用 API 与后端进行验证
    // 我们在这里模拟一个成功的登录

    // 3. 调用从父组件传来的 onLoginSuccess 函数
    // 这个调用会通知 App.tsx 更新 isLoggedIn 状态，从而触发路由跳转
    onLoginSuccess();
  };

  return (
    <div className={styles.formWrapper}>
      <div className={styles.formHeader}>
        <ApiOutlined className={styles.headerIcon} />
        <h2>系统访问授权</h2>
        <p>请输入您的凭证以继续</p>
      </div>

      <Form name="login" onFinish={onFinish} autoComplete="off">
        <Form.Item
          name="email"
          rules={[
            { required: true, message: "请输入您的电子邮件!" },
            { type: "email", message: "请输入有效的电子邮件地址!" },
          ]}
        >
          <Input prefix={<MailOutlined />} placeholder="电子邮件" size="large" />
        </Form.Item>

        <Form.Item name="password" rules={[{ required: true, message: "请输入您的密码!" }]}>
          <Input.Password prefix={<LockOutlined />} placeholder="密码" size="large" />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className={styles.submitButton}
            onClick={onLoginSuccess}
          >
            授 权 访 问
          </Button>
        </Form.Item>
      </Form>

      <div className={styles.formFooter}>
        <a onClick={onSwitchToRegister}>
          <UserAddOutlined />
          <span>没有账户？立即创建</span>
        </a>
      </div>
    </div>
  );
};

export default LoginForm;
