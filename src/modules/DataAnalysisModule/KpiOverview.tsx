import React from "react";
import { Typography } from "antd";
import type { DataAnalysisKpi } from "@/types";
import { DataAnalysisStyles as styles } from "@/styles";

const { Text } = Typography;

export interface KpiOverviewProps {
  kpi: DataAnalysisKpi | null;
}

export const KpiOverview: React.FC<KpiOverviewProps> = ({ kpi }) => {
  return (
    <div className={styles.kpiRow}>
      <div className={styles.kpiCard}>
        <div className={styles.kpiLabel}>今日已处理任务数</div>
        <div className={styles.kpiValue}>{kpi?.tasksToday ?? "--"}</div>
        <Text type="secondary" style={{ fontSize: 12, color: "#d9d9d9" }}>
          实时统计今日系统完成的检测与处理任务总量
        </Text>
      </div>
      <div className={styles.kpiCard}>
        <div className={styles.kpiLabel}>今日新增报警</div>
        <div className={styles.kpiValue}>{kpi?.alarmsToday ?? "--"}</div>
        <Text type="secondary" style={{ fontSize: 12, color: "#d9d9d9" }}>
          监控今日产生的超规与异常告警次数
        </Text>
      </div>
      <div className={styles.kpiCard}>
        <div className={styles.kpiLabel}>累计拦截超规石块</div>
        <div className={styles.kpiValue}>{kpi?.totalAlarms ?? "--"}</div>
        <Text type="secondary" style={{ fontSize: 12, color: "#d9d9d9" }}>
          系统上线以来帮助拦截的超规风险总量
        </Text>
      </div>
      <div className={styles.kpiCard}>
        <div className={styles.kpiLabel}>待处理报警</div>
        <div className={styles.kpiValue}>{kpi?.pendingAlarms ?? "--"}</div>
        <Text type="secondary" style={{ fontSize: 12, color: "#d9d9d9" }}>
          当前仍在排队的告警数量
        </Text>
      </div>
    </div>
  );
};
