import React, { useState, useCallback } from "react";
import { Upload, Button, Image, Spin, message } from "antd";
import { UploadOutlined, ThunderboltOutlined, DeleteOutlined } from "@ant-design/icons";
import type { UploadFile } from "antd";
import styles from "../styles/Monitoring.module.scss";
import { monitoringService } from "../services/monitoring.service";

const MonitoringModule: React.FC = () => {
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [originalImageUrl, setOriginalImageUrl] = useState("");
  const [processedImageUrl, setProcessedImageUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const handleSetFile = useCallback((file: File) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("您只能上传 JPG/PNG 格式的图片!");
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setOriginalFile(file);
      setFileList([file as unknown as UploadFile]);
      setOriginalImageUrl(reader.result as string);
      setProcessedImageUrl("");
    };
  }, []);

  const handleClearFile = useCallback(() => {
    if (processedImageUrl) {
      URL.revokeObjectURL(processedImageUrl);
    }
    setOriginalFile(null);
    setOriginalImageUrl("");
    setProcessedImageUrl("");
    setFileList([]);
  }, [processedImageUrl]);

  const handleAnalyzeImage = useCallback(async () => {
    if (!originalFile) {
      message.error("请先选择一张图片！");
      return;
    }

    setIsLoading(true);
    setProcessedImageUrl("");

    const formData = new FormData();
    formData.append("image", originalFile);

    try {
      const result = await monitoringService.analyzeImage(formData);
      setProcessedImageUrl(result);
      message.success("图片分析完成！");
    } catch (error) {
      console.error("图片分析失败:", error);
      message.error("分析失败，请稍后重试");
    } finally {
      setIsLoading(false);
    }
  }, [originalFile]);

  const uploadProps = {
    fileList,
    onRemove: handleClearFile,
    beforeUpload: (file: File) => {
      handleSetFile(file);
      return false;
    },
  };

  const renderPreviewContent = (type: "original" | "processed") => {
    if (type === "original") {
      return originalImageUrl ? (
        <Image
          preview={false}
          width="100%"
          height="100%"
          className={styles.previewImage}
          src={originalImageUrl}
        />
      ) : (
        <span className={styles.previewPlaceholder}>原始图片预览区</span>
      );
    }

    if (type === "processed") {
      if (isLoading) {
        return <Spin tip="分析中..." size="large" />;
      }
      return processedImageUrl ? (
        <Image
          preview={false}
          width="100%"
          height="100%"
          className={styles.previewImage}
          src={processedImageUrl}
        />
      ) : (
        <span className={styles.previewPlaceholder}>分析结果预览区</span>
      );
    }
  };

  return (
    <div className={styles.moduleContainer}>
      <h2>画面监控与分析</h2>

      <div className={styles.uploadSection}>
        <div className={styles.contentWrapper}>
          {/* 上传控制区 */}
          <div className={styles.uploadControls}>
            <div className={styles.uploadArea}>
              <Upload {...uploadProps} maxCount={1}>
                <Button
                  icon={<UploadOutlined className={styles.iconLarge} />}
                  size="large"
                  className={styles.uploadButton}
                >
                  选择图片
                </Button>
              </Upload>
              <p className={styles.uploadHint}>请上传需要进行分析的监控画面。</p>
            </div>
          </div>

          {/* 预览与操作区 */}
          <div className={styles.previewOperationArea}>
            {/* 左侧：原图 */}
            <div className={styles.preview}>{renderPreviewContent("original")}</div>

            {/* 中间：操作按钮 */}
            <div className={styles.actionButtonArea}>
              <Button
                type="primary"
                icon={<ThunderboltOutlined className={styles.iconLarge} />}
                size="large"
                onClick={handleAnalyzeImage}
                loading={isLoading}
                disabled={!originalFile}
                className={styles.analyzeButton}
              >
                开始分析
              </Button>
              {originalFile && (
                <Button
                  icon={<DeleteOutlined />}
                  size="large"
                  onClick={handleClearFile}
                  style={{ marginTop: 12 }}
                >
                  清除
                </Button>
              )}
            </div>

            {/* 右侧：结果图 */}
            <div className={styles.preview}>{renderPreviewContent("processed")}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonitoringModule;
