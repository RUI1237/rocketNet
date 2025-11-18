import React from "react";
import { BarChartOutlined } from "@ant-design/icons";
import styles from "@/styles/Modules.module.scss";

const DataAnalysisModule: React.FC = () => {
  return (
    <div
      className={styles.moduleContainer}
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "2rem",
        color: "#8b8a95",
      }}
    >
      <BarChartOutlined style={{ fontSize: "5rem" }} />
      <h2 style={{ padding: 0, margin: 0, border: "none" }}>数据分析模块</h2>
      <p>此功能模块正在开发中，敬请期待。</p>
    </div>
  );
};

export default DataAnalysisModule;
