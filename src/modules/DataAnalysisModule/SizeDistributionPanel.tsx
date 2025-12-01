import React from "react";
import { Spin, Typography } from "antd";
import type { DataAnalysisSizeDistribution } from "@/types";
import { DataAnalysisStyles as styles } from "@/styles";

const { Text } = Typography;

export interface SizeDistributionPanelProps {
  sizeDistribution: DataAnalysisSizeDistribution | null;
  loading: boolean;
}

export const SizeDistributionPanel: React.FC<SizeDistributionPanelProps> = ({
  sizeDistribution,
  loading,
}) => {
  return (
    <div className={styles.panel}>
      <div className={styles.panelHeader}>
        <span className="title">超规尺寸风险分布</span>
        <span className="subTitle" style={{ color: "#d9d9d9" }}>
          识别主要风险尺寸区间
        </span>
      </div>
      <div className={styles.chartBody}>
        {loading ? (
          <Spin tip="尺寸分布数据加载中..." />
        ) : sizeDistribution ? (
          <pre
            style={{
              height: "100%",
              margin: 0,
              padding: 12,
              fontSize: 12,
              background: "rgba(0,0,0,0.3)",
              overflow: "auto",
              color: "#d9d9d9",
            }}
          >
            {JSON.stringify(sizeDistribution, null, 2)}
          </pre>
        ) : (
          <Text type="secondary" style={{ color: "#d9d9d9" }}>
            暂无尺寸分布数据
          </Text>
        )}
      </div>
    </div>
  );
};
