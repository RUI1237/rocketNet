import React from "react";
// 1. 【修改】引入 Modal 组件
import { Form, Input, Button, type FormProps, Modal } from "antd";
import { ApiOutlined, UserOutlined, MailOutlined, LockOutlined } from "@ant-design/icons";
import styles from "@/styles/AuthForms.module.scss";
import type { User } from "@/stores";
import { logService } from "@/services";

interface RegistrationFormProps {
  onSwitchToLogin: () => void;
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({ onSwitchToLogin }) => {
  // 2. 【修改】handleRegistration 逻辑
  const [modal, contextHolder] = Modal.useModal();

  const handleRegistration: FormProps<User>["onFinish"] = async (values) => {
    console.log("正在提交:", values);

    try {
      // 调用接口获取结果
      const res = await logService.register(values);

      // 3. 【核心】使用 Modal.success (或 info) 弹出结果
      // console.log("sgdhs");
      // onSwitchToLogin();
      modal.success({
        className: "theme-modal",
        title: "注册成功",
        // 这里判断一下 res 的类型，如果是对象就转字符串，如果是字符串直接显示
        content: res.msg,
        centered: true,

        okText: "前往登录", // 修改按钮文字
        // 4. 【交互优化】只有当用户点击了“前往登录”按钮后，才切换页面
        onOk: () => {
          // onSwitchToLogin();
        },
      });

      return res;
    } catch (error) {
      // 如果请求失败（且拦截器没有完全拦截住），可以在这里弹窗提示
      // console.log("sgdhdsudsdgs");
      modal.error({
        className: "theme-modal",
        centered: true,

        title: "注册失败",
        content: "请检查您的网络或稍后重试",
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
          rules={[{ required: true, message: "请输入您的密码!" }]}
          hasFeedback
        >
          <Input.Password prefix={<LockOutlined />} placeholder="请输入密码" size="large" />
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
