import React from "react";
import { Spin, Typography } from "antd";
import { BarChartOutlined } from "@ant-design/icons";
import type { DataAnalysisTrends24h } from "@/types";
import { DataAnalysisStyles as styles } from "@/styles";

const { Text } = Typography;

export interface TrendsPanelProps {
  trends24h: DataAnalysisTrends24h | null;
  loading: boolean;
}

export const TrendsPanel: React.FC<TrendsPanelProps> = ({ trends24h, loading }) => {
  return (
    <div className={styles.panel}>
      <div className={styles.panelHeader}>
        <span className="title">
          <BarChartOutlined style={{ marginRight: 8, color: "#40a9ff" }} />
          24 小时任务 / 报警趋势
        </span>
        <span className="subTitle" style={{ color: "#d9d9d9" }}>
          体现系统 24 小时不间断智能监控能力
        </span>
      </div>
      <div className={styles.chartBody}>
        {loading ? (
          <Spin tip="趋势数据加载中..." />
        ) : trends24h ? (
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
            {/* 这里先用 JSON 预览数据，方便之后你替换为 ECharts 或 G2 图表 */}
            {JSON.stringify(trends24h, null, 2)}
          </pre>
        ) : (
          <Text type="secondary" style={{ color: "#d9d9d9" }}>
            暂无趋势数据
          </Text>
        )}
      </div>
    </div>
  );
};
