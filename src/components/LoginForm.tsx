import React from "react";
import { Form, Input, Button } from "antd";
import { ApiOutlined, UserOutlined, LockOutlined, UserAddOutlined } from "@ant-design/icons";
import styles from "@/styles/AuthForms/AuthForms.module.scss";
import { useAuthStore } from "@/stores";

interface LoginFormProps {
  onSwitchToRegister: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSwitchToRegister }) => {
  // 1. 【新增】创建表单实例，用于后续手动设置错误
  const [form] = Form.useForm();

  const onLoginSuccess = useAuthStore((state) => state.login);

  // 2. 【修改】加上 async 关键字，因为我们需要等待 onLoginSuccess 的结果
  const onFinish = async (values: any) => {
    console.log("表单提交的数据: ", values);

    try {
      // 3. 【关键】使用 await 拆包 Promise，拿到真正的字符串结果
      const res = await onLoginSuccess(values);

      // 4. 【核心逻辑】根据返回的字符串，手动设置表单字段的错误
      if (res === "密码错误") {
        // 在 'password' 字段下显示错误
        form.setFields([
          {
            name: "password", // 对应 Form.Item 的 name
            errors: ["密码错误，请检查后重试"], // 显示的红色错误文字
          },
        ]);
      } else if (res === "没有注册该用户") {
        // 在 'username' 字段下显示错误
        form.setFields([
          {
            name: "username", // 对应 Form.Item 的 name
            errors: ["该用户未注册"], // 显示的红色错误文字
          },
        ]);
      } else {
        // 登录成功或其他情况，这里可以不处理，或者跳转页面
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

      {/* 5. 【绑定】将 form 实例绑定到 Form 组件上 */}
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

        <Form.Item name="password" rules={[{ required: true, message: "请输入您的密码!" }]}>
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
