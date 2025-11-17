import React, { useState } from "react";
import { Upload, Button, Image, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import type { UploadFile, UploadProps } from "antd/es/upload/interface";
import styles from "./Modules.module.scss";

const MonitoringModule: React.FC = () => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [imageUrl, setImageUrl] = useState<string>("");

  const props: UploadProps = {
    onRemove: (file) => {
      setFileList((prev) => prev.filter((f) => f.uid !== file.uid));
      setImageUrl("");
    },
    beforeUpload: (file) => {
      const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
      if (!isJpgOrPng) {
        message.error("您只能上传 JPG/PNG 格式的图片!");
        return false;
      }
      setFileList([file]);
      // 使用 FileReader 在前端预览图片
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        setImageUrl(reader.result as string);
      };
      return false; // 返回 false, 手动控制上传过程
    },
    fileList,
  };

  return (
    <div className={styles.moduleContainer}>
      <h2>画面监控模块</h2>
      <div className={styles.uploadSection}>
        <div>
          <Upload {...props}>
            <Button icon={<UploadOutlined />}>选择图片</Button>
          </Upload>
          <p style={{ marginTop: "16px", color: "#8b8a95" }}>请上传需要进行分析的监控画面。</p>
        </div>
        <div className={styles.preview}>
          {imageUrl ? <Image width={280} src={imageUrl} /> : <span>图片预览区</span>}
        </div>
      </div>
    </div>
  );
};

export default MonitoringModule;
