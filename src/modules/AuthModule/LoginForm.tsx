import React from "react";
import { Form, Input, Button } from "antd";
import { ApiOutlined, UserOutlined, LockOutlined, UserAddOutlined } from "@ant-design/icons";
import styles from "@/styles/AuthForms.module.scss";
import { useAuthStore } from "@/stores";

interface LoginFormProps {
  onSwitchToRegister: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSwitchToRegister }) => {
  const [form] = Form.useForm();

  const onLoginSuccess = useAuthStore((state) => state.login);

  const onFinish = async (values: any) => {
    console.log("表单提交的数据: ", values);

    try {
      const res = await onLoginSuccess(values);

      if (res === "密码错误") {
        form.setFields([
          {
            name: "password", // 对应 Form.Item 的 name
            errors: ["密码错误，请检查后重试"], // 显示的红色错误文字
          },
        ]);
      } else if (res === "没有注册该用户") {
        form.setFields([
          {
            name: "username", // 对应 Form.Item 的 name
            errors: ["该用户未注册"], // 显示的红色错误文字
          },
        ]);
      } else {
        console.log("登录成功或未知状态");
      }
    } catch (error) {
      console.error("登录过程发生意外错误:", error);
    }
  };

  return (
    <div className={styles.formWrapper}>
      <div className={styles.formHeader}>
        <ApiOutlined className={styles.headerIcon} />
        <h2>系统访问授权</h2>
        <p>请输入您的凭证以继续</p>
      </div>

      <Form form={form} name="login" onFinish={onFinish} autoComplete="off">
        <Form.Item name="username" rules={[{ required: true, message: "请输入您的用户名!" }]}>
          {/* onChange 时自动清除错误提示，提升体验 */}
          <Input
            prefix={<UserOutlined />}
            placeholder="用户名"
            size="large"
            onChange={() => form.setFields([{ name: "username", errors: [] }])}
          />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[
            { required: true, message: "请输入您的密码!" },
            { min: 6, message: "密码长度至少为 6 位" },
            { pattern: /^(?=.*[a-zA-Z])(?=.*\d).+$/, message: "密码需同时包含字母和数字" },
          ]}
          hasFeedback
        >
          {/* onChange 时自动清除错误提示 */}
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="密码"
            size="large"
            onChange={() => form.setFields([{ name: "password", errors: [] }])}
          />
        </Form.Item>

        <Form.Item>
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
