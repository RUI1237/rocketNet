import React, { useEffect } from "react";
import { Spin } from "antd";
import { useDataAnalysisStore } from "@/stores";
import { DataAnalysisStyles as styles } from "@/styles";
import { KpiOverview } from "./KpiOverview";
import { TrendsPanel } from "./TrendsPanel";
import { EfficiencyPanel } from "./EfficiencyPanel";
import { SizeDistributionPanel } from "./SizeDistributionPanel";
import { LatestAlarmsWall } from "./LatestAlarmsWall";

const DataAnalysisModule: React.FC = () => {
  const { kpi, trends24h, efficiency, sizeDistribution, latestAlarms, fetchAll } =
    useDataAnalysisStore();

  const {
    loadingKpi,
    loadingTrends,
    loadingEfficiency,
    loadingSizeDistribution,
    loadingLatestAlarms,
  } = useDataAnalysisStore();

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const isAnyLoading =
    loadingKpi ||
    loadingTrends ||
    loadingEfficiency ||
    loadingSizeDistribution ||
    loadingLatestAlarms;

  return (
    <div className={styles.dashboardRoot}>
      <KpiOverview kpi={kpi} />

      {/* 中部：趋势 & 效率 + 尺寸分布 */}
      <div className={styles.chartsRow} style={{ flex: 1, minHeight: 0 }}>
        <TrendsPanel trends24h={trends24h} loading={loadingTrends} />

        {/* 右侧：报警效率 & 尺寸分布概览 */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <EfficiencyPanel efficiency={efficiency} loading={loadingEfficiency} />
          <SizeDistributionPanel
            sizeDistribution={sizeDistribution}
            loading={loadingSizeDistribution}
          />
          <LatestAlarmsWall latestAlarms={latestAlarms} loading={loadingLatestAlarms} />
        </div>
      </div>

      {isAnyLoading && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: "none",
          }}
        >
          <Spin />
        </div>
      )}
    </div>
  );
};

export default DataAnalysisModule;
