import React from "react";
import { Form, Input, Button, Modal } from "antd";
import { ApiOutlined, UserOutlined, LockOutlined, UserAddOutlined } from "@ant-design/icons";
import styles from "../styles/AuthForms.module.scss";
import { useAuthStore } from "../stores/authStore";
import { getErrorMessage } from "@/shared/utils/getErrorMessage";

interface LoginFormProps {
  onSwitchToRegister: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSwitchToRegister }) => {
  const [form] = Form.useForm();
  const [modal, contextHolder] = Modal.useModal();

  const onLoginSuccess = useAuthStore((state) => state.login);

  const onFinish = async (values: any) => {
    console.log("表单提交的数据: ", values);

    try {
      await onLoginSuccess(values);
    } catch (error) {
      modal.warning({
        className: "theme-modal",
        centered: true,
        title: "登录失败",
        content: getErrorMessage(error),
      });
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
          <Input prefix={<UserOutlined />} placeholder="用户名" size="large" />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[{ required: true, message: "请输入您的密码!" }]}
          hasFeedback
        >
          <Input.Password prefix={<LockOutlined />} placeholder="密码" size="large" />
        </Form.Item>

        <Form.Item>
          {contextHolder}
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
