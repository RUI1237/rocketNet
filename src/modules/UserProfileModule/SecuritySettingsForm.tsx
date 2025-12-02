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
  const { user, reSetInf } = useAuthStore((state) => state);

  const handleFinish = async (values: any) => {
    // onResetPass(values);
    await reSetInf({
      ...user!,
      password: values.newPassword,
      oldPassword: values.oldPassword,
    });
    passForm.resetFields(); // 提交成功后重置表单
  };

  // 账户安全卡片，点击非表单区域时清除验证报错
  return (
    <div
      className={styles.card}
      // onClick={(e) => {
      //   // 如果点击的是card区域但不是Form中的元素，则清除所有表单校验
      //   // 判断点击的目标是否在表单内
      //   // 只在点击卡片时（不在表单内），并且表单有规则校验报错时才清除
      //   const formElem = document.querySelector(`.${styles.bigForm}`);
      //   if (formElem && !(formElem as HTMLElement).contains(e.target as Node)) {
      //     // 只在有显示的校验报错时(即规则还在)清除显示
      //     const errorFields = passForm
      //       .getFieldsError(["oldPassword", "newPassword", "confirmPassword"])
      //       .filter(({ errors }) => errors.length > 0)
      //       .map(({ name }) => ({
      //         name,
      //         errors: [],
      //       }));
      //     if (errorFields.length) {
      //       passForm.setFields(errorFields);
      //     }
      //   }
      // }}
      style={{ position: "relative" }}
    >
      <div className={styles.cardHeader}>
        <SafetyCertificateOutlined style={{ color: "#d946ef" }} />
        <h3>账户安全</h3>
      </div>

      <Form
        form={passForm}
        layout="vertical"
        className={styles.bigForm}
        onFinish={handleFinish}
        validateTrigger={["onSubmit"]}
      >
        <Row gutter={40}>
          <Col span={24}>
            <Form.Item name="oldPassword" label="验证旧密码" rules={[{ required: true }]}>
              <Input.Password prefix={<LockOutlined />} placeholder="请输入旧密码" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="newPassword"
              label="新密码"
              rules={[
                { required: true, message: "请输入新密码!" },
                { min: 6, message: "密码长度至少为 6 位" },
                { pattern: /^(?=.*[a-zA-Z])(?=.*\d).+$/, message: "密码需同时包含字母和数字" },
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
