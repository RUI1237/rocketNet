import React, { useState } from "react";
import { Button, Col, Row, Form, Input, message } from "antd";
import { UserOutlined, MailOutlined, IdcardOutlined, RocketOutlined } from "@ant-design/icons";
import styles from "../styles/UserProfile.module.scss";
import { profileService } from "../services/profile.service";
import type { User } from "@/features/auth/types/auth.types";

interface BasicInfoFormProps {
  user: User;
  onRefresh: () => void;
}

const BasicInfoForm: React.FC<BasicInfoFormProps> = ({ user, onRefresh }) => {
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (values: { username: string; email: string }) => {
    setIsSubmitting(true);
    try {
      await profileService.updateBasicInfo({
        ...user,
        email: values.email,
      });

      message.success("基本资料修改成功！");
      onRefresh();
    } catch (error) {
      message.error("修改失败，请稍后重试");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <IdcardOutlined />
        <h3>基本资料配置</h3>
      </div>

      <Form
        form={form}
        layout="vertical"
        className={styles.bigForm}
        onFinish={handleSubmit}
        key={user.username}
        initialValues={user}
      >
        <Row gutter={40}>
          <Col span={24}>
            <Form.Item name="username" label="用户昵称">
              <Input prefix={<UserOutlined />} disabled />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name="email"
              label="电子邮箱"
              rules={[
                { required: true, message: "请输入邮箱" },
                { type: "email", message: "邮箱格式不正确" },
              ]}
            >
              <Input prefix={<MailOutlined />} placeholder="请输入邮箱" />
            </Form.Item>
          </Col>
        </Row>

        <div style={{ marginTop: "auto", textAlign: "right" }}>
          <Button
            type="primary"
            htmlType="submit"
            icon={<RocketOutlined />}
            loading={isSubmitting}
            style={{ minWidth: 160 }}
          >
            保存更改
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default BasicInfoForm;
