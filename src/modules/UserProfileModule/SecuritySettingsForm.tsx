import React from "react";
import { Button, Col, Row, Form, Input } from "antd";
import {
  SafetyCertificateOutlined,
  LockOutlined,
  KeyOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import styles from "@/styles/UserProfile.module.scss";
import { useAuthStore } from "@/stores";

interface SecuritySettingsFormProps {
  // onResetPass: (values: any) => void;
}

const SecuritySettingsForm: React.FC<SecuritySettingsFormProps> = () => {
  const [passForm] = Form.useForm();
  const { user, reSetPwd } = useAuthStore((state) => state);

  const handleFinish = async (values: any) => {
    // onResetPass(values);
    await reSetPwd({ ...user!, ...{ password: values.oldPassword } }, values.newPassword);
    passForm.resetFields(); // 提交成功后重置表单
  };

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <SafetyCertificateOutlined style={{ color: "#d946ef" }} />
        <h3>账户安全</h3>
      </div>

      <Form form={passForm} layout="vertical" className={styles.bigForm} onFinish={handleFinish}>
        <Row gutter={40}>
          <Col span={24}>
            <Form.Item name="oldPassword" label="验证旧密码" rules={[{ required: true }]}>
              <Input.Password prefix={<LockOutlined />} placeholder="请输入旧密码" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="newPassword" label="新密码" rules={[{ required: true }]}>
              <Input.Password prefix={<KeyOutlined />} placeholder="设置新密码" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="confirmPassword"
              label="确认密码"
              dependencies={["newPassword"]}
              rules={[
                { required: true },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("newPassword") === value) return Promise.resolve();
                    return Promise.reject(new Error("密码不一致"));
                  },
                }),
              ]}
            >
              <Input.Password prefix={<CheckCircleOutlined />} placeholder="再次确认" />
            </Form.Item>
          </Col>
        </Row>

        <div style={{ marginTop: "auto", textAlign: "right" }}>
          <Button
            type="primary"
            danger
            htmlType="submit"
            icon={<KeyOutlined />}
            style={{ minWidth: 160 }}
          >
            重置密码
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default SecuritySettingsForm;
