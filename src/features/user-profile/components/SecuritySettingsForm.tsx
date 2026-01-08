import React, { useState } from "react";
import { Button, Col, Row, Form, Input, Modal } from "antd";
import {
  SafetyCertificateOutlined,
  LockOutlined,
  KeyOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import styles from "../styles/UserProfile.module.scss";
import { useAuthStore } from "@/features/auth";
import { profileService } from "../services/profile.service";
import type { User } from "@/features/auth/types/auth.types";

interface SecuritySettingsFormProps {
  user: User;
}

const SecuritySettingsForm: React.FC<SecuritySettingsFormProps> = ({ user }) => {
  const [form] = Form.useForm();
  const [modal, contextHolder] = Modal.useModal();
  const { logout } = useAuthStore((state) => state);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (values: {
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
  }) => {
    // 二次确认
    modal.confirm({
      className: "theme-modal",
      centered: true,
      title: "确认修改密码",
      content: "修改密码后需要重新登录，确定要继续吗？",
      okText: "确认修改",
      cancelText: "取消",
      okButtonProps: { danger: true },
      onOk: async () => {
        setIsSubmitting(true);
        try {
          await profileService.changePassword(
            user.username,
            user.token,
            values.oldPassword,
            values.newPassword
          );

          modal.success({
            className: "theme-modal",
            centered: true,
            title: "修改成功",
            content: "密码修改成功，即将跳转到登录页面",
            okText: "确定",
            onOk: () => {
              logout();
              window.location.href = "/login";
            },
          });

          form.resetFields();
        } catch (error) {
          modal.error({
            className: "theme-modal",
            centered: true,
            title: "修改失败",
            content: "密码修改失败，请检查旧密码是否正确",
          });
        } finally {
          setIsSubmitting(false);
        }
      },
    });
  };

  const handleReset = () => {
    form.resetFields();
  };

  return (
    <div className={styles.card}>
      {contextHolder}
      <div className={styles.cardHeader}>
        <SafetyCertificateOutlined style={{ color: "#d946ef" }} />
        <h3>账户安全</h3>
      </div>

      <Form
        form={form}
        layout="vertical"
        className={styles.bigForm}
        onFinish={handleSubmit}
        validateTrigger={["onBlur", "onSubmit"]}
      >
        <Row gutter={40}>
          <Col span={24}>
            <Form.Item
              name="oldPassword"
              label="验证旧密码"
              rules={[{ required: true, message: "请输入旧密码" }]}
            >
              <Input.Password prefix={<LockOutlined />} placeholder="请输入旧密码" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="newPassword"
              label="新密码"
              rules={[
                { required: true, message: "请输入新密码" },
                { min: 6, message: "密码长度至少为 6 位" },
                {
                  pattern: /^(?=.*[a-zA-Z])(?=.*\d).+$/,
                  message: "密码需同时包含字母和数字",
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("oldPassword") !== value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error("新密码不能与旧密码相同"));
                  },
                }),
              ]}
            >
              <Input.Password prefix={<KeyOutlined />} placeholder="设置新密码" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="confirmPassword"
              label="确认密码"
              dependencies={["newPassword"]}
              rules={[
                { required: true, message: "请确认新密码" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("newPassword") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error("两次输入的密码不一致"));
                  },
                }),
              ]}
            >
              <Input.Password prefix={<CheckCircleOutlined />} placeholder="再次确认新密码" />
            </Form.Item>
          </Col>
        </Row>

        <div
          style={{
            marginTop: "auto",
            textAlign: "right",
            display: "flex",
            gap: 12,
            justifyContent: "flex-end",
          }}
        >
          <Button onClick={handleReset}>重置</Button>
          <Button
            type="primary"
            danger
            htmlType="submit"
            icon={<KeyOutlined />}
            loading={isSubmitting}
            style={{ minWidth: 160 }}
          >
            修改密码
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default SecuritySettingsForm;
