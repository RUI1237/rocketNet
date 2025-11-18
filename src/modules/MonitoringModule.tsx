import React from "react";
import { Upload, Button, Image, message, Spin } from "antd";
import { UploadOutlined, ThunderboltOutlined } from "@ant-design/icons";
import type { UploadFile } from "antd/es/upload/interface";
import styles from "@/styles/Modules.module.scss"; // 您的科技感样式文件
import { imageService } from "@/services";

const MonitoringModule: React.FC = () => {
  // --- State Management ---
  const [originalFile, setOriginalFile] = React.useState<File | null>(null);
  const [originalImageUrl, setOriginalImageUrl] = React.useState<string>("");
  const [processedImageUrl, setProcessedImageUrl] = React.useState<string>("");
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [fileList, setFileList] = React.useState<UploadFile[]>([]);

  // --- Handlers ---

  const uploadProps = {
    fileList,
    onRemove: () => {
      setFileList([]);
      setOriginalFile(null);
      setOriginalImageUrl("");
      setProcessedImageUrl("");
    },
    beforeUpload: (file: File) => {
      const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
      if (!isJpgOrPng) {
        message.error("您只能上传 JPG/PNG 格式的图片!");
        return Upload.LIST_IGNORE;
      }

      setOriginalFile(file);
      setFileList([file]);

      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        setOriginalImageUrl(reader.result as string);
        setProcessedImageUrl("");
      };

      return false;
    },
  };

  const handleAnalyze = async () => {
    if (!originalFile) {
      message.warn("请先选择一张图片！");
      return;
    }

    setIsLoading(true);
    setProcessedImageUrl("");

    const formData = new FormData();
    formData.append("image", originalFile);

    try {
      const response = await imageService.analyzeImage(formData);
      setProcessedImageUrl(response.processedUrl);
      message.success("图片分析完成！");
    } catch (error) {
      console.error("图片分析失败:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // --- Render ---

  const renderPreviewContent = (type: "original" | "processed") => {
    if (type === "original") {
      return originalImageUrl ? (
        <Image
          preview={false}
          width="100%"
          height="100%"
          style={{ objectFit: "contain" }}
          src={originalImageUrl}
        />
      ) : (
        <span style={{ fontSize: "1.2rem" }}>原始图片预览区</span>
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
          style={{ objectFit: "contain" }}
          src={processedImageUrl}
        />
      ) : (
        <span style={{ fontSize: "1.2rem" }}>分析结果预览区</span>
      );
    }
  };

  return (
    // 1. 让根容器占满父元素的高度
    <div
      className={styles.moduleContainer}
      style={{ height: "100%", display: "flex", flexDirection: "column" }}
    >
      <h2>画面监控与分析</h2>

      {/* 2. 让这个 grid 容器占据所有剩余空间 */}
      <div className={styles.uploadSection} style={{ flex: 1, minHeight: 0 }}>
        {/* --- 左侧控制区域 --- */}
        {/* 3. 使用 Flexbox 布局，让内容垂直分布并居中 */}
        <div style={{ height: "100%", width: "100%", display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              // justifyContent: "center",
              // alignItems: "center",
              gap: "40px",
              padding: "24px",
            }}
          >
            <div style={{ textAlign: "left" }}>
              {/* 4. 放大上传组件 */}
              <Upload {...uploadProps}>
                <Button
                  icon={<UploadOutlined style={{ fontSize: "24px" }} />}
                  size="large"
                  style={{ padding: "0 40px", height: "60px", fontSize: "20px" }}
                >
                  选择图片
                </Button>
              </Upload>
              <p style={{ marginTop: "24px", color: "#8b8a95", fontSize: "1rem" }}>
                请上传需要进行分析的监控画面。
              </p>
            </div>
          </div>

          {/* --- 右侧预览区域 --- */}
          {/* 6. 让这个嵌套的 grid 占满其父单元格的高度 */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "5fr 1fr 5fr",
              gap: "50px",
              width: "2150px",
            }}
          >
            <div className={styles.preview} style={{ aspectRatio: "5 / 3", minHeight: "10px" }}>
              {renderPreviewContent("original")}
            </div>
            <div style={{ textAlign: "center", height: "200px" }}>
              <Button
                type="primary"
                icon={<ThunderboltOutlined style={{ fontSize: "24px" }} />}
                size="large"
                onClick={handleAnalyze}
                loading={isLoading}
                disabled={!originalFile}
                style={{ padding: "0 50px", height: "70px", fontSize: "22px" }}
              >
                开始分析
              </Button>
            </div>
            {/* 6. 右侧的框：应用您的样式和 3:5 宽高比 */}
            <div className={styles.preview} style={{ aspectRatio: "5 / 3", minHeight: "10px" }}>
              {renderPreviewContent("processed")}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonitoringModule;
