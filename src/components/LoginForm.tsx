import React from "react";
import { Form, Input, Button } from "antd";
import {
  ApiOutlined,
  UserOutlined, // 引入 UserOutlined 图标
  LockOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import styles from "@/styles/AuthForms/AuthForms.module.scss";
import { useAuthStore } from "@/stores";

// props 接口保持不变
interface LoginFormProps {
  onSwitchToRegister: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSwitchToRegister }) => {
  const onLoginSuccess = useAuthStore((state) => state.login);

  // 2. onFinish 函数现在会接收到包含所有表单数据的 values 对象
  const onFinish = (values: any) => {
    // 'values' 对象包含了表单数据, 例如: { username: "your_username", password: "your_password" }
    console.log("表单提交的数据: ", values);

    // 在这里，您通常会使用用户名和密码调用 API 进行后端验证
    // 我们在这里模拟一个成功的登录
    // const user = { username: values.username, password: values.password /* 其他用户数据 */ };

    // 3. 使用从表单提取的用户数据调用 onLoginSuccess 函数
    onLoginSuccess(values);
  };

  return (
    <div className={styles.formWrapper}>
      <div className={styles.formHeader}>
        <ApiOutlined className={styles.headerIcon} />
        <h2>系统访问授权</h2>
        <p>请输入您的凭证以继续</p>
      </div>

      {/* 将 onFinish 回调函数添加到 Form 组件上 */}
      <Form name="login" onFinish={onFinish} autoComplete="off">
        {/* 从 email 改为 username */}
        <Form.Item name="username" rules={[{ required: true, message: "请输入您的用户名!" }]}>
          <Input
            prefix={<UserOutlined />} // 更改了图标
            placeholder="用户名"
            size="large"
          />
        </Form.Item>

        <Form.Item name="password" rules={[{ required: true, message: "请输入您的密码!" }]}>
          <Input.Password prefix={<LockOutlined />} placeholder="密码" size="large" />
        </Form.Item>

        <Form.Item>
          {/* 移除了 onClick，htmlType="submit" 会自动触发表单的 onFinish 事件 */}
          <Button type="primary" htmlType="submit" className={styles.submitButton}>
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
