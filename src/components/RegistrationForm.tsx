import React from "react";
// 1. 从 antd 引入 Form 的类型定义
import { Form, Input, Button, type FormProps } from "antd";
import { ApiOutlined, UserOutlined, MailOutlined, LockOutlined } from "@ant-design/icons";
import styles from "@/styles/AuthForms/AuthForms.module.scss";

// 2. 定义表单字段的 TypeScript 类型接口
// 这为我们的表单数据提供了完整的类型安全
interface RegistrationFormValues {
  username: string;
  email: string;
  password?: string; // password 和 confirm 在提交时通常不需要再次传递，设为可选
  confirm?: string;
}

// 定义组件的 props 接口
interface RegistrationFormProps {
  onSwitchToLogin: () => void;
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({ onSwitchToLogin }) => {
  // --- 逻辑分离 ---
  // 3. 将 onFinish 控制逻辑提取到组件函数体中
  //    并使用 antd 提供的 FormProps['onFinish'] 类型来约束它
  const handleRegistration: FormProps<RegistrationFormValues>["onFinish"] = (values) => {
    // 这里的 `values` 对象现在是强类型的，
    // 你可以安全地访问 values.username, values.email 等，并获得IDE的智能提示
    console.log("Registration Submitted:", values);

    // 在这里执行异步API调用，例如：
    // try {
    //   const response = await api.register(values);
    //   message.success('注册成功！');
    //   onSwitchToLogin(); // 注册成功后自动切换到登录
    // } catch (error) {
    //   message.error('注册失败，请稍后再试。');
    // }
  };

  const handleRegistrationFailed: FormProps<RegistrationFormValues>["onFinishFailed"] = (
    errorInfo
  ) => {
    console.log("Validation Failed:", errorInfo);
    // 在这里可以处理校验失败的逻辑，例如上报日志
  };
  // --- 逻辑分离结束 ---

  // --- 视图 (JSX) ---
  // 现在的 JSX 非常纯粹，只负责渲染
  return (
    <div className={styles.formWrapper}>
      <div className={styles.formHeader}>
        <ApiOutlined className={styles.headerIcon} />
        <h2>创建新的凭证</h2>
        <p>欢迎加入，请填写注册信息</p>
      </div>

      <Form
        name="register"
        // 4. 在 JSX 中直接引用我们定义的逻辑函数
        onFinish={handleRegistration}
        onFinishFailed={handleRegistrationFailed}
        autoComplete="off"
        layout="vertical" // 使用 vertical 布局，label 在输入框上方，更清晰
      >
        <Form.Item
          label="用户名" // 推荐为 Form.Item 添加 label，增强可访问性
          name="username"
          rules={[{ required: true, message: "请输入您的用户名!", whitespace: true }]}
        >
          <Input prefix={<UserOutlined />} placeholder="请输入用户名" size="large" />
        </Form.Item>

        <Form.Item
          label="电子邮箱"
          name="email"
          rules={[
            { required: true, message: "请输入您的电子邮件!" },
            { type: "email", message: "请输入有效的电子邮件地址!" },
          ]}
        >
          <Input prefix={<MailOutlined />} placeholder="请输入电子邮箱" size="large" />
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
            // 5. 校验逻辑 (validator) 仍然保留在 JSX 中是合理的，
            //    因为它与 UI 结构紧密耦合。当然，也可以将其提取为独立的函数。
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

        <Form.Item>
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
