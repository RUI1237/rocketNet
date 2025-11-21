import React, { useEffect } from "react";
import { Modal, Form, Input } from "antd";

interface ProcessModalProps {
  visible: boolean;
  onSubmit: (notes: string) => Promise<void>;
  onCancel: () => void;
}

const ProcessModal: React.FC<ProcessModalProps> = ({ visible, onSubmit, onCancel }) => {
  const [form] = Form.useForm();

  // 每次打开时重置表单
  useEffect(() => {
    if (visible) {
      form.resetFields();
    }
  }, [visible, form]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      await onSubmit(values.notes);
    } catch (info) {
      console.log("Validate Failed:", info);
    }
  };

  return (
    <Modal
      title="处理报警反馈"
      open={visible}
      onOk={handleOk}
      onCancel={onCancel}
      okText="确认提交"
      cancelText="取消"
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="notes"
          label="处理备注"
          rules={[{ required: true, message: "请填写处理原因或备注" }]}
        >
          <Input.TextArea rows={4} placeholder="例如：误报，反光引起..." />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ProcessModal;
