// src/pages/MonitoringModule.tsx
import React from "react";
import { Upload, Button, Image, Spin } from "antd";
import { UploadOutlined, ThunderboltOutlined } from "@ant-design/icons";
import styles from "@/styles/Modules.module.scss";
import { useMonitoringStore } from "@/stores";

const MonitoringModule: React.FC = () => {
  // --- 使用 Store ---
  const {
    originalFile,
    originalImageUrl,
    processedImageUrl,
    isLoading,
    fileList,
    setFile,
    clearFile,
    analyzeImage,
  } = useMonitoringStore();

  // --- Handlers ---
  const uploadProps = {
    fileList,
    onRemove: clearFile,
    beforeUpload: (file: File) => {
      setFile(file);
      return false;
    },
  };

  // --- Render Helpers ---
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
    <div
      className={styles.moduleContainer}
      style={{ height: "100%", display: "flex", flexDirection: "column" }}
    >
      <h2>画面监控与分析</h2>

      <div className={styles.uploadSection} style={{ flex: 1, minHeight: 0 }}>
        <div style={{ height: "100%", width: "100%", display: "flex", flexDirection: "column" }}>
          {/* 上传控制区 */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              // 【修改点】gap 改为百分比
              gap: "3%",
              // 【修改点】padding 改为百分比
              padding: "2%",
            }}
          >
            <div style={{ textAlign: "left" }}>
              <Upload {...uploadProps} maxCount={1}>
                <Button
                  icon={<UploadOutlined style={{ fontSize: "24px" }} />}
                  size="large"
                  style={{ padding: "0 40px", height: "60px", fontSize: "20px" }}
                >
                  选择图片
                </Button>
              </Upload>
              {/* margin也可以改为相对单位 */}
              <p style={{ marginTop: "1.5%", color: "#8b8a95", fontSize: "1rem" }}>
                请上传需要进行分析的监控画面。
              </p>
            </div>
          </div>

          {/* 预览与操作区 */}
          <div
            style={{
              display: "grid",
              // 保持 5fr 1fr 5fr 比例，这本质上就是百分比布局
              gridTemplateColumns: "5fr 1fr 5fr",
              // 【修改点】gap 改为百分比，适应屏幕宽度
              gap: "2%",
              // 【修改点】width 这里的 2150px 必须改为 100% 才能自适应
              width: "100%",
              // 确保 grid 容器高度也是撑满的（如果需要）
              height: "auto",
              // 垂直居中对齐所有子元素
              alignItems: "center",
              // 增加底部 padding 防止贴底
              paddingBottom: "2%",
            }}
          >
            {/* 左侧：原图 */}
            <div className={styles.preview} style={{ aspectRatio: "5 / 3", width: "100%" }}>
              {renderPreviewContent("original")}
            </div>

            {/* 中间：操作按钮 */}
            {/* 【修改点】去掉了 height: 200px，改为 Flex 居中，让它随左右高度自动居中 */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
              }}
            >
              <Button
                type="primary"
                icon={<ThunderboltOutlined style={{ fontSize: "24px" }} />}
                size="large"
                onClick={analyzeImage}
                loading={isLoading}
                disabled={!originalFile}
                // 按钮本身的尺寸建议保持 px 或者用 rem，以免在高分屏变得过大或过小
                // 这里保留 px 确保按钮手感，但外部容器已变为自适应
                style={{ padding: "0 50px", height: "70px", fontSize: "22px" }}
              >
                开始分析
              </Button>
            </div>

            {/* 右侧：结果图 */}
            <div className={styles.preview} style={{ aspectRatio: "5 / 3", width: "100%" }}>
              {renderPreviewContent("processed")}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonitoringModule;
