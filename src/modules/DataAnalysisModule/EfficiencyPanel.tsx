import React from "react";
import { Spin, Typography } from "antd";
import type { DataAnalysisEfficiency } from "@/types";
import { DataAnalysisStyles as styles } from "@/styles";

const { Text } = Typography;

export interface EfficiencyPanelProps {
  efficiency: DataAnalysisEfficiency | null;
  loading: boolean;
}

export const EfficiencyPanel: React.FC<EfficiencyPanelProps> = ({ efficiency, loading }) => {
  return (
    <div className={styles.panel}>
      <div className={styles.panelHeader}>
        <span className="title">报警处理效率</span>
        <span className="subTitle" style={{ color: "#d9d9d9" }}>
          闭环率与平均处理时长
        </span>
      </div>
      <div className={styles.chartBody}>
        {loading ? (
          <Spin tip="效率数据加载中..." />
        ) : efficiency ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 8, color: "#d9d9d9" }}>
            <Text style={{ color: "#d9d9d9" }}>
              总报警数：{efficiency.totalAlarms}，已处理：{efficiency.processedAlarms}，待处理：
              {efficiency.pendingAlarms}
            </Text>
            <Text style={{ color: "#d9d9d9" }}>
              平均处理时长：
              <Text strong style={{ color: "#ffffff" }}>
                {efficiency.avgResolutionTimeMinutes} 分钟
              </Text>
            </Text>
          </div>
        ) : (
          <Text type="secondary" style={{ color: "#d9d9d9" }}>
            暂无效率数据
          </Text>
        )}
      </div>
    </div>
  );
};
