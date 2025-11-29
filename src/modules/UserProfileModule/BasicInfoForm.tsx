import React, { useEffect } from "react";
import { Button, Col, Row, Form, Input } from "antd";
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  IdcardOutlined,
  RocketOutlined,
} from "@ant-design/icons";
import styles from "@/styles/UserProfile.module.scss";
import { useAuthStore } from "@/stores";

interface BasicInfoFormProps {
  // initialValues: User;
  // onFinish: (values: Partial<User>) => void;
}

const BasicInfoForm: React.FC<BasicInfoFormProps> = () => {
  const { user, reSetInf } = useAuthStore((state) => state);
  // console.log("basicl", user);
  const [form] = Form.useForm();

  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        username: user.username,
        // phone: user.phone,
        email: user.email,
      });
    }
  }, [user]);
  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <IdcardOutlined />
        <h3>基本资料配置</h3>
      </div>

      <Form
        form={form}
        layout="vertical"
        // initialValues={user!}
        className={styles.bigForm}
        onFinish={async (data) => await reSetInf({ ...user, ...data })}
      >
        <Row gutter={40}>
          <Col span={24}>
            <Form.Item name="username" label="用户昵称">
              <Input prefix={<UserOutlined />} />
            </Form.Item>
          </Col>
          {/* <Col span={12}>
            <Form.Item name="phone" label="联系电话">
              <Input prefix={<PhoneOutlined />} />
            </Form.Item>
          </Col> */}
          <Col span={24}>
            <Form.Item
              name="email"
              label="电子邮箱"
              rules={[{ type: "email", message: "格式不正确" }]}
            >
              <Input prefix={<MailOutlined />} />
            </Form.Item>
          </Col>
        </Row>

        <div style={{ marginTop: "auto", textAlign: "right" }}>
          <Button
            type="primary"
            htmlType="submit"
            icon={<RocketOutlined />}
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
