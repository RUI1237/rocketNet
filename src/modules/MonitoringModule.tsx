// src/pages/MonitoringModule.tsx
import React, { useEffect } from "react";
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
        return <Spin tip="分析中..." size="large" fullscreen />;
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
  useEffect(() => {
    return () => {
      // 这里的逻辑会在两种情况下执行：
      // 1. previewImage 发生变化前（比如你切到了下一张图，它会把上一张的 URL 销毁）
      // 2. 组件卸载时（比如你跳到了别的页面）
      // if (processedImageUrl && processedImageUrl.startsWith("blob:")) {
      //   console.log("正在释放内存:", processedImageUrl);
      //   window.URL.revokeObjectURL(processedImageUrl);
      // }
    };
  }, [processedImageUrl]);
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
              gridTemplateColumns: "5fr 1fr 5fr",
              gap: "2%",
              width: "100%",
              height: "auto",
              alignItems: "center",
              paddingBottom: "2%",
            }}
          >
            {/* 左侧：原图 */}
            <div className={styles.preview} style={{ aspectRatio: "5 / 3", width: "100%" }}>
              {renderPreviewContent("original")}
            </div>

            {/* 中间：操作按钮 */}
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
