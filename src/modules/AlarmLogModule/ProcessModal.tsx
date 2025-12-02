import React, { useEffect } from "react";
import { Modal, Form, Input } from "antd";
// 引入你的 SCSS 样式文件
import styles from "@/styles/Log.module.scss";

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
      open={visible}
      // 1. 覆盖 AntD 默认模态框样式
      styles={{
        mask: {
          backgroundColor: "rgba(0, 0, 0, 0.85)", // 深色背景遮罩
          backdropFilter: "blur(4px)", // 模糊效果
        },
        content: {
          background: "transparent", // 关键：去除默认白色背景
          boxShadow: "none",
          padding: 0,
        },
      }}
      footer={null} // 2. 禁用默认 Footer，使用自定义按钮
      closable={false} // 禁用右上角叉号，保持界面整洁
      centered
      onCancel={onCancel}
    >
      {/* 3. 自定义深紫色面板容器 */}
      <div
        style={{
          background: "#1d103f", // 全局面板背景色
          border: "1px solid rgba(0, 221, 255, 0.3)", // 青色科技边框
          borderRadius: "8px",
          padding: "24px 28px",
          boxShadow: "0 0 30px rgba(0, 0, 0, 0.6), inset 0 0 20px rgba(0, 221, 255, 0.05)",
          minWidth: "420px",
        }}
      >
        {/* 4. 科技感标题 */}
        <div className={styles.handleModalTitle}>EVENT HANDLING // 异常处理</div>

        <Form form={form} layout="vertical">
          {/* 自定义 Label 样式 */}
          <div className={styles.techFormLabel}>PROCESSING NOTES / 处理备注</div>

          <Form.Item
            name="notes"
            rules={[{ required: true, message: "请填写处理原因或备注" }]}
            style={{ marginBottom: 0 }}
          >
            {/* 5. 深色科技风输入框 */}
            <Input.TextArea
              rows={5}
              placeholder="> 请输入误报原因、处理结果或备注信息..."
              className={styles.techInput}
            />
          </Form.Item>
        </Form>

        {/* 6. 自定义底部按钮组 */}
        <div className={styles.techFooter}>
          <button onClick={onCancel} className={styles.techBtnCancel}>
            CANCEL / 取消
          </button>
          <button onClick={handleOk} className={styles.techBtnPrimary}>
            CONFIRM SUBMIT / 确认提交
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ProcessModal;
