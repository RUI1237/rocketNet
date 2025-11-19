// src/pages/MonitoringModule.tsx (或您的路径)
import React from "react";
import { Upload, Button, Image, Spin } from "antd";
import { UploadOutlined, ThunderboltOutlined } from "@ant-design/icons";
import styles from "@/styles/Modules.module.scss";
import { useMonitoringStore } from "@/stores"; // 引入 Store

const MonitoringModule: React.FC = () => {
  // --- 使用 Store ---
  // 使用解构获取状态和方法
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
  // 即使逻辑在 Store 里，Upload 组件的一些特定回调（如 beforeUpload 返回 false）
  // 仍然需要在组件层作为“胶水”代码存在。
  const uploadProps = {
    fileList,
    onRemove: clearFile,
    beforeUpload: (file: File) => {
      setFile(file);
      // 阻止自动上传（Antd 默认行为），因为我们是手动点击分析按钮才上传
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
              gap: "40px",
              padding: "24px",
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
              <p style={{ marginTop: "24px", color: "#8b8a95", fontSize: "1rem" }}>
                请上传需要进行分析的监控画面。
              </p>
            </div>
          </div>

          {/* 预览与操作区 */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "5fr 1fr 5fr",
              gap: "50px",
              width: "2150px",
            }}
          >
            {/* 左侧：原图 */}
            <div className={styles.preview} style={{ aspectRatio: "5 / 3", minHeight: "10px" }}>
              {renderPreviewContent("original")}
            </div>

            {/* 中间：操作按钮 */}
            <div style={{ textAlign: "center", height: "200px" }}>
              <Button
                type="primary"
                icon={<ThunderboltOutlined style={{ fontSize: "24px" }} />}
                size="large"
                onClick={analyzeImage} // 直接绑定 Store 中的方法
                loading={isLoading}
                disabled={!originalFile}
                style={{ padding: "0 50px", height: "70px", fontSize: "22px" }}
              >
                开始分析
              </Button>
            </div>

            {/* 右侧：结果图 */}
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
