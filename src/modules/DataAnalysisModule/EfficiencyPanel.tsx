import React, { useMemo } from "react";
import { Spin, Typography, Progress, Card } from "antd";
import type { DataAnalysisEfficiency } from "@/types";
import { DataAnalysisStyles as styles } from "@/styles";

const { Text } = Typography;

export interface EfficiencyPanelProps {
  efficiency: DataAnalysisEfficiency | null;
  loading: boolean;
}

export const EfficiencyPanel: React.FC<EfficiencyPanelProps> = ({ efficiency, loading }) => {
  const percent = useMemo(() => {
    if (!efficiency || efficiency.totalAlarms === 0) return 0;
    return Number(((efficiency.processedAlarms / efficiency.totalAlarms) * 100).toFixed(1));
  }, [efficiency]);

  return (
    <div className={styles.panel}>
      <div className={styles.panelHeader}>
        <span className="title" style={{ color: "rgba(31, 219, 204, 0.9)" }}>
          报警处理效率
        </span>
        <span className="subTitle" style={{ color: "#d9d9d9" }}>
          闭环率与平均处理时长
        </span>
      </div>
      <div className={styles.chartBody}>
        {loading ? (
          <Spin tip="效率数据加载中..." />
        ) : efficiency ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1.2fr 1.8fr",
              gap: 24,
              alignItems: "center",
              height: "100%",
            }}
          >
            {/* 左侧：报警闭环率环形图 */}
            <div style={{ textAlign: "center" }}>
              <Progress
                type="dashboard"
                percent={percent}
                strokeColor={{
                  "0%": "#40a9ff",
                  "100%": "#1fdbcc",
                }}
              />
              <Text style={{ display: "block", marginTop: 8, color: "#d9d9d9" }}>
                报警闭环率 = 已处理 / 总报警
              </Text>
              <Text style={{ display: "block", marginTop: 4, color: "#d9d9d9", fontSize: 12 }}>
                总：{efficiency.totalAlarms}，已处理：{efficiency.processedAlarms}，待处理：
                {efficiency.pendingAlarms}
              </Text>
            </div>

            {/* 右侧：平均处理时长指标卡片 */}
            <Card
              style={{
                background: "linear-gradient(135deg, rgba(31,219,204,0.15), rgba(64,169,255,0.1))",
                borderColor: "rgba(31,219,204,0.4)",
                color: "#ffffff",
              }}
              bodyStyle={{ padding: 20 }}
            >
              <Text style={{ color: "#d9d9d9", fontSize: 13 }}>平均处理时长</Text>
              <div style={{ marginTop: 10, marginBottom: 4, fontSize: 28, fontWeight: 600 }}>
                {efficiency.avgResolutionTimeMinutes}
                <span style={{ fontSize: 16, marginLeft: 4 }}>分钟</span>
              </div>
              <Text style={{ color: "#d9d9d9", fontSize: 12 }}>
                数值越小，说明运维响应越及时，闭环越迅速。
              </Text>
            </Card>
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
